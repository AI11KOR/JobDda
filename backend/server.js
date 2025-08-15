const express = require("express")
const path = require("path")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config()
const passport = require("passport")

// Railway에서 제공하는 PORT 또는 기본 포트 사용
const PORT = process.env.PORT || 5000

const app = express()

const authRouter = require("./routes/authRouter")
const postRouter = require("./routes/postRouter")
const shopRouter = require("./routes/shopRouter")
const adminRouter = require("./routes/adminRouter")
const socialRouter = require("./routes/socialRouter")

// 소셜 로그인을 구현하기 위해서 아래 2줄이 server.js에 필요 연결을 위함
app.use(passport.initialize())

// CORS 설정 - Railway 배포용
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // 쿠키 주고받기 위한 핵심 옵션
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
)

app.use(cookieParser())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// 요청 로깅 미들웨어 (디버깅용)
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`)
  next()
})

// API 라우터 설정
app.use("/api", authRouter)
app.use("/api", postRouter)
app.use("/api", shopRouter)
app.use("/api", adminRouter)
app.use("/auth", socialRouter)

// 헬스 체크 엔드포인트
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || "development",
  })
})

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
  })
})

// 프론트엔드 빌드 파일 서빙 (배포 시에만)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")))

  // SPA 라우팅 처리 - API 경로 제외
  app.get("*", (req, res) => {
    // API 경로는 404 처리
    if (req.path.startsWith("/api") || req.path.startsWith("/auth") || req.path.startsWith("/health")) {
      return res.status(404).json({ error: "API route not found" })
    }
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"))
  })
} else {
  // 개발 환경에서는 404 처리만
  app.use("*", (req, res) => {
    res.status(404).json({
      error: "Route not found",
      path: req.originalUrl,
      method: req.method,
    })
  })
}

// 전역 에러 핸들링
app.use((error, req, res, next) => {
  console.error("❌ Global Error:", error)
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
  })
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`🌐 Health check: http://localhost:${PORT}/health`)
})
