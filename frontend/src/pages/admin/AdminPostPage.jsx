import React, { useState, useEffect, useRef } from 'react';
import styles from '../../css/admin/AdminPostPage.module.css'
import { useNavigate, useParams } from 'react-router-dom';
import Title from "../../components/Title"
import API from '../../api/axiosApi';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import dayjs from "dayjs"

const AdminPostPage = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [post, setPost] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [totalPostCount, setTotalPostCount] = useState(0)
    const [topNickname, setTopNickname] = useState("")
  
    const fetchPosts = async (currentPage) => {
      try {
        const response = await API.get(`/api/adminPost?page=${currentPage}`)
        setPost(response.data.posts)
        setTotalPage(response.data.totalPage)
        setTotalPostCount(response.data.totalPostCount)
        setTopNickname(response.data.topNickname)
      } catch (error) {
        console.log(error)
        alert("데이터 받아오기 실패")
      }
    }
  
    useEffect(() => {
      fetchPosts(currentPage)
    }, [currentPage])
  
    // 해당 게시글 클릭시 이동
    const handleClickUserPost = async () => {
      try {
        const response = await API.get(`/api/detail/${id}`)
        setPost(response.data.posts)
      } catch (error) {
        console.log(error)
        alert("게시글 이동 실패")
      }
    }
  
    // 데이터 삭제하기
    const handleDeletePosts = async (id) => {
      const confirmedDelete = window.confirm("삭제하시겠습니까?")
      if (!confirmedDelete) return
      try {
        await API.delete(`/api/adminPost/delete/${id}`)
        alert("삭제되었습니다.")
        fetchPosts(currentPage)
      } catch (error) {
        console.log(error)
        alert("데이터 삭제 실패:", error)
      }
    }
  
    // 날짜 포멧
    const formatDate = (dateString) => {
      const now = dayjs()
      const writtenTime = dayjs(dateString)
      const diffInHours = now.diff(writtenTime, "hour")
  
      if (diffInHours < 24) {
        return writtenTime.fromNow()
      } else {
        return writtenTime.format("YY.MM.DD")
      }
    }
  
    const renderPagination = () => {
      const pageGroup = Math.ceil(currentPage / 10)
      const pages = []
      const startPage = (pageGroup - 1) * 5 + 1
      let endPage = startPage + 4
      if (endPage > totalPage) endPage = totalPage
  
      pages.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          className={styles.paginationButton}
        >
          이전
        </button>,
      )
  
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`${styles.paginationMiddleBtn} ${currentPage === i ? styles.activePage : ""}`}
          >
            {i}
          </button>,
        )
      }
  
      pages.push(
        <button
          key="next"
          onClick={() => {
            if (currentPage < totalPage) {
              setCurrentPage(currentPage + 1)
            }
          }}
          className={styles.paginationButton}
          disabled={currentPage === totalPage}
        >
          다음
        </button>,
      )
      return pages
    }
  
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.cardContainer}>
          <Title text="관리자 게시판" />
  
          <div className={styles.container}>
            <div className={styles.containerWord}>
              <p>
                전체 게시글 수 <strong>{totalPostCount}</strong>
              </p>
              <p>
                가장 많이 글 쓴 유저 <strong>{topNickname}</strong>
              </p>
            </div>
  
            <div className={styles.backBtn} onClick={() => navigate(-1)}>
              <span>뒤로가기</span>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </div>
          </div>
  
          <div className={styles.postContainer}>
            <div className={styles.postHeader}>
              <div className={styles.postTitle}>제목</div>
              <div className={styles.postNickname}>닉네임</div>
              <div className={styles.postDate}>등록일</div>
              <div className={styles.postDeleteTitle}>삭제하기</div>
            </div>
  
            {post.map((item, i) => (
              <div key={item._id} onClick={() => navigate(`/detail/${item._id}`)} className={styles.postInfo}>
                <div className={styles.postTitle}>
                  {item.title?.length > 20 ? item.title.slice(0, 20) + "..." : item.title}
                </div>
                <div className={styles.postNickname}>{item.nickname}</div>
                <div className={styles.postDate}>{formatDate(item.writeDate || item.createdAt)}</div>
                <div
                  className={styles.postDelete}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeletePosts(item._id)
                  }}
                >
                  삭제
                </div>
              </div>
            ))}
          </div>
  
          <div className={styles.pagination}>{renderPagination()}</div>
        </div>
      </div>
    )
  }
  
  export default AdminPostPage