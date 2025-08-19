import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from '../../api/axiosApi';

const PublicRoute = ({ children, requireAuth = false }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        if (!requireAuth) {
          setIsChecking(false);
          return;
        }

        const res = await API.get("/api/check-auth"); // ✅ axios 인스턴스로 호출
        setIsChecking(false); // 로그인 성공
      } catch (err) {
        console.error("로그인 상태 확인 에러:", err);
        if (requireAuth) navigate("/login");
        else setIsChecking(false);
      }
    }

    checkLogin();
  }, [navigate, requireAuth]);

  if (isChecking) return <div>Loading...</div>;
  return children;
}

export default PublicRoute;
