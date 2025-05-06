const Module = require('../models/Module');
const SetModel = require('../models/Set');
const Question = require('../models/Question');

// Helper function to validate module code format
exports.validateModuleCode = (moduleCode) => {
    // Module code should be letters followed by optional numbers
    const pattern = /^[A-Z]+\d*$/;
    if (!pattern.test(moduleCode)) {
        throw new Error(`Invalid module code format: ${moduleCode}. Expected format: Letters followed by optional numbers (e.g., PH1)`);
    }
    return true;
};

// Helper function to validate set order number
exports.validateSetOrderNumber = (orderNumber) => {
    const number = parseFloat(orderNumber);
    if (isNaN(number) || number <= 0) {
        throw new Error(`Invalid set order number: ${orderNumber}. Must be a positive number.`);
    }
    return true;
};

// Basic question upload handler (for backward compatibility)
exports.uploadQuestions = async (req, res) => {
    try {
        const { questions } = req.body;

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: 'Invalid or empty questions array' });
        }

        // Insert the questions
        await Question.insertMany(questions.map(q => ({
            question: q.question || '',
            answer: q.answer || '',
            moreInfo: q.moreInfo || '',
            moduleCode: q.moduleCode || 'MISC',
            setCode: q.setCode || 'MISC',
            setName: q.setName || q.setCode || 'Miscellaneous',
            setDescription: q.setDescription || ''
        })));

        res.status(200).json({
            message: 'Questions uploaded successfully',
            count: questions.length
        });
    } catch (error) {
        console.error('Error uploading questions:', error);
        res.status(500).json({
            error: error.message || 'Error uploading questions'
        });
    }
};

// Process Excel upload with full validation and metadata
exports.processExcelUpload = async (req, res) => {
    try {
        const { modules, questions } = req.body;
        console.log({ modules, questions });

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: 'No valid questions found in the upload' });
        }

        // Track created/updated items using JavaScript Sets
        const processedModuleCodes = new Set();
        const processedSetCodes = new Set();
        const results = {
            modulesCreated: 0,
            modulesUpdated: 0,
            setsCreated: 0,
            setsUpdated: 0,
            questionsCreated: questions.length
        };

        // Process each question to create/update modules and sets
        for (const question of questions) {
            const { moduleCode, setCode, setOrder } = question;

            try {
                // Validate module code and set order
                validateModuleCode(moduleCode);
                const [_, orderNumber] = setOrder.split('.');
                validateSetOrderNumber(orderNumber);

                // Create/update module if not processed yet
                if (!processedModuleCodes.has(moduleCode)) {
                    const moduleData = modules.find(m => m.module === moduleCode);
                    const existingModule = await Module.findOne({ moduleCode });

                    if (existingModule) {
                        // Update only if new data is provided
                        if (moduleData?.moduleName || moduleData?.moduleDescription) {
                            await Module.findOneAndUpdate(
                                { moduleCode },
                                {
                                    moduleName: moduleData.moduleName || existingModule.moduleName,
                                    moduleDescription: moduleData.moduleDescription || existingModule.moduleDescription,
                                    updatedAt: new Date()
                                }
                            );
                            results.modulesUpdated++;
                        }
                    } else {
                        // Create new module
                        await Module.create({
                            moduleCode,
                            moduleName: moduleData?.moduleName || moduleCode,
                            moduleDescription: moduleData?.moduleDescription || '',
                            createdBy: 'user',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        });
                        results.modulesCreated++;
                    }
                    processedModuleCodes.add(moduleCode);

                    // Process sets for this module
                    if (moduleData?.sets) {
                        for (const setData of moduleData.sets) {
                            if (!processedSetCodes.has(setData.setCode)) {
                                const existingSet = await SetModel.findOne({ setCode: setData.setCode });
                                const setToUpsert = {
                                    setCode: setData.setCode,
                                    moduleCode,
                                    setOrder: setData.setOrder,
                                    setName: setData.setName || setData.setCode,
                                    setDescription: setData.setDescription || '',
                                    questionCount: questions.filter(q => q.setCode === setData.setCode).length,
                                    updatedAt: new Date()
                                };

                                if (existingSet) {
                                    await SetModel.findOneAndUpdate(
                                        { setCode: setData.setCode },
                                        setToUpsert
                                    );
                                    results.setsUpdated++;
                                } else {
                                    await SetModel.create({
                                        ...setToUpsert,
                                        createdBy: 'user',
                                        createdAt: new Date()
                                    });
                                    results.setsCreated++;
                                }
                                processedSetCodes.add(setData.setCode);
                            }
                        }
                    }
                }

                // Create/update set if not processed yet
                if (!processedSetCodes.has(setCode)) {
                    const setToUpsert = {
                        setCode,
                        moduleCode,
                        setOrder: parseFloat(orderNumber),
                        setName: question.setName || setCode,
                        setDescription: question.setDescription || '',
                        questionCount: questions.filter(q => q.setCode === setCode).length,
                        updatedAt: new Date()
                    };

                    const existingSet = await SetModel.findOne({ setCode });
                    if (existingSet) {
                        await SetModel.findOneAndUpdate({ setCode }, setToUpsert);
                        results.setsUpdated++;
                    } else {
                        await SetModel.create({
                            ...setToUpsert,
                            createdBy: 'user',
                            createdAt: new Date()
                        });
                        results.setsCreated++;
                    }
                    processedSetCodes.add(setCode);
                }
            } catch (error) {
                // Log the error but continue processing other questions
                console.error(`Error processing question in set ${setCode}:`, error);
                throw error; // Re-throw to be caught by outer try-catch
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
            category: q.category || '',
            subCategory1: q.subCategory1 || '',
            subCategory2: q.subCategory2 || '',
            serialNumber: q.serialNumber || '',
            createdBy: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
        })));

        res.status(200).json({
            message: 'Upload processed successfully',
            results
        });

    } catch (error) {
        console.error('Error processing excel upload:', error);
        res.status(500).json({
            error: error.message || 'Error processing excel upload'
        });
    }
};
