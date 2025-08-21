import { useState, useEffect } from "react"
import Title from "../../components/Title"
import styles from "../../css/shop/Payment.module.css"
import { useNavigate } from "react-router-dom"
import API from "../../api/axiosApi"
import { clearCart } from "../../slices/cartSlice"
import { useDispatch } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCreditCard, faCheckCircle } from "@fortawesome/free-solid-svg-icons"

const Payment = () => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({})
  const [productInfo, setProductInfo] = useState([])
  const [agreeSelected, setAgreeSelected] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [selectPg, setSelectPg] = useState("")
  const dispatch = useDispatch()

  // 데이터 가져오기
  const fetchPayment = async () => {
    try {
      const response = await API.get("/api/payment")
      const items = response.data.payment
      setProductInfo(items)
      setUserInfo(response.data.user)

      const price = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const quantity = items.reduce((sum, item) => sum + item.quantity, 0)
      setTotalPrice(price)
      setTotalQuantity(quantity)

      // 🔍 전체 데이터 구조를 완전히 확인
      console.log("✅ 전체 응답 데이터:", JSON.stringify(response.data, null, 2))
      console.log("✅ 결제 대상 상품 배열:", JSON.stringify(items, null, 2))

      if (items[0]) {
        console.log("🔍 첫 번째 상품의 모든 필드:", Object.keys(items[0]))
        console.log("🔍 첫 번째 상품 완전한 데이터:", JSON.stringify(items[0], null, 2))
      }

      // Cart API와 비교를 위해 Cart 데이터도 확인
      try {
        const cartResponse = await API.get("/api/cart?page=1")
        console.log("🛒 Cart API 응답:", JSON.stringify(cartResponse.data, null, 2))
        if (cartResponse.data.cart[0]) {
          console.log("🛒 Cart 첫 번째 상품:", JSON.stringify(cartResponse.data.cart[0], null, 2))
        }
      } catch (cartError) {
        console.log("Cart 데이터 조회 실패:", cartError)
      }
    } catch (error) {
      if (error.response) {
        console.error("⚠️ fetchPayment 서버 응답 에러:", error.response.status, error.response.data)
      } else if (error.request) {
        console.error("⚠️ fetchPayment 서버 응답 없음:", error.request)
      } else {
        console.error("⚠️ fetchPayment 요청 에러:", error.message)
      }
    }
  }

  useEffect(() => {
    fetchPayment()
  }, [])

  // 결제 요청 구현
  const handlePayment = () => {
    if (!selectPg) {
      alert("결제 수단을 선택해 주세요.")
      return
    }
    console.log("결제 PG 코드:", selectPg)
    if (totalPrice <= 0) {
      alert("결제 금액이 0원입니다. 장바구니를 확인해주세요")
      return
    }

    const { IMP } = window
    IMP.init("imp63438585")

    IMP.request_pay(
      {
        pg: selectPg,
        pay_method: "card",
        merchant_uid: `mid_${new Date().getTime()}`,
        name: "상품명",
        amount: totalPrice,
        buyer_email: userInfo.email,
        buyer_name: userInfo.nickname,
        buyer_tel: userInfo.number,
        buyer_addr: userInfo.address,
        buyer_postcode: userInfo.postcode,
      },
      async (rsp) => {
        if (!rsp.success) {
          alert(`결제에 실패하였습니다: ${rsp.error_msg}`)
          console.error("💳 결제 실패 상세:", rsp)
          return
        }
  
        console.log("✅ 결제 성공", rsp)
  
        try {
          // 🔹 결제 검증
          const verifyRes = await API.post("/api/payment/verify", { imp_uid: rsp.imp_uid })
          console.log("🔍 결제 검증 응답:", verifyRes.status, verifyRes.data)
  
          const itemsWithProductId = productInfo.map((item) => ({
            cartId: item.cartId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          }))
  
          // 🔹 결제 완료 서버 기록
          const completeRes = await API.post("/api/payment/complete", {
            imp_uid: rsp.imp_uid,
            items: itemsWithProductId,
            totalPrice,
            totalQuantity,
          })
          console.log("🔍 결제 완료 응답:", completeRes.status, completeRes.data)
  
          dispatch(clearCart())
          alert("결제가 완료되었습니다.")
          navigate("/paymentSuccess")
        } catch (error) {
          if (error.response) {
            console.error("⚠️ 결제 처리 서버 에러:", error.response.status, error.response.data)
            alert("결제 처리 중 서버 오류가 발생했습니다.")
          } else if (error.request) {
            console.error("⚠️ 결제 처리 서버 응답 없음:", error.request)
            alert("결제 처리 중 서버 응답이 없습니다.")
          } else {
            console.error("⚠️ 결제 처리 요청 에러:", error.message)
            alert("결제 처리 중 오류가 발생했습니다.")
          }
        }
      },
    )
  }

  // 동의항목 체크
  const handleCheckedBox = (e) => {
    console.log("checked", e.target.checked)
    setAgreeSelected(e.target.checked)
  }

  return (
    <div className={styles.pageWrapper}>
      <Title text="구매페이지" />
      <div className={styles.payment}>
        <div className={styles.mainContent}>
          <section className={styles.buyerSection}>
            <div className={styles.sectionHeader}>
              <h2>구매자 정보</h2>
            </div>
            <div className={styles.buyerInfo}>
              <div className={styles.infoGrid}>
                <div className={styles.infoLabel}>구매자</div>
                <div className={styles.infoValue}>{userInfo.nickname || "-"}</div>

                <div className={styles.infoLabel}>전화번호</div>
                <div className={styles.infoValue}>{userInfo.number || "-"}</div>

                <div className={styles.infoLabel}>주소</div>
                <div className={styles.infoValue}>{userInfo.address || "-"}</div>

                <div className={styles.infoLabel}>상세주소</div>
                <div className={styles.infoValue}>{userInfo.detailAddr || "-"}</div>
              </div>
            </div>
          </section>

          <section className={styles.productsSection}>
            <div className={styles.sectionHeader}>
              <h2>주문 상품</h2>
            </div>
            <div className={styles.productsList}>
              {productInfo.map((item, index) => {
                // 🔍 각 상품의 완전한 데이터 구조 확인
                console.log(`🔍 상품 ${index} 완전한 데이터:`, JSON.stringify(item, null, 2))

                // 가능한 모든 이미지 필드 확인
                const possibleImageFields = [
                  "image",
                  "imageUrl",
                  "img",
                  "productImage",
                  "photo",
                  "picture",
                  "product.image",
                  "productData.image",
                  "item.image",
                ]

                let imageUrl = "/placeholder.svg"

                // 각 가능한 필드를 확인
                possibleImageFields.forEach((field) => {
                  const fieldValue = field.includes(".")
                    ? field.split(".").reduce((obj, key) => obj?.[key], item)
                    : item[field]

                  if (fieldValue) {
                    console.log(`✅ 이미지 필드 발견: ${field} = ${fieldValue}`)
                    imageUrl = fieldValue
                  }
                })

                console.log(`🖼️ 상품 ${index} 최종 이미지 URL:`, imageUrl)

                return (
                  <div className={styles.productItem} key={index}>
                    <div className={styles.productImage}>
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt={item.name || item.title || "상품"}
                        
                      />
                    </div>
                    <div className={styles.productDetails}>
                      <div className={styles.productName}>{item.name || item.title}</div>
                      <div className={styles.productPrice}>{item.price.toLocaleString()} 원</div>
                      <div className={styles.productQuantity}>수량: {item.quantity}개</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className={styles.paymentMethodSection}>
            <div className={styles.sectionHeader}>
              <h2>결제 수단</h2>
            </div>
            <div className={styles.paymentMethods}>
              <label className={`${styles.paymentMethod} ${selectPg === "html5_inicis" ? styles.selected : ""}`}>
                <input
                  type="radio"
                  checked={selectPg === "html5_inicis"}
                  onChange={() => setSelectPg("html5_inicis")}
                />
                <span className={styles.radioCustom}></span>
                <span>이니시스 카드 결제</span>
              </label>

              <label className={`${styles.paymentMethod} ${selectPg === "kakaopay.TC0ONETIME" ? styles.selected : ""}`}>
                <input
                  type="radio"
                  checked={selectPg === "kakaopay.TC0ONETIME"}
                  onChange={() => setSelectPg("kakaopay.TC0ONETIME")}
                />
                <span className={styles.radioCustom}></span>
                <span>카카오페이</span>
              </label>

              <label className={`${styles.paymentMethod} ${selectPg === "uplus.tlgdacomxpay" ? styles.selected : ""}`}>
                <input
                  type="radio"
                  checked={selectPg === "uplus.tlgdacomxpay"}
                  onChange={() => setSelectPg("uplus.tlgdacomxpay")}
                />
                <span className={styles.radioCustom}></span>
                <span>토스페이</span>
              </label>

              <label className={`${styles.paymentMethod} ${selectPg === "kcp.AO09C" ? styles.selected : ""}`}>
                <input type="radio" checked={selectPg === "kcp.AO09C"} onChange={() => setSelectPg("kcp.AO09C")} />
                <span className={styles.radioCustom}></span>
                <span>KCP 일반결제</span>
              </label>
            </div>
          </section>
        </div>

        <div className={styles.orderSummary}>
          <div className={styles.summaryHeader}>
            <h2>최종 결제 금액</h2>
          </div>

          <div className={styles.summaryContent}>
            <div className={styles.summaryItem}>
              <span>총 상품 금액</span>
              <span>{totalPrice.toLocaleString()} 원</span>
            </div>

            <div className={styles.summaryItem}>
              <span>총 상품 수량</span>
              <span>{totalQuantity}개</span>
            </div>

            <div className={styles.summaryTotal}>
              <span>최종 결제 금액</span>
              <span>{totalPrice.toLocaleString()} 원</span>
            </div>

            <label className={styles.agreementCheckbox}>
              <input type="checkbox" onChange={handleCheckedBox} checked={agreeSelected} />
              <span className={styles.checkboxCustom}>{agreeSelected && <FontAwesomeIcon icon={faCheckCircle} />}</span>
              <span>구매조건 확인 및 결제대행 서비스 약관 동의</span>
            </label>

            <div className={styles.agreementText}>
              위 주문 내용을 확인 하였으며, 회원 본인은 개인정보 이용 및 제공 및 결제에 동의합니다.
            </div>

            <button
              onClick={handlePayment}
              className={`${styles.paymentButton} ${!agreeSelected ? styles.disabled : ""}`}
              disabled={!agreeSelected}
            >
              <FontAwesomeIcon icon={faCreditCard} />
              <span>{totalPrice.toLocaleString()}원 결제하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment