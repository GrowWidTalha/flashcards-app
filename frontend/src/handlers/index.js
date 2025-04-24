// const returnToMainMenu = () => {
//     setCurrentSet(null);
//     setCurrentIndex(0);
//     setShowAnswer(false);
// };

// const processFileData = (data) => {
//     return data
//         .filter((row) => row && row.length > 0 && row[0] && row[0].trim() !== "")
//         .map((row) => {
//             const setCode = row[8] ? String(row[8]).trim() : "MISCELLANEOUS";

//             return {
//                 question: row[0] || "No question provided",
//                 answer: row[1] || "No answer provided",
//                 moreInfo: row[2] || "",
//                 category: row[3] || "General",
//                 subCategory1: row[4] || "",
//                 subCategory2: row[5] || "",
//                 subCategory3: row[6] || "",
//                 subCategory4: row[7] || "",
//                 setCode: setCode,
//                 setName:
//                     row[9] ||
//                     (setCode === "MISCELLANEOUS"
//                         ? "Miscellaneous Questions"
//                         : `Set ${setCode}`),
//                 setDescription: row[10] || "",
//                 certainty: row[11] || "",
//                 serialNumber: row[12] || "",
//             };
//         });
// };

// const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     setLoading(true);
//     const reader = new FileReader();

//     reader.onload = async (e) => {
//         try {
//             let formattedData = [];

//             if (file.name.endsWith(".csv")) {
//                 const result = await new Promise((resolve) => {
//                     Papa.parse(e.target.result, {
//                         complete: resolve,
//                         header: false,
//                     });
//                 });
//                 formattedData = processFileData(result.data);
//             } else if (file.name.endsWith(".xlsx")) {
//                 const data = new Uint8Array(e.target.result);
//                 const workbook = XLSX.read(data, { type: "array" });
//                 const sheetName = workbook.SheetNames[0];
//                 const worksheet = workbook.Sheets[sheetName];
//                 const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//                 formattedData = processFileData(jsonData.slice(1));
//             }

//             if (formattedData.length === 0) {
//                 throw new Error("No valid questions found in file");
//             }

//             await uploadQuestions(formattedData);
//         } catch (error) {
//             console.error("Error processing file:", error);
//             alert(`Error: ${error.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (file.name.endsWith(".csv")) {
//         reader.readAsText(file);
//     } else if (file.name.endsWith(".xlsx")) {
//         reader.readAsArrayBuffer(file);
//     } else {
//         alert("Please upload a CSV or XLSX file");
//         setLoading(false);
//     }
// };

// const uploadQuestions = async (formattedData) => {
//     try {
//         await axios.post("https://quizapp-backend-gold.vercel.app/api/upload", {
//             questions: formattedData,
//         });
//         fetchAllSets();
//     } catch (error) {
//         console.error("Error uploading file:", error);
//     }
// };

// const fetchRecommendations = async () => {
//     try {
//         const response = await axios.get(
//             "https://quizapp-backend-gold.vercel.app/api/recommendations",
//             {
//                 params: {
//                     studiedSets: studiedSets.join(","),
//                     favorites: favorites.join(","),
//                 },
//             }
//         );
//         setRecommendedSets(response.data);
//     } catch (error) {
//         console.error("Error fetching recommendations:", error);
//     }
// };

// const toggleFavorite = (setCode) => {
//     if (favorites.includes(setCode)) {
//         setFavorites(favorites.filter((code) => code !== setCode));
//     } else {
//         setFavorites([...favorites, setCode]);
//     }
// };

// const handleNext = () => {
//     if (!currentSet?.questions) return;

//     if (showAnswer) {
//         if (currentIndex < currentSet.questions.length - 1) {
//             setCurrentIndex(currentIndex + 1);
//             setShowAnswer(false);
//         }
//     } else {
//         setShowAnswer(true);
//     }
// };

// const handlePrevious = () => {
//     if (currentIndex > 0) {
//         setCurrentIndex(currentIndex - 1);
//         setShowAnswer(false);
//     }
// };

// const loadRandomSet = () => {
//     if (allSets.length > 0) {
//         const availableSets = allSets.filter(
//             (set) => !studiedSets.includes(set.setCode)
//         );
//         const setsToUse = availableSets.length > 0 ? availableSets : allSets;
//         const randomIndex = Math.floor(Math.random() * setsToUse.length);
//         loadSet(setsToUse[randomIndex].setCode);
//     }
// };

// const renderCategoryPath = () => {
//     if (!currentSet) return null;

//     const categories = [
//         currentSet.category,
//         currentSet.subCategory1,
//         currentSet.subCategory2,
//         currentSet.subCategory3,
//         currentSet.subCategory4,
//     ].filter(Boolean);

//     return categories.join(" > ");
// };

// export {
//     returnToMainMenu,
//     processFileData,
//     handleFileUpload,
//     uploadQuestions,
//     fetchRecommendations,
//     toggleFavorite,
//     handleNext,
//     handlePrevious,
//     loadRandomSet,
//     renderCategoryPath,
// }