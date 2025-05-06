import * as XLSX from 'xlsx';

// Validate required columns exist in the uploaded file
export const validateRequiredColumns = (headers) => {
    const requiredColumns = ['Question', 'Answer', 'Set', 'Set order'];
    const missingColumns = requiredColumns.filter(col =>
        !headers.some(header => header.trim() === col)
    );

    if (missingColumns.length > 0) {
        throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }
    return true;
};

// Validate set order format (ModuleCode.Number)
export const validateSetOrder = (orderStr) => {
    const pattern = /^[A-Z]+\d*\.\d+$/;
    if (!pattern.test(orderStr)) {
        throw new Error(`Invalid set order format: ${orderStr}. Expected format: ModuleCode.Number (e.g., PH1.2)`);
    }
    return true;
};

// Validate character limits
export const validateCharacterLimits = (row) => {
    if (row['Set Name'] && row['Set Name'].length > 25) {
        throw new Error(`Set Name exceeds 25 characters: "${row['Set Name']}"`);
    }
    if (row['Set Description'] && row['Set Description'].length > 100) {
        throw new Error(`Set Description exceeds 100 characters: "${row['Set Description']}"`);
    }
    return true;
};

// Check if a row is empty or contains only whitespace
export const isEmptyRow = (row) => {
    if (!row) return true;
    return Object.values(row).every(value =>
        value === undefined || value === null || String(value).trim() === ''
    );
};

// Validate required fields presence
export const validateRequiredFields = (row) => {
    const requiredFields = {
        'Question': row.Question?.trim(),
        'Answer': row.Answer?.trim(),
        'Set': row.Set?.trim(),
        'Set order': row['Set order']?.trim()
    };

    const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([field]) => field);

    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    return true;
};

// Process and group questions by module and set
export const processExcelData = (rawRows) => {
    // First validate the headers
    console.log(rawRows);
    if (rawRows.length === 0) {
        throw new Error('File is empty');
    }

    const firstRow = normalizeRowKeys(rawRows[0]);
    validateRequiredColumns(Object.keys(firstRow));

    const moduleMap = new Map();
    const allQuestions = [];

    // Process each row
    rawRows.forEach((rawRow, index) => {
        // Skip empty rows
        if (isEmptyRow(rawRow)) {
            return;
        }

        const row = normalizeRowKeys(rawRow);

        try {
            // Skip rows that don't have any required fields
            if (!row.Question && !row.Answer && !row.Set && !row['Set order']) {
                return;
            }

            // Validate the row
            validateRequiredFields(row);
            validateCharacterLimits(row);
            validateSetOrder(row['Set order']);

            // Extract module information
            const setCode = row.Set.trim();
            const orderStr = row['Set order'].trim();
            const [moduleCode, orderNum] = orderStr.split('.');

            if (!moduleCode) {
                throw new Error(`Invalid module code in set order: ${orderStr}`);
            }

            // Group by module
            if (!moduleMap.has(moduleCode)) {
                moduleMap.set(moduleCode, {
                    moduleCode: moduleCode,
                    moduleName: row['Module Name']?.trim() || moduleCode,
                    moduleDescription: row['Module Description']?.trim() || '',
                    sets: new Map()
                });
            }

            const moduleEntry = moduleMap.get(moduleCode);

            // Group by set within module
            if (!moduleEntry.sets.has(setCode)) {
                moduleEntry.sets.set(setCode, {
                    setCode: setCode,
                    moduleCode: moduleCode,
                    setOrder: parseFloat(orderNum),
                    setName: row['Set Name (max 25 characters)']?.trim() || setCode,
                    setDescription: row['Set Description (say 100 characters)']?.trim() || '',
                    serialNumber: row.Serial?.trim() || `${moduleCode}-${setCode}`,
                    setGroup: row.Category?.trim() || 'General',
                    questions: []
                });
            }

            const setEntry = moduleEntry.sets.get(setCode);

            // Create question object with correct property names
            const question = {
                question: row.Question.trim(),
                answer: row.Answer.trim(),
                moreInfo: row['More info']?.trim() || '',
                moduleCode: moduleCode,
                setCode: setCode,
                setName: setEntry.setName,
                setDescription: setEntry.setDescription,
                setOrder: orderStr,
                category: row.Category?.trim() || '',
                subCategory1: row['Subcategory 1']?.trim() || '',
                subCategory2: row['Subcategory 2']?.trim() || '',
                serialNumber: row.Serial?.trim() || `${moduleCode}-${setCode}-${index + 1}`,
                createdBy: 'user'
            };

            setEntry.questions.push(question);
            allQuestions.push(question);
        } catch (error) {
            throw new Error(`Error in row ${index + 1}: ${error.message}`);
        }
    });

    // Verify we have at least one valid question
    if (allQuestions.length === 0) {
        throw new Error('No valid questions found in the file');
    }

    // Convert maps to arrays and sort sets by order
    const modulesArray = Array.from(moduleMap.values()).map(m => ({
        module: m.moduleCode,
        moduleName: m.moduleName,
        moduleDescription: m.moduleDescription,
        sets: Array.from(m.sets.values()).sort((a, b) => a.setOrder - b.setOrder)
    }));

    return {
        modules: modulesArray,
        questions: allQuestions
    };
};

// Normalize keys by trimming whitespace
export const normalizeRowKeys = (row) => {
    const normalized = {};
    Object.keys(row).forEach((key) => {
        // Convert value to string if it exists, otherwise use empty string
        const value = row[key];
        normalized[key.trim()] = value != null ? String(value) : '';
    });
    return normalized;
};
