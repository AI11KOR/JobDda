import API from './axiosApi'
import { setUser } from '../slices/authSlice'

// Redux dispatch를 인자로 받아서 Header 등에서 재사용 가능하게
export const fetchUserWithRefresh = async (dispatch) => {
  try {
    const res = await API.get('/api/me', { withCredentials: true })
    dispatch(setUser(res.data.user))
    console.log("✅ /me 성공:", res.data.user)
  } catch (error) {
    console.log("🔴 /me 401 발생, 토큰 재발급 시도")

    try {
      await API.post('/api/token/reissue', {}, { withCredentials: true })
      console.log("✅ 토큰 재발급 완료")

      const res2 = await API.get('/api/me', { withCredentials: true })
      dispatch(setUser(res2.data.user))
      console.log("✅ 재발급 후 /me 성공:", res2.data.user)
    } catch (err2) {
      console.log("❌ refreshToken도 실패:", err2)
    }
  }
}
