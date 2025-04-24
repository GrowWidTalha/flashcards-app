const Question = require('../models/Question');

exports.getRecommendations = async (req, res) => {
    try {
        const studiedSets = req.query.studiedSets?.split(',') || [];
        const recs = await Question.aggregate([
            { $match: { setCode: { $nin: studiedSets } } },
            { $sample: { size: 5 } },
            { $group: { _id: '$setCode', setName: { $first: '$setName' }, setDescription: { $first: '$setDescription' } } },
        ]);
        res.json(recs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
