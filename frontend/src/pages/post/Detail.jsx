import React, { useState, useEffect, useRef } from 'react';
import Title from '../../components/Title';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../css/post/Detail.module.css';
import API from '../../api/axiosApi';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faEdit,
  faTrash,
  faHeart,
  faComment,
  faPaperPlane,
  faUser,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons"

const Detail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [posts, setPosts] = useState([])
  const user = useSelector((state) => state.auth.user)
  const userEmail = user?.email
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API.get(`/api/detail/${id}`)
        setPosts(response.data.posts)
      } catch (error) {
        console.log(error)
      }
    }
    fetchPosts()
  }, [id])

  const handleDelete = async () => {
    const confirmedDelete = window.confirm("정말 삭제하시겠습니까?")
    if (!confirmedDelete) return
    try {
      await API.delete(`/api/delete/${id}`)
      alert("삭제되었습니다.")
      navigate("/list")
    } catch (error) {
      console.log(error)
    }
  }

  // 좋아요 이벤트
  const handleLike = async () => {
    try {
      await API.post(`/api/like/${id}`)
      alert("좋아요를 눌렀어요")
      const response = await API.get(`/api/detail/${id}`)
      setPosts(response.data.posts)
    } catch (error) {
      console.log(error)
      if (error.response?.status === 400) {
        alert(error.response.data.message)
      } else if (error.response?.status === 401) {
        alert("로그인이 필요합니다.")
        navigate("/login")
      } else {
        alert(error.response.data.message || "에러 발생")
      }
    }
  }

  // 댓글 불러오기 이벤트
  const getComments = async () => {
    try {
      const response = await API.get(`/api/comment/${id}`)
      setComments(response.data.comments)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getComments()
  }, [id])

  // 댓글 저장 함수
  const handleComment = async () => {
    if (!comment.trim()) {
      return alert("댓글을 입력하세요")
    }

    try {
      await API.post(`/api/comment/${id}`, { comment })
      setComment("")
      getComments()
    } catch (error) {
      console.log(error)
    }
  }

  // 댓글 삭제 함수
  const handleDeleteComment = async (commentId) => {
    const confirmedDelete = window.confirm("정말 삭제하시겠습니까?")
    if (!confirmedDelete) return
    try {
      await API.delete(`/api/comment/${id}/${commentId}`)
      getComments()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={styles.container}>
      <Title text="상세페이지" />

      <div className={styles.detailCard}>
        <div className={styles.postHeader}>
          <div className={styles.postMeta}>
            <FontAwesomeIcon icon={faUser} className={styles.metaIcon} />
            <span className={styles.author}>{posts.nickname}</span>
            <FontAwesomeIcon icon={faCalendar} className={styles.metaIcon} />
            <span className={styles.date}>{posts.writeDate ? new Date(posts.writeDate).toLocaleDateString() : ""}</span>
          </div>
        </div>

        <div className={styles.postContent}>
          <h1 className={styles.postTitle}>{posts.title}</h1>
          <div className={styles.postBody}>{posts.content}</div>
        </div>

        <div className={styles.postActions}>
          <div className={styles.likeSection}>
            <button onClick={handleLike} className={styles.likeButton}>
              <FontAwesomeIcon icon={faHeart} className={styles.heartIcon} />
              <span>좋아요</span>
            </button>
          </div>

          <div className={styles.actionButtons}>
            <button onClick={() => navigate(-1)} className={`${styles.actionButton} ${styles.backButton}`}>
              <FontAwesomeIcon icon={faArrowLeft} className={styles.buttonIcon} />
              <span>뒤로가기</span>
            </button>

            {userEmail === posts.email && (
              <>
                <button
                  onClick={() => navigate(`/edit/${id}`)}
                  className={`${styles.actionButton} ${styles.editButton}`}
                >
                  <FontAwesomeIcon icon={faEdit} className={styles.buttonIcon} />
                  <span>수정하기</span>
                </button>
                <button onClick={handleDelete} className={`${styles.actionButton} ${styles.deleteButton}`}>
                  <FontAwesomeIcon icon={faTrash} className={styles.buttonIcon} />
                  <span>삭제하기</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.commentSection}>
        <div className={styles.commentHeader}>
          <FontAwesomeIcon icon={faComment} className={styles.commentHeaderIcon} />
          <h3 className={styles.commentTitle}>댓글 {Array.isArray(comments) ? comments.length : 0}개</h3>
        </div>

        <div className={styles.commentWrite}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.commentTextarea}
            placeholder="댓글을 입력하세요..."
          />
          <button onClick={handleComment} className={styles.commentSubmitButton}>
            <FontAwesomeIcon icon={faPaperPlane} className={styles.buttonIcon} />
            <span>전송</span>
          </button>
        </div>

        <div className={styles.commentList}>
          {comments.map((item) => (
            <div key={item._id} className={styles.commentItem}>
              <div className={styles.commentAuthor}>
                <FontAwesomeIcon icon={faUser} className={styles.commentAuthorIcon} />
                <strong>{item.nickname}</strong>
              </div>
              <div className={styles.commentContent}>{item.comment}</div>
              <div className={styles.commentFooter}>
                <span className={styles.commentDate}>{new Date(item.date).toLocaleDateString()}</span>
                {user?.email === item.email && (
                  <button onClick={() => handleDeleteComment(item._id)} className={styles.commentDeleteButton}>
                    <FontAwesomeIcon icon={faTrash} />
                    삭제
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Detail
