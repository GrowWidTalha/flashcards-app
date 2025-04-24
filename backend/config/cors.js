const corsOptions = {
    origin: ["https://quizapp-one-cyan.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};

export default corsOptions;