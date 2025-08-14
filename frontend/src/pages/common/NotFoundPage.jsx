import React from 'react';
import styles from './NotFoundPage.module.css'
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationTriangle, faHome, faArrowLeft } from "@fortawesome/free-solid-svg-icons"

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <FontAwesomeIcon icon={faExclamationTriangle} className={styles.icon} />
        </div>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>페이지를 찾을 수 없습니다</h2>
        <p className={styles.description}>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          URL이 올바른지 확인해 주세요.
        </p>
        <div className={styles.actions}>
          <button className={styles.button} onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faHome} className={styles.buttonIcon} />
            홈으로 돌아가기
          </button>
          <button className={`${styles.button} ${styles.secondaryButton}`} onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} className={styles.buttonIcon} />
            이전 페이지로
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
