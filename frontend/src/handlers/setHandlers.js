import { fetchAllQuestions, fetchSet, fetchRecommendations } from "./apiHandlers";

export const organizeSets = (questions) => {
    const setsMap = new Map();
    const miscSetCode = "MISCELLANEOUS";

    // Initialize Miscellaneous set
    setsMap.set(miscSetCode, {
        setCode: miscSetCode,
        setName: "Miscellaneous Questions",
        setDescription: "Questions without a specific set",
        category: "General",
        subCategory1: "",
        subCategory2: "",
        subCategory3: "",
        subCategory4: "",
        questions: [],
    });

    questions.forEach((question) => {
        const targetSetCode = question.setCode || miscSetCode;

        if (!setsMap.has(targetSetCode)) {
            setsMap.set(targetSetCode, {
                setCode: targetSetCode,
                setName: question.setName || `Set ${targetSetCode}`,
                setDescription: question.setDescription || "",
                category: question.category || "General",
                subCategory1: question.subCategory1 || "",
                subCategory2: question.subCategory2 || "",
                subCategory3: question.subCategory3 || "",
                subCategory4: question.subCategory4 || "",
                questions: [],
            });
        }
        setsMap.get(targetSetCode).questions.push(question);
    });

    return Array.from(setsMap.values());
};

export const loadSetHandler = async (
    setCode,
    allSets,
    setCurrentSet,
    setCurrentIndex,
    setShowAnswer,
    studiedSets,
    setStudiedSets,
    setLoading,
    setRecommendedSets,
    favorites
) => {
    if (!setCode) return;

    setLoading(true);
    try {
        // For the miscellaneous set, use local cache
        if (setCode === "MISCELLANEOUS") {
            const miscSet = allSets.find((set) => set.setCode === "MISCELLANEOUS");
            if (miscSet) {
                setCurrentSet(miscSet);
            }
        } else {
            const response = await fetchSet(setCode);

            if (!response || response.length === 0) {
                throw new Error("Set not found or empty");
            }

            setCurrentSet({
                setCode,
                setName: response[0]?.setName || `Set ${setCode}`,
                setDescription: response[0]?.setDescription || "",
                category: response[0]?.category || "General",
                subCategory1: response[0]?.subCategory1 || "",
                subCategory2: response[0]?.subCategory2 || "",
                subCategory3: response[0]?.subCategory3 || "",
                subCategory4: response[0]?.subCategory4 || "",
                questions: response,
            });
        }

        setCurrentIndex(0);
        setShowAnswer(false);

        if (!studiedSets.includes(setCode)) {
            setStudiedSets([...studiedSets, setCode]);
        }

        const recommendations = await fetchRecommendations(studiedSets, favorites);
        setRecommendedSets(recommendations);
    } catch (error) {
        console.error("Error loading set:", error);
        throw error;
    } finally {
        setLoading(false);
    }
};

export const loadRandomSetHandler = (
    allSets,
    studiedSets,
    loadSetHandler,
    ...loadSetParams
) => {
    if (allSets.length > 0) {
        const availableSets = allSets.filter(
            (set) => !studiedSets.includes(set.setCode)
        );
        const setsToUse = availableSets.length > 0 ? availableSets : allSets;
        const randomIndex = Math.floor(Math.random() * setsToUse.length);
        loadSetHandler(setsToUse[randomIndex].setCode, ...loadSetParams);
    }
};

export const toggleFavoriteHandler = (setCode, favorites, setFavorites) => {
    if (favorites.includes(setCode)) {
        setFavorites(favorites.filter((code) => code !== setCode));
    } else {
        setFavorites([...favorites, setCode]);
    }
};

export const renderCategoryPath = (currentSet) => {
    if (!currentSet) return null;

    const categories = [
        currentSet.category,
        currentSet.subCategory1,
        currentSet.subCategory2,
        currentSet.subCategory3,
        currentSet.subCategory4,
    ].filter(Boolean);

    return categories.join(" > ");
};