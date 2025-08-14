"use client"

import { useState, useRef } from "react"
import Title from "../../components/Title"
import styles from "../../css/auth/Register.module.css"
import { EmailVal, PasswordVal, NameVal, NumberVal } from "../../utils/validation"
import DaumPostcodeModal from "../../components/modal/DaumPostcodeModal"
import { useNavigate } from "react-router-dom"
import { sendEmailBtn, verifyEmailBtn } from "../../utils/handleCodeBtn"
import TimeBox from "../../utils/timer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEnvelope,
  faLock,
  faUser,
  faPhone,
  faMapPin,
  faClock,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons"
import API from "../../api/axiosApi" // Declare the API variable

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordCheck, setPasswordCheck] = useState("")
  const [nickname, setNickname] = useState("")
  const [number, setNumber] = useState("")
  const [postcode, setPostcode] = useState("")
  const [address, setAddress] = useState("")
  const [detailAddr, setDetailAddr] = useState("")

  const [emailErr, setEmailErr] = useState("")
  const [passwordErr, setPasswordErr] = useState("")
  const [passwordCheckErr, setPasswordCheckErr] = useState("")
  const [nicknameErr, setNicknameErr] = useState("")
  const [numberErr, setNumberErr] = useState("")

  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const passwordCheckRef = useRef(null)
  const nicknameRef = useRef(null)
  const numberRef = useRef(null)
  const detailAddrRef = useRef(null)
  const postcodeRef = useRef(null) // Declare the postcodeRef variable

  const [isCounting, setIsCounting] = useState(false)
  const [showTimer, setShowTimer] = useState(false)
  const [showCodeBox, setShowCodeBox] = useState(false)
  const [emailReadonly, setEmailReadonly] = useState(false)
  const [code, setCode] = useState("")
  const [daumPostModal, setDaumPostModal] = useState(false)

  const navigate = useNavigate()

  // 우편번호창 열기
  const handleAddressComplete = (data) => {
    setPostcode(data.zonecode)
    setAddress(data.address)
  }

  // 이메일 인증
  const handleEmail = (e) => {
    const emailValue = e.target.value
    setEmail(emailValue)
    if (!emailValue) {
      setEmailErr("")
      return
    }
    if (!EmailVal(emailValue)) {
      setEmailErr("이메일을 정확하게 적어주세요")
      return
    } else {
      setEmailErr("")
      return
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
      setPasswordErr("비밀번호는 8글자 이상 및 특수문자를 포함해야 합니다.")
      return
    } else {
      setPasswordErr("")
      return
    }
  }

  // 비밀번호 확인 유효성
  const handlePasswordCheck = (e) => {
    const passwordCheckValue = e.target.value
    setPasswordCheck(passwordCheckValue)
    if (!passwordCheckValue) {
      setPasswordCheckErr("")
      return
    }
    if (passwordCheckValue !== password) {
      setPasswordCheckErr("비밀번호가 일치하지 않습니다.")
      return
    } else {
      setPasswordCheckErr("")
      return
    }
  }

  // 닉네임 유효성
  const handleNickname = (e) => {
    const nicknameValue = e.target.value
    setNickname(nicknameValue)
    if (!nicknameValue) {
      setNicknameErr("")
      return
    }
    if (!NameVal(nicknameValue)) {
      setNicknameErr("3글자 이상 적어야 합니다.")
      return
    } else {
      setNicknameErr("")
      return
    }
  }

  // 전화번호 유효성
  const handleNumber = (e) => {
    const numberValue = e.target.value
    setNumber(numberValue)
    if (!numberValue) {
      setNumberErr("")
      return
    }
    if (!NumberVal(numberValue)) {
      setNumberErr("전화번호는 11자리로 핸드폰 번호를 적어주세요")
      return
    } else {
      setNumberErr("")
      return
    }
  }

  // 이메일 전송 이벤트
  const handleSendSuccess = () => {
    setShowCodeBox(true)
    setShowTimer(true)
    setEmailReadonly(false)
    setIsCounting(true)
  }

  const handleSendClick = sendEmailBtn({
    email: email,
    onSuccess: handleSendSuccess,
  })

  // 인증번호 확인 이벤트
  const handleVerifySuccess = () => {
    setShowCodeBox(false)
    setShowTimer(false)
    setEmailReadonly(true)
    setIsCounting(false)
  }

  // 시간 만료 이벤트
  const handleTimeout = () => {
    alert("시간이 만료되었습니다.")
    setIsCounting(false)
    setShowTimer(false)
  }

  const handleVerifyClick = verifyEmailBtn({
    email: email,
    code: code,
    onSuccess: handleVerifySuccess,
  })

  const handleSubmitRegister = async () => {
    if (!email) {
      alert("이메일을 적어주세요")
      emailRef.current?.focus()
      return
    }

    if (!password) {
      alert("비밀번호를 적어주세요")
      passwordRef.current?.focus()
      return
    }

    if (!passwordCheck) {
      alert("비밀번호 확인란을 적어주세요")
      passwordCheckRef.current?.focus()
      return
    }

    if (passwordCheck !== password) {
      alert("비밀번호가 일치하지 않습니다.")
      passwordCheckRef.current?.focus()
      return
    }

    if (!nickname) {
      alert("닉네임을 적어주세요")
      nicknameRef.current?.focus()
      return
    }

    if (!number) {
      alert("전화번호를 적어주세요")
      numberRef.current?.focus()
      return
    }

    try {
      await API.post("/api/register", {
        email,
        password,
        nickname,
        number,
        postcode,
        address,
        detailAddr,
      })
      alert("회원가입이 완료되었습니다. 로그인 페이지로 전환합니다.")
      navigate("/login")
    } catch (error) {
      console.log(error)
      alert("오류")
    }
  }

  return (
    <div className={styles.pageWrapper}>
      {/* <Title text="회원가입" /> */}
      <div className={styles.registerContainer}>
        <div className={styles.formCard}>
          <h1 className={styles.formTitle}>회원가입</h1>
          <p className={styles.formSubtitle}>계정을 만들어 서비스를 이용하세요</p>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faEnvelope} />
              <span>이메일 인증</span>
            </h2>

            <div className={styles.formGroup}>
              <div className={styles.inputWithButton}>
                <input
                  readOnly={emailReadonly}
                  className={`${styles.formInput} ${emailReadonly ? styles.verified : ""}`}
                  ref={emailRef}
                  value={email}
                  onChange={handleEmail}
                  placeholder="이메일을 적어주세요"
                />
                <button onClick={handleSendClick} className={styles.actionButton} disabled={emailReadonly}>
                  {emailReadonly ? (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} />
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
                <div className={styles.inputWithButton}>
                  <div className={styles.inputWithIcon}>
                    <FontAwesomeIcon icon={faClock} className={styles.inputIcon} />
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className={styles.formInput}
                      placeholder="인증번호 6자리"
                    />
                  </div>
                  <button onClick={handleVerifyClick} className={styles.actionButton}>
                    인증번호 확인
                  </button>
                </div>
                {showTimer && (
                  <div className={styles.timerContainer}>
                    <TimeBox isCounting={isCounting} onTimeout={handleTimeout} />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faLock} />
              <span>비밀번호 설정</span>
            </h2>

            <div className={styles.formGroup}>
              <div className={styles.inputWithIcon}>
                <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                <input
                  type="password"
                  ref={passwordRef}
                  value={password}
                  onChange={handlePassword}
                  className={styles.formInput}
                  placeholder="비밀번호를 적어주세요"
                />
              </div>
              {passwordErr && (
                <div className={styles.errorMessage}>
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  <span>{passwordErr}</span>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <div className={styles.inputWithIcon}>
                <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                <input
                  type="password"
                  ref={passwordCheckRef}
                  value={passwordCheck}
                  onChange={handlePasswordCheck}
                  className={styles.formInput}
                  placeholder="비밀번호를 다시 적어주세요"
                />
              </div>
              {passwordCheckErr && (
                <div className={styles.errorMessage}>
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  <span>{passwordCheckErr}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faUser} />
              <span>개인 정보</span>
            </h2>

            <div className={styles.formGroup}>
              <div className={styles.inputWithIcon}>
                <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                <input
                  ref={nicknameRef}
                  value={nickname}
                  onChange={handleNickname}
                  className={styles.formInput}
                  placeholder="닉네임을 적어주세요"
                />
              </div>
              {nicknameErr && (
                <div className={styles.errorMessage}>
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  <span>{nicknameErr}</span>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <div className={styles.inputWithIcon}>
                <FontAwesomeIcon icon={faPhone} className={styles.inputIcon} />
                <input
                  ref={numberRef}
                  value={number}
                  onChange={handleNumber}
                  className={styles.formInput}
                  placeholder="전화번호를 적어주세요"
                />
              </div>
              {numberErr && (
                <div className={styles.errorMessage}>
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  <span>{numberErr}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faMapPin} />
              <span>주소 정보</span>
            </h2>

            <div className={styles.formGroup}>
              <div className={styles.inputWithButton}>
                <input
                  ref={postcodeRef}
                  value={postcode}
                  className={styles.formInput}
                  placeholder="우편번호"
                  readOnly
                />
                <button onClick={() => setDaumPostModal(true)} className={styles.actionButton}>
                  주소 찾기
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <input value={address} className={styles.formInput} placeholder="주소" readOnly />
            </div>

            <div className={styles.formGroup}>
              <input
                ref={detailAddrRef}
                value={detailAddr}
                onChange={(e) => setDetailAddr(e.target.value)}
                className={styles.formInput}
                placeholder="상세주소를 적어주세요"
              />
            </div>
          </div>

          <button onClick={handleSubmitRegister} className={styles.registerButton}>
            회원가입 완료
          </button>

          <div className={styles.loginPrompt}>
            <span>이미 계정이 있으신가요?</span>
            <button onClick={() => navigate("/login")} className={styles.loginLink}>
              로그인
            </button>
          </div>
        </div>
      </div>

      {daumPostModal && (
        <DaumPostcodeModal onClose={() => setDaumPostModal(false)} onComplete={handleAddressComplete} />
      )}
    </div>
  )
}

export default Register
