"use client"

import { useState, useEffect } from "react"
import Title from "../../components/Title"
import { useNavigate } from "react-router-dom"
import styles from "../../css/shop/Cart.module.css"
import API from "../../api/axiosApi"
import { useDispatch, useSelector } from "react-redux"
import { addToCart, clearCart, decreaseQuantity, increaseQuantity } from "../../slices/cartSlice"
import EmptyCart from "./EmptyCart"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMinus,
  faPlus,
  faTrash,
  faShoppingBag,
  faCreditCard,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"

const Cart = () => {
  // 📄 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1)  // 현재 페이지 번호
  const [totalPage, setTotalPage] = useState(1)      // 전체 페이지 수
  
  // 🧭 라우팅과 상태 관리
  const navigate = useNavigate()  // 페이지 이동을 위한 React Router 훅
  const dispatch = useDispatch()  // Redux 액션 디스패치를 위한 훅
  
  // ✅ 체크박스 관련 상태
  const [checkedItems, setCheckedItems] = useState([])  // 선택된 상품 ID 배열
  const cartItems = useSelector((state) => state.cart.items)  // Redux에서 장바구니 아이템 가져오기

  // ➕ 상품 수량 증가 함수
  const handleIncrease = async (item) => {
    dispatch(increaseQuantity(item.id))  // Redux 상태에서 수량 증가
    try {
      // 서버에 수량 증가 요청 (+1)
      await API.patch(`/api/cart/${item.id}`, { quantity: 1 })
      fetchCart()  // 최신 장바구니 데이터 다시 가져오기
    } catch (error) {
      console.log(error)  // 에러 로깅
    }
  }

  // ➖ 상품 수량 감소 함수
  const handleDecrease = async (item) => {
    dispatch(decreaseQuantity(item.id))  // Redux 상태에서 수량 감소
    try {
      // 서버에 수량 감소 요청 (-1)
      await API.patch(`/api/cart/${item.id}`, { quantity: -1 })
      fetchCart()  // 최신 장바구니 데이터 다시 가져오기
    } catch (error) {
      console.log(error)  // 에러 로깅
    }
  }

  // 🛒 서버에서 장바구니 데이터 가져오는 함수
  const fetchCart = async () => {
    try {
      // 현재 페이지의 장바구니 데이터 요청
      const response = await API.get(`/api/cart?page=${currentPage}`)
      console.log("✅ 장바구니 응답 데이터:", response.data)  // 응답 데이터 로깅
      
      dispatch(clearCart())  // 기존 Redux 장바구니 데이터 초기화
      const cartItems = response.data.cart  // 서버에서 받은 장바구니 아이템들
      
      // 장바구니가 비어있으면 함수 종료
      if (cartItems.length === 0) {
        console.log("장바구니가 비어 있습니다.")
        return
      }
      
      // 각 아이템을 Redux 스토어에 추가
      cartItems.forEach((item) => {
        dispatch(
          addToCart({
            id: item._id,                    // 아이템 고유 ID
            productId: item.productId,       // 상품 ID
            name: item.name,                 // 상품명
            price: item.price,               // 가격
            image: item.image,               // 이미지 URL
            description: item.description,   // 상품 설명
            count: item.quantity ?? 1,       // 수량 (없으면 기본값 1)
          }),
        )
      })
      
      setTotalPage(response.data.totalPage)  // 전체 페이지 수 설정
    } catch (error) {
      console.log(error)  // 에러 로깅
    }
  }

  // 🔄 컴포넌트 마운트 시와 페이지 변경 시 장바구니 데이터 가져오기
  useEffect(() => {
    fetchCart()  // 장바구니 데이터 가져오기
  }, [currentPage])  // currentPage가 변경될 때마다 실행

  // ✅ 개별 상품 체크박스 토글 함수
  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => 
      prev.includes(id) 
        ? prev.filter((itemId) => itemId !== id)  // 이미 선택된 경우 제거
        : [...prev, id]                           // 선택되지 않은 경우 추가
    )
  }

  // ✅ 전체 선택/해제 함수
  const handleSelectAll = () => {
    if (checkedItems.length === cartItems.length) {
      setCheckedItems([])  // 모두 선택된 상태면 전체 해제
    } else {
      setCheckedItems(cartItems.map((item) => item.id))  // 전체 선택
    }
  }

  // 🗑️ 상품 삭제 함수
  const handleDeleteStock = async (itemId) => {
    const deleteConfirmed = window.confirm("정말 삭제하시겠습니까?")  // 삭제 확인 다이얼로그
    if (!deleteConfirmed) return  // 취소하면 함수 종료
    
    try {
      await API.delete(`/api/cart/${itemId}`)  // 서버에서 상품 삭제
      fetchCart()  // 최신 장바구니 데이터 다시 가져오기
    } catch (error) {
      console.log(error)  // 에러 로깅
    }
  }

  // 💰 선택된 상품들과 총 금액/수량 계산
  const selectedItems = cartItems.filter((item) => checkedItems.includes(item.id))  // 선택된 상품들만 필터링
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.count, 0)  // 총 금액 계산
  const totalQuantity = selectedItems.reduce((sum, item) => sum + item.count, 0)  // 총 수량 계산

  // 💳 구매하기 버튼 클릭 함수
  const handleSubmitBuyItem = async () => {
    const selectedItems = cartItems.filter((item) => checkedItems.includes(item.id))  // 선택된 상품들
    const totalQuantity = selectedItems.reduce((sum, item) => sum + item.count, 0)    // 총 수량
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.count, 0)  // 총 금액
    
    // 선택된 상품이 없으면 알림 후 함수 종료
    if (selectedItems.length === 0) {
      alert("상품을 선택해주세요")
      return
    }
    
    try {
      // 결제 페이지로 보낼 데이터 준비 및 전송
      await API.post("/api/payment/buy", {
        items: selectedItems.map((item) => ({
          cartId: item._id || item.id,      // 장바구니 아이템 ID
          productId: item.productId,        // 상품 ID
          name: item.name,                  // 상품명
          image: item.image,                // 이미지
          price: item.price,                // 가격
          quantity: item.count,             // 수량
          description: item.description,    // 설명
        })),
        totalPrice,    // 총 금액
        totalQuantity, // 총 수량
      })
      navigate("/payment")  // 결제 페이지로 이동
    } catch (error) {
      console.log(error)  // 에러 로깅
    }
  }

  // 📄 페이지네이션 버튼들을 렌더링하는 함수
  const renderPagination = () => {
    const pages = []  // 페이지 버튼들을 담을 배열
    const pageGroup = Math.ceil(currentPage / 5)  // 현재 페이지 그룹 (5개씩 묶음)
    const startPage = (pageGroup - 1) * 5 + 1     // 그룹의 시작 페이지
    let endPage = startPage + 4                    // 그룹의 끝 페이지
    if (endPage > totalPage) endPage = totalPage   // 전체 페이지 수를 넘지 않도록 조정

    pages.push(
      <button
        key="prev"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ""}`}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
        <span>이전</span>
      </button>,
    )

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`${styles.pageNumber} ${currentPage === i ? styles.active : ""}`}
        >
          {i}
        </button>,
      )
    }

    pages.push(
      <button
        key="next"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPage))}
        disabled={currentPage === totalPage}
        className={`${styles.pageButton} ${currentPage === totalPage ? styles.disabled : ""}`}
      >
        <span>다음</span>
        <FontAwesomeIcon icon={faChevronRight} />
      </button>,
    )

    return pages
  }

  return (
    <div className={styles.pageWrapper}>
      <Title text="장바구니" />
      <div className={styles.cartContainer}>
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className={styles.cartContent}>
            <div className={styles.cartItems}>
              <div className={styles.cartHeader}>
                <label className={styles.selectAllLabel}>
                  <input
                    type="checkbox"
                    checked={checkedItems.length === cartItems.length && cartItems.length > 0}
                    onChange={handleSelectAll}
                    className={styles.selectAllCheckbox}
                  />
                  <span className={styles.checkboxCustom}></span>
                  <span>
                    전체선택 ({checkedItems.length}/{cartItems.length})
                  </span>
                </label>
              </div>

              {/* 상품의 배열  */}
              <div className={styles.cartList}>
                {cartItems.map((item) => (
                  <div className={styles.cartItem} key={item._id}>
                    <label className={styles.itemCheckbox}>
                      <input
                        type="checkbox"
                        checked={checkedItems.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkboxCustom}></span>
                    </label>

                    <div className={styles.itemImage}>
                      <img src={item.image || "/placeholder.svg"} alt={item.name} />
                    </div>

                    <div className={styles.itemDetails}>
                      <div className={styles.itemNameRow}>
                        <h3 className={styles.itemName}>{item.name}</h3>
                        <button className={styles.deleteButton} onClick={() => handleDeleteStock(item.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>

                      <p className={styles.itemDescription}>{item.description}</p>
                      <div className={styles.itemPrice}>{item.price.toLocaleString()} 원</div>

                      {/* click 시 수량 변경경 */}
                      <div className={styles.itemActions}>
                        <div className={styles.quantityControl}>
                          <button
                            className={styles.quantityButton}
                            onClick={() => handleDecrease(item)}
                            disabled={item.count <= 1}
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                          <span className={styles.quantity}>{item.count}</span>
                          <button className={styles.quantityButton} onClick={() => handleIncrease(item)}>
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>

                        <div className={styles.itemTotal}>{(item.price * item.count).toLocaleString()} 원</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.pagination}>{renderPagination()}</div>
            </div>

            <div className={styles.orderSummary}>
              <div className={styles.summaryHeader}>
                <h2>주문 요약</h2>
              </div>

              <div className={styles.summaryContent}>
                <div className={styles.summaryItem}>
                  <span>총 상품 금액</span>
                  <span>{totalPrice.toLocaleString()} 원</span>
                </div>

                <div className={styles.summaryItem}>
                  <span>총 상품 수량</span>
                  <span>{totalQuantity} 개</span>
                </div>

                <div className={styles.summaryTotal}>
                  <span>결제 예상 금액</span>
                  <span>{totalPrice.toLocaleString()} 원</span>
                </div>

                <div className={styles.summaryActions}>
                  <button className={styles.continueShoppingButton} onClick={() => navigate("/shop")}>
                    <FontAwesomeIcon icon={faShoppingBag} />
                    <span>쇼핑 계속하기</span>
                  </button>

                  <button
                    className={styles.checkoutButton}
                    onClick={handleSubmitBuyItem}
                    disabled={checkedItems.length === 0}
                  >
                    <FontAwesomeIcon icon={faCreditCard} />
                    <span>구매하기</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
