"use client"

import { useState, useEffect } from "react"
import Title from "../../components/Title"
import styles from "../../css/auth/MyPage.module.css"
import { useNavigate } from "react-router-dom"
import API from "../../api/axiosApi"
import ChangeInfoModal from "./ChangeInfoModal"
import { useDispatch } from "react-redux"
import { setUser } from "../../slices/authSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCamera, faEdit, faShoppingBag, faFileText } from "@fortawesome/free-solid-svg-icons"

const MyPage = () => {
  // 기본 상태
  const [userInfo, setUserInfo] = useState({})
  const [purchaseList, setPurchaseList] = useState([])
  const [posts, setPosts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // 페이지네이션 상태
  const [postsCurrentPage, setPostsCurrentPage] = useState(1)
  const [purchasesCurrentPage, setPurchasesCurrentPage] = useState(1)
  const [postsTotalPages, setPostsTotalPages] = useState(1)
  const [purchasesTotalPages, setPurchasesTotalPages] = useState(1)
  const postsPerPage = 10
  const purchasesPerPage = 10

  // 로딩 상태
  const [loading, setLoading] = useState(false)

  // 데이터 가져오기 - 기존 코드 그대로 유지
  const fetchUserInfo = async () => {
    try {
      const response = await API.get(`/api/myPage`)
      console.log("✅ userInfo:", response.data.userInfo)
      console.log("✅ purchaseItem:", response.data.purchaseItem)
      console.log("✅ userWrite:", response.data.userWrite)
      setUserInfo(response.data.userInfo)
      dispatch(setUser(response.data.userInfo))
      setPurchaseList(response.data.purchaseItem)
      setPosts(response.data.userWrite)
    } catch (error) {
      console.log(error)
    }
  }

  // 🎯 구매 내역만 가져오기 (페이지네이션 없이 전체 데이터)
  const fetchPurchaseHistory = async () => {
    try {
      setLoading(true)
      const response = await API.get(`/api/myPage/purchases`) // 전체 데이터
      setPurchaseList(response.data.purchases)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // 🎯 작성한 글 전체 가져오기 (클라이언트 사이드 페이지네이션)
  const fetchUserPosts = async () => {
    try {
      setLoading(true)
      const response = await API.get(`/api/myPage/posts`) // 페이지 파라미터 제거
      setPosts(response.data.posts || response.data.userWrite || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // 🎯 탭 변경 시 해당 데이터만 가져오기 (페이지네이션 함수 제거)
  const handleTabChange = (tab) => {
    setActiveTab(tab)

    switch (tab) {
      case "profile":
        // 프로필은 이미 로드되어 있음
        break
      case "purchases":
        if (purchaseList.length === 0) {
          fetchPurchaseHistory() // 페이지 파라미터 제거
        }
        break
      case "posts":
        if (posts.length === 0) {
          fetchUserPosts() // 페이지 파라미터 제거
        }
        break
    }
  }

  // 🎯 페이지 변경 시 해당 페이지 데이터 가져오기
  const handlePurchasePageChange = (page) => {
    // fetchPurchaseHistory(page)
  }

  const handlePostPageChange = (page) => {
    setPostsCurrentPage(page)
  }

  // 초기 로드 시 프로필 정보만
  useEffect(() => {
    fetchUserInfo()
  }, [])

  // 모달 닫기 함수
  const handleCloseModal = () => {
    setShowModal(false)
    fetchUserInfo() // 프로필 정보 새로고침
  }

  // 이미지 변경
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append("profileImage", file)
    try {
      const response = await API.post("/api/myPage/uploadImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      alert("이미지 업로드 완료")
      setUserInfo((prev) => ({ ...prev, image: response.data.imageUrl }))
    } catch (error) {
      console.error("이미지 업로드 실패:", error)
      alert("이미지 업로드 실패")
    }
  }

  // 구매내역 페이지네이션 렌더링 (프론트엔드에서만)
  const renderPurchasePagination = () => {
    const totalPurchasePages = Math.ceil(purchaseList.length / purchasesPerPage)

    // 디버깅을 위한 콘솔 로그 추가
    console.log("🔍 구매내역 페이지네이션 디버깅:")
    console.log("- purchaseList.length:", purchaseList.length)
    console.log("- purchasesPerPage:", purchasesPerPage)
    console.log("- totalPurchasePages:", totalPurchasePages)
    console.log("- purchasesCurrentPage:", purchasesCurrentPage)

    if (totalPurchasePages <= 1) {
      console.log("❌ 페이지네이션 숨김: totalPurchasePages <= 1")
      return null
    }

    console.log("✅ 페이지네이션 표시")

    const pages = []

    pages.push(
      <button
        key="prev"
        onClick={() => setPurchasesCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={purchasesCurrentPage === 1}
        className={`${styles.pageButton} ${purchasesCurrentPage === 1 ? styles.disabled : ""}`}
      >
        이전
      </button>,
    )

    for (let i = 1; i <= totalPurchasePages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPurchasesCurrentPage(i)}
          className={`${styles.pageNumber} ${purchasesCurrentPage === i ? styles.active : ""}`}
        >
          {i}
        </button>,
      )
    }

    pages.push(
      <button
        key="next"
        onClick={() => setPurchasesCurrentPage((prev) => Math.min(prev + 1, totalPurchasePages))}
        disabled={purchasesCurrentPage === totalPurchasePages}
        className={`${styles.pageButton} ${purchasesCurrentPage === totalPurchasePages ? styles.disabled : ""}`}
      >
        다음
      </button>,
    )

    return <div className={styles.pagination}>{pages}</div>
  }

  // 작성한 글 페이지네이션 렌더링 (클라이언트 사이드로 변경)
  const renderPostPagination = () => {
    const totalPostPages = Math.ceil(posts.length / postsPerPage)

    console.log("🔍 작성한 글 페이지네이션 디버깅:")
    console.log("- posts.length:", posts.length)
    console.log("- postsPerPage:", postsPerPage)
    console.log("- totalPostPages:", totalPostPages)
    console.log("- postsCurrentPage:", postsCurrentPage)

    if (totalPostPages <= 1) {
      console.log("❌ 페이지네이션 숨김: totalPostPages <= 1")
      return null
    }

    console.log("✅ 페이지네이션 표시")

    const pages = []

    pages.push(
      <button
        key="prev"
        onClick={() => setPostsCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={postsCurrentPage === 1}
        className={`${styles.pageButton} ${postsCurrentPage === 1 ? styles.disabled : ""}`}
      >
        이전
      </button>,
    )

    for (let i = 1; i <= totalPostPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPostsCurrentPage(i)}
          className={`${styles.pageNumber} ${postsCurrentPage === i ? styles.active : ""}`}
        >
          {i}
        </button>,
      )
    }

    pages.push(
      <button
        key="next"
        onClick={() => setPostsCurrentPage((prev) => Math.min(prev + 1, totalPostPages))}
        disabled={postsCurrentPage === totalPostPages}
        className={`${styles.pageButton} ${postsCurrentPage === totalPostPages ? styles.disabled : ""}`}
      >
        다음
      </button>,
    )

    return <div className={styles.pagination}>{pages}</div>
  }

  // 구매 내역 섹션에서 현재 페이지 데이터만 표시
  return (
    <div className={styles.pageWrapper}>
      <Title text="마이페이지" />
      <div className={styles.myPage}>
        <div className={styles.sidebar}>
          <div className={styles.profileSummary}>
            <div className={styles.profileImageContainer}>
              <img className={styles.profileImage} src={userInfo.image || "/default.png"} alt="프로필 이미지" />
              <label htmlFor="profile-upload" className={styles.imageUploadButton}>
                <FontAwesomeIcon icon={faCamera} />
              </label>
              <input id="profile-upload" type="file" onChange={handleImageChange} className={styles.fileInput} />
            </div>
            <h2 className={styles.userName}>{userInfo.nickname || "사용자"}</h2>
            <p className={styles.userEmail}>{userInfo.email || "email@example.com"}</p>
          </div>

          <nav className={styles.navigation}>
            <button
              className={`${styles.navButton} ${activeTab === "profile" ? styles.active : ""}`}
              onClick={() => handleTabChange("profile")}
            >
              <span className={styles.navIcon}>
                <FontAwesomeIcon icon={faEdit} />
              </span>
              프로필 정보
            </button>
            <button
              className={`${styles.navButton} ${activeTab === "purchases" ? styles.active : ""}`}
              onClick={() => handleTabChange("purchases")}
            >
              <span className={styles.navIcon}>
                <FontAwesomeIcon icon={faShoppingBag} />
              </span>
              구매 내역
            </button>
            <button
              className={`${styles.navButton} ${activeTab === "posts" ? styles.active : ""}`}
              onClick={() => handleTabChange("posts")}
            >
              <span className={styles.navIcon}>
                <FontAwesomeIcon icon={faFileText} />
              </span>
              작성한 글
            </button>
          </nav>
        </div>

        <div className={styles.contentArea}>
          {/* 로딩 상태 */}
          {loading && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>데이터를 불러오는 중...</p>
            </div>
          )}

          {/* 프로필 섹션 */}
          {activeTab === "profile" && !loading && (
            <div className={styles.profileSection}>
              <div className={styles.sectionHeader}>
                <h2>프로필 정보</h2>
                <button className={styles.editButton} onClick={() => setShowModal(true)}>
                  정보 수정
                </button>
              </div>

              <div className={styles.profileDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>닉네임</span>
                  <span className={styles.detailValue}>{userInfo.nickname || "-"}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>이메일</span>
                  <span className={styles.detailValue}>{userInfo.email || "-"}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>전화번호</span>
                  <span className={styles.detailValue}>{userInfo.number || "-"}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>주소</span>
                  <span className={styles.detailValue}>{userInfo.address || "-"}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>상세주소</span>
                  <span className={styles.detailValue}>{userInfo.detailAddr || "-"}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "purchases" && (
            <div className={styles.purchasesSection}>
              <div className={styles.sectionHeader}>
                <h2>구매 내역</h2>
              </div>
              {purchaseList.length > 0 ? (
                <>
                  <div className={styles.purchasesList}>
                    <div className={styles.purchaseHeader}>
                      <span className={styles.purchaseProduct}>상품명</span>
                      <span className={styles.purchasePrice}>가격</span>
                      <span className={styles.purchaseDate}>구매일</span>
                    </div>
                    {(() => {
                      // 🎯 프론트엔드 페이지네이션: 현재 페이지 데이터만 표시
                      const purchaseStartIndex = (purchasesCurrentPage - 1) * purchasesPerPage
                      const currentPurchases = purchaseList.slice(
                        purchaseStartIndex,
                        purchaseStartIndex + purchasesPerPage,
                      )
                      return currentPurchases.map((purchase, i) => {
                        const payment = purchase.paymentData || {}
                        const itemNames =
                          Array.isArray(payment.items) && payment.items.length > 0
                            ? payment.items.length === 1
                              ? payment.items[0]?.name
                              : `${payment.items[0]?.name} 외 ${payment.items.length - 1}개`
                            : "상품 없음"
                        const firstItemPrice =
                          Array.isArray(payment.items) && payment.items.length > 0
                            ? payment.items[0].price?.toLocaleString()
                            : "0"
                        const purchaseDate = payment.createdAt
                          ? new Date(payment.createdAt).toLocaleDateString()
                          : "날짜 없음"
                        return (
                          <div className={styles.purchaseItem} key={i}>
                            <span className={styles.purchaseProduct}>{itemNames}</span>
                            <span className={styles.purchasePrice}>{firstItemPrice}원</span>
                            <span className={styles.purchaseDate}>{purchaseDate}</span>
                          </div>
                        )
                      })
                    })()}
                  </div>

                  {/* 🎯 구매내역 페이지네이션 추가 */}
                  {renderPurchasePagination()}
                </>
              ) : (
                <div className={styles.emptyState}>
                  <p>구매 내역이 없습니다.</p>
                  <button className={styles.shopButton} onClick={() => navigate("/shop")}>
                    쇼핑하러 가기
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 작성한 글 섹션 */}
          {activeTab === "posts" && !loading && (
            <div className={styles.postsSection}>
              <div className={styles.sectionHeader}>
                <h2>작성한 글</h2>
              </div>

              {posts.length > 0 ? (
                <>
                  <div className={styles.postsList}>
                    <div className={styles.postHeader}>
                      <span className={styles.postTitle}>제목</span>
                      <span className={styles.postViews}>조회수</span>
                      <span className={styles.postComments}>댓글수</span>
                      <span className={styles.postDate}>작성일</span>
                    </div>

                    {(() => {
                      // 🎯 프론트엔드 페이지네이션: 현재 페이지 데이터만 표시
                      const postStartIndex = (postsCurrentPage - 1) * postsPerPage
                      const currentPosts = posts.slice(postStartIndex, postStartIndex + postsPerPage)

                      return currentPosts.map((post, index) => (
                        <div className={styles.postItem} key={index} onClick={() => navigate(`/detail/${post._id}`)}>
                          <span className={styles.postTitle} title={post.title}>
                            {post.title.length > 20 ? post.title.slice(0, 20) + "..." : post.title}
                          </span>
                          <span className={styles.postViews}>{post.views}</span>
                          <span className={styles.postComments}>{post.comments?.length || 0}</span>
                          <span className={styles.postDate}>{new Date(post.writeDate || post.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))
                    })()}
                  </div>

                  {renderPostPagination()}
                </>
              ) : (
                <div className={styles.emptyState}>
                  <p>작성한 글이 없습니다.</p>
                  <button className={styles.writeButton} onClick={() => navigate("/write")}>
                    글 작성하기
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && userInfo && <ChangeInfoModal userInfo={userInfo} onClose={handleCloseModal} />}
    </div>
  )
}

export default MyPage
