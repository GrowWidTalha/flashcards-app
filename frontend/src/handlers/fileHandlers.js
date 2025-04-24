import Papa from "papaparse";
import * as XLSX from "xlsx";
import { uploadQuestions,uploadAdminQuestions,uploadAdminReplaceQuestions } from "./apiHandlers";

export const processFileData = (data) => {
    return data
        .filter((row) => row && row.length > 0 && row[0] && row[0].trim() !== "")
        .map((row) => {
            const setCode = row[8] ? String(row[8]).trim() : "MISCELLANEOUS";

            return {
                question: row[0] || "No question provided",
                answer: row[1] || "No answer provided",
                moreInfo: row[2] || "",
                category: row[3] || "General",
                subCategory1: row[4] || "",
                subCategory2: row[5] || "",
                subCategory3: row[6] || "",
                subCategory4: row[7] || "",
                setCode: setCode,
                setName:
                    row[9] ||
                    (setCode === "MISCELLANEOUS"
                        ? "Miscellaneous Questions"
                        : `Set ${setCode}`),
                setDescription: row[10] || "",
                certainty: row[11] || "",
                serialNumber: row[12] || "",
            };
        });
};

export const handleFileUpload = async (file, setLoading, fetchAllSets) => {
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
        try {
            let formattedData = [];

            if (file.name.endsWith(".csv")) {
                const result = await new Promise((resolve) => {
                    Papa.parse(e.target.result, {
                        complete: resolve,
                        header: false,
                    });
                });
                formattedData = processFileData(result.data);
            } else if (file.name.endsWith(".xlsx")) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                formattedData = processFileData(jsonData.slice(1));
            }

            if (formattedData.length === 0) {
                throw new Error("No valid questions found in file");
            }

            await uploadQuestions(formattedData);
            await fetchAllSets();
        } catch (error) {
            console.error("Error processing file:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (file.name.endsWith(".csv")) {
        reader.readAsText(file);
    } else if (file.name.endsWith(".xlsx")) {
        reader.readAsArrayBuffer(file);
    } else {
        alert("Please upload a CSV or XLSX file");
        setLoading(false);
    }
};

export const handleAdminFileUpload = async (file, setLoading, fetchAllSets) => {
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
        try {
            let formattedData = [];

            if (file.name.endsWith(".csv")) {
                const result = await new Promise((resolve) => {
                    Papa.parse(e.target.result, {
                        complete: resolve,
                        header: false,
                    });
                });
                formattedData = processFileData(result.data);
            } else if (file.name.endsWith(".xlsx")) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                formattedData = processFileData(jsonData.slice(1));
            }

            if (formattedData.length === 0) {
                throw new Error("No valid questions found in file");
            }

            await uploadAdminQuestions(formattedData);
            await fetchAllSets();
        } catch (error) {
            console.error("Error processing file:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (file.name.endsWith(".csv")) {
        reader.readAsText(file);
    } else if (file.name.endsWith(".xlsx")) {
        reader.readAsArrayBuffer(file);
    } else {
        alert("Please upload a CSV or XLSX file");
        setLoading(false);
    }
};

export const handleAdminReplaceFileUpload = async (file, setLoading, fetchAllSets) => {
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
        try {
            let formattedData = [];

            if (file.name.endsWith(".csv")) {
                const result = await new Promise((resolve) => {
                    Papa.parse(e.target.result, {
                        complete: resolve,
                        header: false,
                    });
                });
                formattedData = processFileData(result.data);
            } else if (file.name.endsWith(".xlsx")) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                formattedData = processFileData(jsonData.slice(1));
            }

            if (formattedData.length === 0) {
                throw new Error("No valid questions found in file");
            }

            await uploadAdminReplaceQuestions(formattedData);
            await fetchAllSets();
        } catch (error) {
            console.error("Error processing file:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (file.name.endsWith(".csv")) {
        reader.readAsText(file);
    } else if (file.name.endsWith(".xlsx")) {
        reader.readAsArrayBuffer(file);
    } else {
        alert("Please upload a CSV or XLSX file");
        setLoading(false);
    }
};