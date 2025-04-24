const { parse } = require('json2csv');

const fields = [
    'Question', 'Answer', 'More info', 'Category', 'Subcategory 1', 'Subcategory 2',
    'Set', 'Set Name (max 25)', 'Set Description (max 100)', 'Serial'
];

function parseCSV(data) {
    const formatted = data.map(q => ({
        'Question': q.question || '',
        'Answer': q.answer || '',
        'More info': q.moreInfo || '',
        'Category': q.category || '',
        'Subcategory 1': q.subCategory1 || '',
        'Subcategory 2': q.subCategory2 || '',
        'Set': q.setCode || '',
        'Set Name (max 25)': q.setName || '',
        'Set Description (max 100)': q.setDescription || '',
        'Serial': q.serialNumber || ''
    }));

    return parse(formatted, { fields });
}

module.exports = { parseCSV };
