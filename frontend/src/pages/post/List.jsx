import React, { useState, useEffect, useRef } from 'react';
import Title from '../../components/Title';
import axios from 'axios';
import styles from '../../css/post/List.module.css';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axiosApi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

const List = () => {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [sortType, setSortType] = useState('date')

    const [keyword, setKeyword] = useState('');
    const [searchType, setSearchType] = useState('title');

    const [isSearchMode, setIsSearchMode] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);


    // 데이터 받아오기
    const fetchPosts = async (page = 1) => {
        try {
            const response = await API.get(`/api/list?page=${page}&sort=${sortType}`);
            setPosts(response.data.posts);
            setTotalPage(response.data.totalPage); // ✅ 수정: 서버에서 totalPage도 받음
        } catch (error) {
            console.log(error);
        }
    };

    // ✅ 수정: currentPage가 바뀔 때마다 fetchPosts 호출
    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage, sortType]);


    // 데이터 검색기능
    const handleSearch = async () => {
        try {
            const response = await API.get(`/api/list/search?type=${searchType}&keyword=${keyword}`)
            setPosts(response.data.posts)
            setIsSearchMode(true)
        } catch (error) {
            console.log(error);
        }
    }


    // 엔터키 활성화
    const handleSearchKeyDown = (e) => {
        if(e.key === 'Enter') {
            handleSearch();
        }
    }


    // 조회수 증가
    const handleUpdateView = async (id) => {
        try {
            await API.post(`/api/view/${id}`);
            navigate(`/detail/${id}`)
        } catch (error) {
            console.log(error);
            
        }
    }

  
    // 제목 글자수 제한
    const limitTitle = (text, maxLength) => {
        if(!text) return ''; // null/undefined 방지
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : '';
    };

    // 날짜 포멧
    const formatDate = (dateString) => {
        const now = dayjs();
        const writtenTime = dayjs(dateString);

        // 24시간 차이 계산
        const diffInHours = now.diff(writtenTime, 'hour');

        if(diffInHours < 24) {
            return writtenTime.fromNow(); // 3분 전
        } else {
            return writtenTime.format('YY.MM.DD') // 25.06.27
        }
    }

    // 관리자가 쓴 글
    const isAdminUser = (item) => {
        const email = item.email || '';
        // const nickname = item.nickname || '';
        return email === 'admin@example.com';
    }
    
   

    // 페이지네이션
    const renderPagination = () => {
        const page = [];
        const pageGroup = Math.ceil(currentPage / 5);
        const startPage = (pageGroup - 1) * 5 + 1;
        let endPage = startPage + 4;
        if(endPage > totalPage) endPage = totalPage;

        // 항상 이전 버튼
        page.push(
            <button
                key="prev"
                // onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1: 1)}
                // onClick={() => setCurrentPage(currentPage - 1)}
                
                //prev - 1과 1 중 더 큰 값을 선택 → 최소 1페이지 보장
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} // 	1페이지보다 작아지지 않도록 제한
                disabled= {currentPage === 1}
                style={{
                    margin: '0 5px',
                    padding: '6px 12px',
                    backgroundColor: '#ccc',
                    border: '1px solid #eee',
                    cursor: currentPage === 1 ? 'default' : 'pointer',
                    opacity: currentPage === 1 ? '0.5' : 1,
                    width:'50px',
                    fontSize:'12px',
                }}
            >
                이전
            </button>
        )

        for(let i = startPage; i <= endPage; i++) {
            page.push(
                <button 
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    style={{
                        margin: '0 5px',
                        padding: '6px 12px',
                        backgroundColor: currentPage === i ? '#333' : '#fff',
                        color: currentPage === i ? '#fff' : '#000',
                        border: '1px solid #ccc',
                        fontWeight: currentPage === i ? 'bold' : 'normal',
                        cursor: 'pointer',
                        width:'30px',
                        fontSize:'14px',
                    }}
                >
                    {i}
                </button>
            )
        }

        // 항상 다음 버튼
        page.push(
            <button

                key="next"
                // 마지막 페이지보다 커지지 않도록 제한
                // prev + 1 , totalPage 중 작은값을 선택 -> 최대 마지막 페이지 보장
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPage))}
                style={{
                    margin: '0 5px',
                    padding: '6px 12px',
                    backgroundColor: '#ccc',
                    border: '1px solid #ccc',
                    cursor: currentPage === totalPage ? 'default' : 'pointer',
                    opacity: currentPage === totalPage ? 0.5 : 1,
                    width:'50px',
                    fontSize:'12px',
                }}
                disabled={currentPage === totalPage}
            >
                다음
            </button>
        );
        return page;
    }

    return (
        <div className={styles.pageWrapper}>
      <Title text="게시판" />
      <div className={styles.list}>
        <div className={styles.TopContainer}>
          <div className={styles.leftTop}>
            <div
              onClick={() => setSortType("likes")}
              className={`${styles.topBtn} ${sortType === "likes" ? styles.activeTab : ""}`}
            >
              인기글
            </div>
            <div
              onClick={() => setSortType("date")}
              className={`${styles.topBtn} ${sortType === "date" ? styles.activeTab : ""}`}
            >
              최신글
            </div>
            <div
              onClick={() => setSortType("views")}
              className={`${styles.topBtn} ${sortType === "views" ? styles.activeTab : ""}`}
            >
              조회수
            </div>
            <div className={styles.writeBtn} onClick={() => navigate("/write")}>
              글쓰기
            </div>
          </div>
          <div className={styles.rightTop}>
            <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className={styles.selectBox}>
              <option value="title">제목</option>
              <option value="nickname">닉네임</option>
            </select>
            <div className={styles.searchContainer}>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className={styles.search}
                placeholder="검색어를 입력하세요"
              />
              <div className={styles.searchImg} onClick={handleSearch}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomContainer}>
          <div className={styles.titleContainer}>
            <div className={styles.topTitle}>제목</div>
            <div className={styles.topAuthor}>작성자</div>
            <div className={styles.topDate}>작성일</div>
            <div className={styles.topLikes}>추천수</div>
            <div className={styles.topViews}>조회수</div>
          </div>
          {posts.map((item, i) => {
            const rawTitle = (item.title || "").trim()
            const normalizedTitle = rawTitle.replace(/^\[공지사항\]\s*/, "")
            const admin = isAdminUser(item)

            return (
              <div onClick={() => handleUpdateView(item._id)} key={item._id} className={styles.contentContainer}>
                <div className={`${styles.bottomTitle} ${admin ? styles.noticeTitle : ""}`}>
                  {admin && <span className={styles.noticeBadge}>공지</span>}
                  {admin ? `[공지사항] ${normalizedTitle}` : normalizedTitle}
                </div>
                <div className={`${styles.bottomAuthor} ${admin ? styles.noticeTitle : ""}`}>
                  {item.nickname || (admin ? "관리자" : "")}
                </div>
                <div className={styles.bottomDate}>{formatDate(item.createdAt || item.writeDate)}</div>
                <div className={styles.bottomLikes}>{item.likes}</div>
                <div className={styles.bottomViews}>{item.views}</div>
              </div>
            )
          })}
        </div>

        <div className={styles.paginationContainer}>{renderPagination()}</div>
      </div>
    </div>
    )
}


export default List;