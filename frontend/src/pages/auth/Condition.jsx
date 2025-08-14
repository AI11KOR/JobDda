"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../../css/auth/Condition.module.css"
import Title from "../../components/Title"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faFileContract, faShieldAlt } from "@fortawesome/free-solid-svg-icons"

const Condition = () => {
  const navigate = useNavigate()
  const [scrollStates, setScrollStates] = useState([false, false, false])
  const [checkStates, setCheckStates] = useState([false, false, false])
  const refs = [useRef(null), useRef(null), useRef(null)]

  const handleScroll = (i) => {
    const box = refs[i].current // 스크롤 박스 DOM 요소 가져오기
    if (!box) return
    const { scrollTop, scrollHeight, clientHeight } = box
    // scrollTop: 현재 스크롤된 위치
    // scrollHeight: 전체 콘텐츠 높이
    // clientHeight: 보이는 영역 높이

    if (scrollTop + clientHeight >= scrollHeight - 5) { // `scrollTop + clientHeight`: 현재 보이는 영역의 맨 아래 위치
      // `scrollHeight - 5`: 전체 콘텐츠 끝에서 5px 여유 
      // 이 둘이 같아지면 = 끝까지 스크롤했다는 뜻
      const newScrollStates = [...scrollStates]
      newScrollStates[i] = true // 끝까지 읽었다고 표시
      setScrollStates(newScrollStates)
    }
  }

  const handleCheckbox = (i) => (e) => {
    const newCheckStates = [...checkStates]
    newCheckStates[i] = e.target.checked
    setCheckStates(newCheckStates)
  }

  const allAgreed = checkStates.every(Boolean)

  const handleAgreeAll = (e) => {
    const isChecked = e.target.checked
    setCheckStates([isChecked, isChecked, isChecked])
    if (isChecked) {
      setScrollStates([true, true, true])
    } else {
      setScrollStates([false, false, false])
    }
  }

  const terms = [
    {
      title: "서비스 이용약관",
      icon: faFileContract,
      content: `제1조 (목적)
이 약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"란 회사가 제공하는 모든 서비스를 의미합니다.
2. "이용자"란 이 약관에 따라 회사의 서비스를 받는 회원 및 비회원을 말합니다.
3. "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사의 서비스를 계속적으로 이용할 수 있는 자를 말합니다.

제3조 (약관의 효력 및 변경)
1. 이 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.
2. 회사는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지됩니다.

제4조 (서비스의 제공 및 변경)
1. 회사는 다음과 같은 업무를 수행합니다.
   - 재화 또는 용역에 대한 정보 제공 및 구매계약의 체결
   - 구매계약이 체결된 재화 또는 용역의 배송
   - 기타 회사가 정하는 업무

제5조 (서비스의 중단)
1. 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
2. 회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상하지 않습니다.`,
    },
    {
      title: "개인정보 처리방침",
      icon: faShieldAlt,
      content: `제1조 (개인정보의 처리목적)
회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.

1. 홈페이지 회원 가입 및 관리
   - 회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 만 14세 미만 아동의 개인정보처리 시 법정대리인의 동의여부 확인, 각종 고지·통지, 고충처리 목적으로 개인정보를 처리합니다.

2. 재화 또는 서비스 제공
   - 물품배송, 서비스 제공, 계약서·청구서 발송, 콘텐츠 제공, 맞춤서비스 제공, 본인인증, 연령인증, 요금결제·정산, 채권추심 목적으로 개인정보를 처리합니다.

3. 고충처리
   - 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보 목적으로 개인정보를 처리합니다.

제2조 (개인정보의 처리 및 보유기간)
1. 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
2. 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
   - 홈페이지 회원 가입 및 관리: 회원 탈퇴 시까지
   - 재화 또는 서비스 제공: 재화·서비스 공급완료 및 요금결제·정산 완료시까지

제3조 (개인정보의 제3자 제공)
회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.`,
    },
    {
      title: "마케팅 정보 수신 동의",
      icon: faCheck,
      content: `제1조 (마케팅 정보 수신 동의)
회사는 다음과 같은 마케팅 정보를 제공할 수 있습니다.

1. 신상품 소식 및 이벤트 정보
   - 새로운 상품 출시 정보
   - 할인 이벤트 및 프로모션 정보
   - 시즌별 특가 상품 안내

2. 맞춤형 상품 추천
   - 구매 이력 기반 상품 추천
   - 관심 카테고리 상품 정보
   - 개인화된 쿠폰 및 혜택 제공

3. 서비스 개선 및 만족도 조사
   - 서비스 이용 만족도 조사
   - 새로운 기능 및 서비스 안내
   - 고객 의견 수렴을 위한 설문조사

제2조 (수신 방법)
마케팅 정보는 다음의 방법으로 제공됩니다.
1. 이메일
2. SMS/MMS
3. 앱 푸시 알림
4. 우편물

제3조 (동의 철회)
1. 마케팅 정보 수신에 대한 동의는 언제든지 철회할 수 있습니다.
2. 동의 철회 방법:
   - 이메일 하단의 수신거부 링크 클릭
   - 고객센터 전화 또는 이메일 문의
   - 마이페이지에서 직접 설정 변경

제4조 (동의하지 않을 권리)
정보주체는 마케팅 정보 수신 동의를 거부할 권리가 있으며, 동의를 거부하더라도 서비스 이용에는 제한이 없습니다. 단, 마케팅 정보를 받지 못할 수 있습니다.

본 동의는 회원가입과 별개이며, 동의하지 않아도 회원가입 및 서비스 이용이 가능합니다.`,
    },
  ]

  return (
    <div className={styles.pageWrapper}>
      {/* <Title text="이용약관" /> */}
      <div className={styles.conditionContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>서비스 이용약관 동의</h2>
          <p className={styles.subtitle}>서비스 이용을 위해 아래 약관을 확인하고 동의해주세요</p>
        </div>

        <div className={styles.agreeAllSection}>
          <label className={styles.agreeAllLabel}>
            <input type="checkbox" onChange={handleAgreeAll} checked={allAgreed} className={styles.hiddenCheckbox} />
            <span className={styles.customCheckbox}>{allAgreed && <FontAwesomeIcon icon={faCheck} />}</span>
            <span className={styles.agreeAllText}>모든 약관에 동의합니다</span>
          </label>
        </div>

        <div className={styles.termsContainer}>
          {terms.map((term, i) => (
            <div key={i} className={styles.termSection}>
              <div className={styles.termHeader}>
                <FontAwesomeIcon icon={term.icon} className={styles.termIcon} />
                <h3 className={styles.termTitle}>{term.title}</h3>
                <span className={styles.required}>(필수)</span>
              </div>

              <div ref={refs[i]} onScroll={() => handleScroll(i)} className={styles.termContent}>
                <div className={styles.termText}>{term.content}</div>
                {!scrollStates[i] && ( // scrollStates[i]가 false일 때만 표시
                  <div className={styles.scrollIndicator}>
                    <span>↓ 약관을 끝까지 읽어주세요 ↓</span>
                  </div>
                )}
              </div>

              <label className={styles.termAgreeLabel}>
                <input
                  type="checkbox"
                  disabled={!scrollStates[i]}
                  checked={checkStates[i]}
                  onChange={handleCheckbox(i)}
                  className={styles.hiddenCheckbox}
                />
                <span className={`${styles.customCheckbox} ${!scrollStates[i] ? styles.disabled : ""}`}>
                  {checkStates[i] && <FontAwesomeIcon icon={faCheck} />}
                </span>
                <span className={`${styles.agreeText} ${!scrollStates[i] ? styles.disabled : ""}`}>
                  위 약관에 동의합니다
                </span>
              </label>
            </div>
          ))}
        </div>

        <div className={styles.buttonContainer}>
          <button
            disabled={!allAgreed}
            className={`${styles.nextButton} ${allAgreed ? styles.active : styles.disabled}`}
            onClick={() => navigate("/register")}
          >
            <span>회원가입 계속하기</span>
            <FontAwesomeIcon icon={faCheck} className={styles.buttonIcon} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Condition
