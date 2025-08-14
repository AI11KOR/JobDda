import React, { useState, useEffect, useRef } from 'react';
import Title from '../../components/Title';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EmailVal, PasswordVal } from '../../utils/validation';
import styles from '../../css/auth/FindPassword.module.css'
import TimeBox from '../../utils/timer';
import { sendEmailResetBtn, verifyEmailResetBtn } from '../../utils/resetPasswordBtn';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEnvelope,
  faLock,
  faClock,
  faCheckCircle,
  faExclamationCircle,
  faKey,
} from "@fortawesome/free-solid-svg-icons"


const FindPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordCheck, setPasswordCheck] = useState("")
  const [code, setCode] = useState("")

  const [emailErr, setEmailErr] = useState("")
  const [passwordErr, setPasswordErr] = useState("")
  const [passwordCheckErr, setPasswordCheckErr] = useState("")

  const [showPasswordBox, setShowPasswordBox] = useState(false)
  const [showCodeBox, setShowCodeBox] = useState(true)
  const [showTimer, setShowTimer] = useState(false)
  const [isCounting, setIsCounting] = useState(false)
  const [emailReadOnly, setEmailReadOnly] = useState(false)

  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const passwordCheckRef = useRef(null)

  // 이메일 유효성 검사
  const handleEmail = (e) => {
    const emailValue = e.target.value
    setEmail(emailValue)

    if (!emailValue) {
      setEmailErr("")
      return
    }

    if (!EmailVal(emailValue)) {
      setEmailErr("이메일을 정확하게 입력해주세요")
    } else {
      setEmailErr("")
    }
  }

  // 비밀번호 유효성 검사
  const handlePassword = (e) => {
    const passwordValue = e.target.value
    setPassword(passwordValue)

    if (!passwordValue) {
      setPasswordErr("")
      return
    }

    if (!PasswordVal(passwordValue)) {
      setPasswordErr("비밀번호는 8자리 이상, 특수문자를 포함해야 합니다")
    } else {
      setPasswordErr("")
    }
  }

  // 비밀번호 확인 유효성 검사
  const handlePasswordCheck = (e) => {
    const passwordCheckValue = e.target.value
    setPasswordCheck(passwordCheckValue)

    if (!passwordCheckValue) {
      setPasswordCheckErr("")
      return
    }

    if (passwordCheckValue !== password) {
      setPasswordCheckErr("비밀번호가 일치하지 않습니다")
    } else {
      setPasswordCheckErr("")
    }
  }

  // 인증번호 전송 성공 이벤트
  const handleSendCodeSuccess = () => {
    setShowCodeBox(true)
    setShowTimer(true)
    setIsCounting(true)
    setEmailReadOnly(false)
    setShowPasswordBox(false)
  }

  const handleSendCodeClick = sendEmailResetBtn({
    email: email,
    onSuccess: handleSendCodeSuccess,
  })

  // 인증번호 확인 성공 이벤트
  const handleVerifyCodeSuccess = () => {
    setShowCodeBox(false)
    setShowTimer(false)
    setIsCounting(false)
    setEmailReadOnly(true)
    setShowPasswordBox(true)
  }

  const handleVerifyCodeClick = verifyEmailResetBtn({
    email: email,
    code: code,
    onSuccess: handleVerifyCodeSuccess,
  })

  // 시간 만료 이벤트
  const handleTimeout = () => {
    alert("인증 시간이 만료되었습니다")
    setIsCounting(false)
    setShowTimer(false)
  }

  // 비밀번호 변경 완료 이벤트
  const handleChangePass = async () => {
    if (!email) {
      alert("이메일을 입력해주세요")
      emailRef.current?.focus()
      return
    }

    if (!EmailVal(email)) {
      alert("이메일 형식이 올바르지 않습니다")
      emailRef.current?.focus()
      return
    }

    if (!password) {
      alert("비밀번호를 입력해주세요")
      passwordRef.current?.focus()
      return
    }

    if (!PasswordVal(password)) {
      alert("비밀번호는 8자리 이상, 특수문자를 포함해야 합니다")
      passwordRef.current?.focus()
      return
    }

    if (!passwordCheck) {
      alert("비밀번호 확인을 입력해주세요")
      passwordCheckRef.current?.focus()
      return
    }

    if (passwordCheck !== password) {
      alert("비밀번호가 일치하지 않습니다")
      passwordCheckRef.current?.focus()
      return
    }

    try {
      await axios.post("http://localhost:8000/api/findPassword", {
        email,
        password,
      })

      alert("비밀번호가 성공적으로 변경되었습니다")
      navigate("/successFind")
    } catch (error) {
      console.log(error)
      alert("비밀번호 변경 중 오류가 발생했습니다")
    }
  }

  return (
    <div className={styles.container}>
      {/* <Title text="비밀번호 재설정" /> */}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <FontAwesomeIcon icon={faKey} className={styles.headerIcon} />
          <h2 className={styles.cardTitle}>비밀번호 재설정</h2>
          <p className={styles.cardSubtitle}>이메일 인증을 통해 새로운 비밀번호를 설정하세요</p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
            <span>이메일</span>
          </label>
          <div className={styles.inputWithButton}>
            <input
              ref={emailRef}
              value={email}
              onChange={handleEmail}
              readOnly={emailReadOnly}
              className={`${styles.input} ${emailReadOnly ? styles.verified : ""}`}
              placeholder="이메일을 입력하세요"
            />
            <button onClick={handleSendCodeClick} className={styles.button} disabled={emailReadOnly}>
              {emailReadOnly ? (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} className={styles.buttonIcon} />
                  <span>인증완료</span>
                </>
              ) : (
                <span>인증번호 전송</span>
              )}
            </button>
          </div>

          {emailErr && (
            <div className={styles.errorMessage}>
              <FontAwesomeIcon icon={faExclamationCircle} />
              <span>{emailErr}</span>
            </div>
          )}
        </div>

        {showCodeBox && (
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <FontAwesomeIcon icon={faClock} className={styles.inputIcon} />
              <span>인증번호</span>
            </label>
            <div className={styles.inputWithButton}>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={styles.input}
                placeholder="인증번호 6자리"
              />
              <button onClick={handleVerifyCodeClick} className={styles.button}>
                인증번호 확인
              </button>
            </div>

            {showTimer && (
              <div className={styles.timerContainer}>
                <FontAwesomeIcon icon={faClock} className={styles.timerIcon} />
                <TimeBox isCounting={isCounting} onTimeout={handleTimeout} />
              </div>
            )}
          </div>
        )}

        {showPasswordBox && (
          <div className={styles.passwordSection}>
            <div className={styles.sectionHeader}>
              <FontAwesomeIcon icon={faLock} className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>새 비밀번호 설정</h3>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                <span>새 비밀번호</span>
              </label>
              <input
                type="password"
                ref={passwordRef}
                value={password}
                onChange={handlePassword}
                className={styles.input}
                placeholder="새 비밀번호를 입력하세요"
              />

              {passwordErr && (
                <div className={styles.errorMessage}>
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  <span>{passwordErr}</span>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                <span>비밀번호 확인</span>
              </label>
              <input
                type="password"
                ref={passwordCheckRef}
                value={passwordCheck}
                onChange={handlePasswordCheck}
                className={styles.input}
                placeholder="비밀번호를 다시 입력하세요"
              />

              {passwordCheckErr && (
                <div className={styles.errorMessage}>
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  <span>{passwordCheckErr}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleChangePass}
          className={`${styles.submitButton} ${showPasswordBox ? "" : styles.disabled}`}
          disabled={!showPasswordBox}
        >
          <FontAwesomeIcon icon={faKey} className={styles.buttonIcon} />
          비밀번호 변경하기
        </button>
      </div>
    </div>
  )
}

export default FindPassword
