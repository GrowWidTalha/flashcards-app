import * as XLSX from "xlsx";

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  setLoading(true);
  const reader = new FileReader();

  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const formattedData = jsonData
      .slice(1)
      .map(([question, answer, moreInfo]) => ({
        question,
        answer,
        moreInfo,
      }));

    try {
      await axios.post("https://quizapp-backend-gold.vercel.app/api/upload", {
        questions: formattedData,
      });
      fetchQuestions();
    } catch (error) {
      console.error("Error uploading XLSX:", error);
    }
    setLoading(false);
  };

  reader.readAsArrayBuffer(file);
};
