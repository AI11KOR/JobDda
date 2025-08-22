"use client"

import { useState, useRef } from "react"
import Title from "../../components/Title"
import styles from "../../css/auth/Login.module.css"
import { useNavigate } from "react-router-dom"
import { EmailVal, PasswordVal } from "../../utils/validation"
import { useDispatch } from "react-redux"
import { setUser } from "../../slices/authSlice"
import API from "../../api/axiosApi"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faLock, faExclamationCircle } from "@fortawesome/free-solid-svg-icons"

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailErr, setEmailErr] = useState("")
  const [passwordErr, setPasswordErr] = useState("")
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const handleEmailCheck = (e) => {
    const emailValue = e.target.value
    setEmail(emailValue)
    if (!emailValue) {
      setEmailErr("")
      return
    }
    if (!EmailVal(emailValue)) {
      setEmailErr("이메일을 정확하게 적어주세요")
    } else {
      setEmailErr("")
    }
  }

  const handlePasswordCheck = (e) => {
    const passwordValue = e.target.value
    setPassword(passwordValue)
    if (!passwordValue) {
      setPasswordErr("")
      return
    }
    if (!PasswordVal(passwordValue)) {
      setPasswordErr("비밀번호를 정확하게 적어주세요")
    } else {
      setPasswordErr("")
    }
  }

  const handleSubmitLogin = async () => {
    if (!email || !EmailVal(email)) {
      alert("이메일을 적어주세요")
      emailRef.current?.focus()
      return
    }
    if (!password || !PasswordVal(password)) {
      alert("비밀번호를 적어주세요")
      passwordRef.current?.focus()
      return
    }
    try {
      const response = await API.post(
        "/api/login",
        {
          email,
          password,
        },
        { withCredentials: true },
      )
      alert("로그인 성공")
      dispatch(setUser(response.data.user))
      navigate("/list")
    } catch (error) {
      console.log(error)
      const msg = error.response?.data?.message || "로그인 실패 다시 시도해주세요"
      alert(msg)
    }
  }

  return (
    <div className={styles.pageWrapper}>
      {/* <Title text="로그인" /> */}
      <div className={styles.loginContainer}>
        <div className={styles.formCard}>
          <h1 className={styles.formTitle}>로그인</h1>
          <p className={styles.formSubtitle}>계정에 로그인하여 서비스를 이용하세요</p>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
              <input
                ref={emailRef}
                value={email}
                onChange={handleEmailCheck}
                className={styles.formInput}
                placeholder="이메일"
              />
            </label>
            {emailErr && (
              <div className={styles.errorMessage}>
                <FontAwesomeIcon icon={faExclamationCircle} />
                <span>{emailErr}</span>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
              <input
                type="password"
                ref={passwordRef}
                value={password}
                onChange={handlePasswordCheck}
                className={styles.formInput}
                placeholder="비밀번호"
              />
            </label>
            {passwordErr && (
              <div className={styles.errorMessage}>
                <FontAwesomeIcon icon={faExclamationCircle} />
                <span>{passwordErr}</span>
              </div>
            )}
          </div>

          <div className={styles.forgotPassword} onClick={() => navigate("/findPassword")}>
            비밀번호를 잊으셨나요?
          </div>

          <button onClick={handleSubmitLogin} className={styles.loginButton}>
            로그인
          </button>

          <div className={styles.registerPrompt}>
            <span>계정이 없으신가요?</span>
            <button onClick={() => navigate("/condition")} className={styles.registerLink}>
              회원가입
            </button>
          </div>

          <div className={styles.divider}>
            <span>또는</span>
          </div>

          <div className={styles.socialLogin}>
            <button
              className={`${styles.socialButton} ${styles.naverButton}`}
              onClick={() => (window.location.href = "https://jobdda-1.onrender.com/auth/naver")}
            >
              <img src="/common/naverImg2.png" alt="네이버" />
              <span>네이버로 로그인</span>
            </button>

            <button
              className={`${styles.socialButton} ${styles.googleButton}`}
              onClick={() => (window.location.href = "https://jobdda-1.onrender.com/auth/google")}
            >
              <img src="/common/google.png" alt="구글" />
              <span>구글로 로그인</span>
            </button>

            <button
              className={`${styles.socialButton} ${styles.kakaoButton}`}
              onClick={() => (window.location.href = "https://jobdda-1.onrender.com/auth/kakao")} // http://localhost:8000/auth/kakao
            >
              <img src="/common/KakaoTalk_logo.svg.png" alt="카카오" />
              <span>카카오로 로그인</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
