import { useEffect } from "react";
import API from "../../api/axiosApi";

function TestPage() {
  useEffect(() => {
    // 로그인 상태 확인
    API.get("/api/me")
      .then(res => console.log("로그인 상태 확인:", res.data))
      .catch(err => console.error("401/Network Error 발생:", err));
  }, []);

  return <div>테스트 페이지 - 콘솔 확인!</div>;
}

export default TestPage;
