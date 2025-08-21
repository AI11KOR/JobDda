// axiosApi.jsx
import axios from "axios"


const getBaseURL = () =>
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:8000";

    console.log("🌐 API Base URL:", getBaseURL());

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

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
  (error) => Promise.reject(error)
)

// 응답 인터셉터: 401 처리
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ 401 Unauthorized - 로그인 필요 또는 토큰 만료");
      // refreshToken 로직이 있으면 여기서 처리 가능
    }
    return Promise.reject(error);
  }
);

export default API


// test용 코드
// const getBaseURL = () =>
//   process.env.NODE_ENV === "production"
//     ? process.env.REACT_APP_API_URL
//     : "http://localhost:8000";

// console.log("🌐 API Base URL:", getBaseURL());

// const API = axios.create({
//   baseURL: getBaseURL(),
//   withCredentials: true, // ✅ 쿠키 포함 요청
//   timeout: 15000,
//   headers: { "Content-Type": "application/json" },
// });

// // 테스트용 요청 함수
// export const testLoginCookie = async () => {
//   try {
//     // 로그인 시도 (서버에서 쿠키 발급)
//     const loginRes = await API.post("/api/login", {
//       email: "test@test.com",
//       password: "1234",
//     });
//     console.log("로그인 응답:", loginRes.data);

//     // 로그인 후 /me 테스트
//     const meRes = await API.get("/api/me");
//     console.log("인증 확인 응답:", meRes.data);
//   } catch (err) {
//     console.error("API 에러:", err.response?.data || err.message);
//   }
// };

// export default API;