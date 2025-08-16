const express = require("express")
const path = require("path")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config()
const passport = require("passport")

const app = express()

const authRouter = require("./routes/authRouter")
const postRouter = require("./routes/postRouter")
const shopRouter = require("./routes/shopRouter")
const adminRouter = require("./routes/adminRouter")
const socialRouter = require("./routes/socialRouter")

app.use(passport.initialize())

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
)

app.use(cookieParser())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`)
  next()
})

app.use("/api", authRouter)
app.use("/api", postRouter)
app.use("/api", shopRouter)
app.use("/api", adminRouter)
app.use("/auth", socialRouter)

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

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

app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  })
})

app.use((error, req, res, next) => {
  console.error("❌ Global Error:", error)
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
  })
})

// Render용 서버 시작
const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

// Vercel 호환성 유지
module.exports = app