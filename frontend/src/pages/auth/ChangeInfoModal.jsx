import React, { useState, useEffect, useRef } from 'react';
import API from '../../api/axiosApi';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/auth/ChangeInfoModal.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes, faSave, faUser, faPhone } from "@fortawesome/free-solid-svg-icons"

const ChangeInfoModal = ({ userInfo, onClose }) => {
  const [nickname, setNickname] = useState(userInfo?.nickname || "")
  const [number, setNumber] = useState(userInfo?.number || "")

  useEffect(() => {
    if (userInfo) {
      setNickname(userInfo.nickname || "")
      setNumber(userInfo.number || "")
    }
  }, [userInfo])

  const handleSave = async () => {
    try {
      await API.patch("/api/myPage/userInfo", {
        nickname,
        number,
        address: userInfo.address,
        detailAddr: userInfo.detailAddr,
        email: userInfo.email,
      })

      alert("저장되었습니다.")
      onClose()
    } catch (error) {
      console.log(error)
      alert("저장 실패")
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>회원 정보 수정</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
              <span>닉네임</span>
            </label>
            <input
              className={styles.input}
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <FontAwesomeIcon icon={faPhone} className={styles.inputIcon} />
              <span>전화번호</span>
            </label>
            <input
              className={styles.input}
              placeholder="전화번호를 입력하세요"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            취소
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            <FontAwesomeIcon icon={faSave} className={styles.buttonIcon} />
            <span>저장하기</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangeInfoModal;