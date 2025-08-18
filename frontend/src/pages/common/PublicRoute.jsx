import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const PublicRoute = ({ children, requireAuth = false }) => {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkLogin = async () => {
      try {
        // 로그인이 필요하지 않은 페이지는 바로 통과
        if (!requireAuth) {
          setIsChecking(false)
          return
        }

        const res = await fetch("http://localhost:8000/api/check-auth", {
          method: "GET",
          credentials: "include",
        })

        if (res.ok) {
          // ✅ 로그인되어 있고, 로그인 필요한 페이지 → 통과
          setIsChecking(false)
        } else {
          // ✅ 로그인 안되어 있고, 로그인 필요한 페이지 → 로그인 페이지로
          console.log("로그인이 필요한 페이지입니다.")
          navigate("/login")
        }
      } catch (err) {
        console.error("로그인 상태 확인 에러:", err)
        if (requireAuth) {
          console.log("네트워크 오류로 로그인 페이지로 이동합니다.")
          navigate("/login")
        } else {
          setIsChecking(false)
        }
      }
    }

    checkLogin()
  }, [navigate, requireAuth])

  if (isChecking) return <div>Loading...</div>
  return children
}

export default PublicRoute