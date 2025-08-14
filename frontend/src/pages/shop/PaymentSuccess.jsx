import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PaymentSuccess.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle, faShoppingBag, faHome } from "@fortawesome/free-solid-svg-icons"

const PaymentSuccess = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <FontAwesomeIcon icon={faCheckCircle} className={styles.icon} />
        </div>
        <h1 className={styles.title}>결제가 완료되었습니다</h1>
        <p className={styles.message}>
          주문이 성공적으로 처리되었습니다.
          <br />
          이용해 주셔서 감사합니다.
        </p>

        <div className={styles.buttonGroup}>
          <button className={`${styles.button} ${styles.primaryButton}`} onClick={() => navigate("/shop")}>
            <FontAwesomeIcon icon={faShoppingBag} className={styles.buttonIcon} />
            <span>쇼핑 계속하기</span>
          </button>
          <button className={styles.button} onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faHome} className={styles.buttonIcon} />
            <span>홈으로 가기</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess;