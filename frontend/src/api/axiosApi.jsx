// axiosApi.jsx
import axios from "axios"

// 환경에 따른 baseURL 설정
const getBaseURL = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.REACT_APP_API_URL || "https://jobdda.onrender.com"
  }
  return "http://localhost:8000"
}

console.log("🌐 API Base URL:", getBaseURL())

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // 쿠키 전송 허용 (RefreshToken)
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// 요청 인터셉터
API.interceptors.request.use(
  (config) => {
    // localStorage에서 accessToken 가져오기
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error("❌ Request Error:", error)
    return Promise.reject(error)
  }
)

// 응답 인터셉터
API.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  async (error) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`)

    // 네트워크 에러 처리
    if (!error.response) {
      console.error("🌐 Network Error - 서버에 연결할 수 없습니다.")
    }

    // 401 Unauthorized → 토큰 만료/없음 처리
    if (error.response?.status === 401) {
      console.warn("⚠️ 401 Unauthorized - 로그인 필요 또는 토큰 만료")
      // 필요시 여기서 refreshToken 요청 로직 추가 가능
    }

    return Promise.reject(error)
  }
)

export default API
