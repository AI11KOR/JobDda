import React, { useState, useEffect, useRef } from 'react';
import Title from '../../components/Title';
import axios from 'axios';
import styles from '../../css/post/Edit.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/axiosApi';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faSave, faArrowLeft, faPen, faAlignLeft } from "@fortawesome/free-solid-svg-icons"

const Edit = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [posts, setPosts] = useState({
      title: "",
      content: "",
      nickname: "",
    })
    const titleRef = useRef(null)
    const contentRef = useRef(null)
  
    // 데이터 가져오기
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await API.get(`/api/editPage/${id}`)
          setPosts(response.data.posts)
        } catch (error) {
          console.log(error)
          alert("데이터를 불러오는데 실패했습니다.")
        }
      }
      fetchPosts()
    }, [id])
  
    // 데이터 저장하기
    const handleSaveEdit = async () => {
      if (!posts.title.trim()) {
        alert("제목을 입력해주세요")
        titleRef.current?.focus()
        return
      }
      if (!posts.content.trim()) {
        alert("내용을 입력해주세요")
        contentRef.current?.focus()
        return
      }
      try {
        await API.patch(`/api/edit/${id}`, {
          title: posts.title,
          content: posts.content,
        })
        alert("수정이 완료되었습니다.")
        navigate("/list")
      } catch (error) {
        console.log(error)
        alert("수정 중 오류가 발생했습니다.")
      }
    }
  
    return (
      <div className={styles.container}>
        <Title text="글 수정" />
        <div className={styles.editCard}>
          <div className={styles.formSection}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <FontAwesomeIcon icon={faPen} className={styles.inputIcon} />
                <span>제목</span>
              </label>
              <input
                ref={titleRef}
                value={posts.title}
                onChange={(e) => setPosts({ ...posts, title: e.target.value })}
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
                value={posts.content}
                onChange={(e) => setPosts({ ...posts, content: e.target.value })}
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
            <button onClick={handleSaveEdit} className={`${styles.button} ${styles.saveButton}`}>
              <FontAwesomeIcon icon={faSave} className={styles.buttonIcon} />
              <span>저장하기</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  export default Edit
  