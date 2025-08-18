const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const passport = require("passport");
const connectDB = require("./config/database"); // 데이터베이스 연결

const app = express();

// 라우터
const authRouter = require("./routes/authRouter");
const postRouter = require("./routes/postRouter");
const shopRouter = require("./routes/shopRouter");
const adminRouter = require("./routes/adminRouter");
const socialRouter = require("./routes/socialRouter");

// Passport 초기화
app.use(passport.initialize());

// CORS 설정 (배포용)
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL, // 배포 프론트
      "http://localhost:3000", // 로컬 테스트
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// 미들웨어
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 요청 로그
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`);
  next();
});

// 라우터 연결
app.use("/api", authRouter);
app.use("/api", postRouter);
app.use("/api", shopRouter);
app.use("/api", adminRouter);
app.use("/auth", socialRouter);

// 헬스 체크
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// 기본 라우트
app.get("/", (req, res) => {
  res.json({
    message: "Korean Shopping Mall API Server",
    version: "1.0.0",
    status: "Running",
    endpoints: {
      health: "/health",
      api: "/api",
      auth: "/auth",
    },
  });
});

// 404 처리
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// 글로벌 에러 핸들링
app.use((error, req, res, next) => {
  console.error("❌ Global Error:", error);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
  });
});

// 포트
const PORT = process.env.PORT || 8000;

// 서버 시작
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ 데이터베이스 연결 완료");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
