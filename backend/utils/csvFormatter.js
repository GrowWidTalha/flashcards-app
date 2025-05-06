const { parse } = require('json2csv');

const fields = [
    'Question',
    'Answer',
    'More info',
    'Category',
    'Subcategory 1',
    'Subcategory 2',
    'Subcategory 3',
    'Subcategory 4',
    'Set',
    'Set Name (max 25 characters)',
    'Set Description',
    'Set order',
    'Serial',
    'Comment'
];

async function parseCSV(data) {
    try {
        // The data is already enriched by the controller, just parse it
        return parse(data, {
            fields,
            quote: '"',
            escapedQuote: '""'
        });
    } catch (error) {
        console.error('Error parsing CSV:', error);
        throw error;
    }
}

module.exports = { parseCSV };
