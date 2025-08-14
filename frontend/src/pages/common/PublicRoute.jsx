import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const PublicRoute = ({ children, requireAuth = false }) => {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/check-auth", {
          method: "GET",
          credentials: "include",
        })

        if (res.ok) {
          // ✅ 로그인되어 있음
          if (requireAuth) {
            // 로그인 필요한 페이지 → 통과
            setIsChecking(false)
          } else {
            // 로그인 불필요한 페이지 (로그인/회원가입 등) → 차단
            alert("이미 로그인된 상태입니다.") 
            navigate("/list")
          }
        } else {
          // ✅ 로그인 안되어 있음
          if (  requireAuth) {
            // 로그인 필요한 페이지 → 차단
            alert("로그인이 필요한 페이지입니다.")
            navigate("/login")
          } else {
            // 로그인 불필요한 페이지 → 통과
            setIsChecking(false)
          }
        }
      } catch (err) {
        console.error("로그인 상태 확인 에러:", err)
        if (requireAuth) {
          alert("로그인이 필요한 페이지입니다.")
          navigate("/login")
        } else {
          setIsChecking(false)
        }
      }
    }

    checkLogin()
  }, [navigate, requireAuth])

  if (isChecking) return null
  return children
}

export default PublicRoute
