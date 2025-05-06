const Question = require('../models/Question');
const Module = require('../models/Module');
const Set = require('../models/Set');
const { parseCSV } = require('../utils/csvFormatter');
const { validateModuleCode, validateSetOrderNumber } = require('./uploadController');

// Helper function to process questions and create/update modules and sets
async function processQuestions(questions, isReplace = false) {
    const processedModules = new Set();
    const processedSets = new Set();
    const results = {
        modulesCreated: 0,
        modulesUpdated: 0,
        setsCreated: 0,
        setsUpdated: 0,
        questionsCreated: questions.length
    };

    // If replacing, delete all existing data
    if (isReplace) {
        await Promise.all([
            Question.deleteMany({}),
            Module.deleteMany({}),
            Set.deleteMany({})
        ]);
    }

    // Process each question to create/update modules and sets
    for (const question of questions) {
        const { moduleCode, setCode, setOrder } = question;

        try {
            // Validate module code and set order
            validateModuleCode(moduleCode);
            const [_, orderNumber] = setOrder.split('.');
            validateSetOrderNumber(orderNumber);

            // Create/update module if not processed yet
            if (!processedModules.has(moduleCode)) {
                const existingModule = await Module.findOne({ moduleCode });

                if (existingModule) {
                    // Update only if new data is provided
                    if (question.moduleName || question.moduleDescription) {
                        await Module.findOneAndUpdate(
                            { moduleCode },
                            {
                                moduleName: question.moduleName || existingModule.moduleName,
                                moduleDescription: question.moduleDescription || existingModule.moduleDescription
                            }
                        );
                        results.modulesUpdated++;
                    }
                } else {
                    // Create new module
                    await Module.create({
                        moduleCode,
                        moduleName: question.moduleName || moduleCode,
                        moduleDescription: question.moduleDescription || '',
                        createdBy: 'admin'
                    });
                    results.modulesCreated++;
                }
                processedModules.add(moduleCode);
            }

            // Create/update set if not processed yet
            if (!processedSets.has(setCode)) {
                const setData = {
                    setCode,
                    moduleCode,
                    setOrder: parseFloat(orderNumber),
                    setName: question.setName || setCode,
                    setDescription: question.setDescription || '',
                    questionCount: questions.filter(q => q.setCode === setCode).length
                };

                const existingSet = await Set.findOne({ setCode });
                if (existingSet) {
                    await Set.findOneAndUpdate({ setCode }, setData);
                    results.setsUpdated++;
                } else {
                    await Set.create(setData);
                    results.setsCreated++;
                }
                processedSets.add(setCode);
            }
        } catch (error) {
            console.error(`Error processing question in set ${setCode}:`, error);
            throw error;
        }
    }

    // Create all questions
    await Question.insertMany(questions.map(q => ({
        question: q.question,
        answer: q.answer,
        moreInfo: q.moreInfo || '',
        moduleCode: q.moduleCode,
        setCode: q.setCode,
        setName: q.setName || q.setCode,
        setDescription: q.setDescription || '',
        setOrder: q.setOrder
    })));

    return results;
}

// Add questions with full validation
exports.addAdminQuestions = async (req, res) => {
    try {
        const { questions } = req.body;

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: 'Invalid or empty questions array' });
        }

        const results = await processQuestions(questions, false);

        res.json({
            message: 'Questions added successfully',
            results
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Replace all questions with full validation
exports.replaceAdminQuestions = async (req, res) => {
    try {
        const { questions } = req.body;

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: 'Invalid or empty questions array' });
        }

        const results = await processQuestions(questions, true);

        res.json({
            message: 'Questions replaced successfully',
            results
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all questions with module and set information
exports.getAdminQuestions = async (req, res) => {
    try {
        const questions = await Question.find()
            .sort({ moduleCode: 1, setOrder: 1, serialNumber: 1 })
            .lean();

        // Enrich questions with module and set information
        const enrichedQuestions = await Promise.all(questions.map(async (q) => {
            const [module, set] = await Promise.all([
                Module.findOne({ moduleCode: q.moduleCode }).lean(),
                Set.findOne({ setCode: q.setCode }).lean()
            ]);

            return {
                ...q,
                moduleName: module?.moduleName || q.moduleCode,
                moduleDescription: module?.moduleDescription || '',
                setName: set?.setName || q.setCode,
                setDescription: set?.setDescription || '',
                setOrder: set?.setOrder || 0
            };
        }));

        res.json(enrichedQuestions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Export questions with full metadata
exports.exportAdminCSV = async (req, res) => {
    try {
        const questions = await Question.find()
            .sort({ moduleCode: 1, setOrder: 1, serialNumber: 1 })
            .lean();

        console.log('Found questions:', questions.length);

        if (!questions.length) {
            return res.status(404).json({ error: 'No questions to export' });
        }

        // Enrich questions with module and set information before export
        const enrichedQuestions = await Promise.all(questions.map(async (q) => {
            const [module, set] = await Promise.all([
                Module.findOne({ moduleCode: q.moduleCode }).lean(),
                Set.findOne({ setCode: q.setCode }).lean()
            ]);

            console.log('Processing question:', {
                question: q,
                moduleCode: q.moduleCode,
                setCode: q.setCode,
                moduleFound: module,
                setFound: set
            });

            // Format exactly as shown in the image
            return {
                Question: q.question || '',
                Answer: q.answer || '',
                'More info': q.moreInfo || '',
                Category: q.category || '',
                'Subcategory 1': q.subCategory1 || '',
                'Subcategory 2': q.subCategory2 || '',
                'Subcategory 3': q.subCategory3 || '',
                'Subcategory 4': q.subCategory4 || '',
                Set: q.setCode || '',
                'Set Name (max 25 characters)': (set?.setName || q.setCode || '').substring(0, 25),
                'Set Description': (set?.setDescription || '').substring(0, 100),
                'Set order': `${q.moduleCode || ''}.${set?.setOrder ?? ''}`,
                Serial: q.serialNumber || '',
                Comment: q.comment || ''
            };
        }));

        console.log('Total enriched questions:', enrichedQuestions.length);
        if (enrichedQuestions.length > 0) {
            console.log('Sample enriched question:', enrichedQuestions[0]);
        }

        const csvData = await parseCSV(enrichedQuestions);
        console.log('CSV data length:', csvData?.length);
        if (csvData?.length > 0) {
            console.log('First 200 chars of CSV:', csvData.substring(0, 200));
        }

        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', `attachment; filename=flashcards_export_${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csvData);
    } catch (err) {
        console.error('Export error:', err);
        res.status(500).json({ error: err.message });
    }
};
