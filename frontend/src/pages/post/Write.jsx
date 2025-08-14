import React, { useState, useEffect, useRef } from 'react';
import Title from '../../components/Title';
import axios from 'axios';
import styles from '../../css/post/Write.module.css'
import { useNavigate } from 'react-router-dom';
import { TitleVal, ContentVal } from '../../utils/validation';
import API from '../../api/axiosApi';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faSave, faArrowLeft, faPen, faAlignLeft } from "@fortawesome/free-solid-svg-icons"

const Write = () => {
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const titleRef = useRef(null)
    const contentRef = useRef(null)
  
    // 글쓰기 저장하기
    const handleWriteSubmit = async () => {
      if (!title.trim()) {
        alert("제목을 입력해주세요")
        titleRef.current?.focus()
        return
      }
      if (!content.trim()) {
        alert("내용을 입력해주세요")
        contentRef.current?.focus()
        return
      }
  
      try {
        await API.post(
          "/api/write",
          {
            title,
            content,
          },
          { withCredentials: true },
        )
        alert("글 저장 완료")
        navigate("/list")
      } catch (error) {
        console.log(error)
        alert("글쓰기 저장에 실패하였습니다. 다시 시도해 주세요")
      }
    }
  
    return (
      <div className={styles.container}>
        <Title text="글쓰기" />
        <div className={styles.writeCard}>
          <div className={styles.formSection}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <FontAwesomeIcon icon={faPen} className={styles.inputIcon} />
                <span>제목</span>
              </label>
              <input
                ref={titleRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.titleInput}
                placeholder="제목을 입력하세요"
              />
            </div>
  
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <FontAwesomeIcon icon={faAlignLeft} className={styles.inputIcon} />
                <span>내용</span>
              </label>
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={styles.contentTextarea}
                placeholder="내용을 입력하세요"
              />
            </div>
          </div>
  
          <div className={styles.buttonContainer}>
            <button onClick={() => navigate(-1)} className={`${styles.button} ${styles.cancelButton}`}>
              <FontAwesomeIcon icon={faArrowLeft} className={styles.buttonIcon} />
              <span>뒤로가기</span>
            </button>
            <button onClick={handleWriteSubmit} className={`${styles.button} ${styles.saveButton}`}>
              <FontAwesomeIcon icon={faSave} className={styles.buttonIcon} />
              <span>저장하기</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  export default Write
  