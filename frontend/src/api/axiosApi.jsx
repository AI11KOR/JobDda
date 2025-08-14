import axios from 'axios';
const API = axios.create({
    baseURL:'http://localhost:8000',
    withCredentials: true, // 이 부분이 있어야 쿠키(accessToken)가 전송됨됨
})

// 아래 코드는 인터셉터에서 자동 재요청을 한다
API.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;
  
      // accessToken 만료로 401 응답, 그리고 재요청하지 않은 경우만 처리
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          // ✅ 토큰 재발급 요청 null은 post 요청에는 body가 없기 때문에 null로 전달
          await axios.post('http://localhost:8000/api/token/reissue', null, {
            withCredentials: true,
          });
  
          // ✅ 기존 요청 다시 실행
          return API(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error);
    }
);

export default API;
