const Question = require('../models/Question');
const Set = require('../models/Set');
const Module = require('../models/Module');
const { updateQuestionCount } = require('./setController');

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find().sort({ moduleCode: 1, setCode: 1, serialNumber: 1 });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.uploadUserQuestions = async (req, res) => {
    try {
        const { questions, moduleCode, setCode, order } = req.body;

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: "Invalid or empty questions array" });
        }

        // Ensure the module exists (create if it doesn't)
        let module = await Module.findOne({ moduleCode });
        if (!module) {
            // Create new module
            module = new Module({
                moduleCode,
                moduleName: moduleCode, // Use module code as name if no name provided
                moduleDescription: '',
                createdBy: 'user'
            });
            await module.save();
        }

        // Extract set group from set code (if possible)
        const setGroup = setCode.includes('-') ? setCode.split('-')[0] : moduleCode;

        // Ensure the set exists (create if it doesn't)
        let set = await Set.findOne({ setCode });
        if (!set) {
            // Create new set
            set = new Set({
                setCode,
                moduleCode,
                setGroup,
                setName: setCode, // Use set code as name if no name provided
                setDescription: '',
                setOrder: parseFloat(order) || 1, // Use order value or default to 1
                serialNumber: setCode,
                createdBy: 'user',
                questionCount: questions.length
            });
            await set.save();
        } else {
            // Update existing set's order if provided
            if (order) {
                set.setOrder = parseFloat(order);
                await set.save();
            }
        }

        // Process each question to match our schema
        const enrichedQuestions = questions.map((q, index) => ({
            question: q.question,
            answer: q.answer,
            moreInfo: q.moreInfo || '',
            moduleCode,
            setCode,
            setGroup,
            setName: set.setName,
            setDescription: set.setDescription,
            category: set.category || '',
            subCategory1: set.subCategory1 || '',
            subCategory2: set.subCategory2 || '',
            serialNumber: (index + 1).toString(),
            createdBy: 'user'
        }));

        // Insert the questions
        await Question.insertMany(enrichedQuestions);

        // Update question count for the set
        await updateQuestionCount(setCode);

        res.status(200).json({
            message: "Questions uploaded successfully",
            count: enrichedQuestions.length
        });
    } catch (error) {
        console.error("Error uploading user questions:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getQuestionsBySet = async (req, res) => {
    try {
        const { setCode } = req.params;

        // Check if set exists
        const set = await Set.findOne({ setCode });
        if (!set) {
            return res.status(404).json({ error: 'Set not found' });
        }

        const list = await Question.find({ setCode }).sort({ serialNumber: 1 });

        if (!list.length) {
            return res.status(404).json({ error: 'No questions found for this set' });
        }

        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getQuestionsByModule = async (req, res) => {
    try {
        const { moduleCode } = req.params;

        // Check if module exists
        const module = await Module.findOne({ moduleCode });
        if (!module) {
            return res.status(404).json({ error: 'Module not found' });
        }

        const questions = await Question.find({ moduleCode }).sort({ setCode: 1, serialNumber: 1 });

        if (!questions.length) {
            return res.status(404).json({ error: 'No questions found for this module' });
        }

        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new question
exports.createQuestion = async (req, res) => {
    try {
        const {
            question,
            answer,
            moreInfo,
            moduleCode,
            setCode,
            setGroup,
            serialNumber,
            category,
            subCategory1,
            subCategory2
        } = req.body;

        // Check if module exists
        const module = await Module.findOne({ moduleCode });
        if (!module) {
            return res.status(404).json({ error: 'Module not found' });
        }

        // Check if set exists
        const set = await Set.findOne({ setCode });
        if (!set) {
            return res.status(404).json({ error: 'Set not found' });
        }

        const newQuestion = new Question({
            question,
            answer,
            moreInfo,
            moduleCode,
            setCode,
            setGroup: setGroup || set.setGroup,
            setName: set.setName,
            setDescription: set.setDescription,
            category: category || set.category,
            subCategory1: subCategory1 || set.subCategory1,
            subCategory2: subCategory2 || set.subCategory2,
            serialNumber,
            createdBy: req.body.createdBy || 'admin'
        });

        await newQuestion.save();

        // Update question count for the set
        await updateQuestionCount(setCode);

        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a question
exports.updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            question,
            answer,
            moreInfo,
            serialNumber,
            category,
            subCategory1,
            subCategory2
        } = req.body;

        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            {
                question,
                answer,
                moreInfo,
                serialNumber,
                category,
                subCategory1,
                subCategory2
            },
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json(updatedQuestion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const { setCode } = question;

        await Question.findByIdAndDelete(id);

        // Update question count for the set
        await updateQuestionCount(setCode);

        res.json({ message: 'Question deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Check user answer
exports.checkUserAnswer = async (req, res) => {
    try {
        const { setCode, questionId, userAnswer } = req.body;

        if (!setCode || userAnswer === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Find the question
        let question;
        if (questionId) {
            question = await Question.findById(questionId);
        } else {
            // Fallback to finding by set code and index
            const questions = await Question.find({ setCode }).sort({ serialNumber: 1 });
            const index = parseInt(req.body.index || 0);
            question = questions[index];
        }

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Normalize answers for comparison (remove extra spaces, lowercase)
        const normalizedCorrectAnswer = question.answer.trim().toLowerCase();
        const normalizedUserAnswer = userAnswer.trim().toLowerCase();

        // Check for exact match
        const isExactMatch = normalizedCorrectAnswer === normalizedUserAnswer;

        // Check for partial match (if user answer is at least 70% similar)
        let similarity = 0;
        if (!isExactMatch) {
            // Simple string similarity algorithm
            const correctWords = normalizedCorrectAnswer.split(/\s+/);
            const userWords = normalizedUserAnswer.split(/\s+/);

            let matchCount = 0;
            for (const userWord of userWords) {
                if (correctWords.includes(userWord)) {
                    matchCount++;
                }
            }

            similarity = correctWords.length > 0
                ? (matchCount / correctWords.length) * 100
                : 0;
        }

        // Save user's answer to history if authenticated
        if (req.user) {
            // Implementation depends on your user answer history model
            // This could be added in the future
        }

        res.status(200).json({
            correct: isExactMatch,
            similarity: isExactMatch ? 100 : similarity,
            partiallyCorrect: !isExactMatch && similarity >= 70,
            correctAnswer: question.answer,
            userAnswer: userAnswer,
            moreInfo: question.moreInfo || ''
        });
    } catch (err) {
        console.error('Error checking answer:', err);
        res.status(500).json({ error: err.message });
    }
};
