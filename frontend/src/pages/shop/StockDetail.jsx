"use client"

import { useState, useEffect } from "react"
import API from "../../api/axiosApi"
import Title from "../../components/Title"
import { useNavigate, useParams } from "react-router-dom"
import styles from "../../css/shop/StockDetail.module.css"
// import ReactImageMagnify from "react-image-magnify"
// <CHANGE> 기존 react-image-magnify import 제거하고 새로운 패키지로 교체
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { useDispatch } from "react-redux"
import { addToCart } from "../../slices/cartSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faChevronRight, faShoppingCart, faCreditCard } from "@fortawesome/free-solid-svg-icons"

const StockDetail = () => {
  const navigate = useNavigate()
  const [stock, setStock] = useState([])
  const { id } = useParams()
  const [count, setCount] = useState(1)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState([])
  const dispatch = useDispatch()

  const pageSize = 7

  useEffect(() => {
    setCurrentIndex(0)
  }, [relatedProducts])

  const visibleProducts = relatedProducts.slice(currentIndex, currentIndex + pageSize)

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1)
  }

  const handleNext = () => {
    if (currentIndex + pageSize < relatedProducts.length) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handleIncrease = () => {
    setCount((prev) => prev + 1)
  }

  const handleDecrease = () => {
    setCount((prev) => (prev > 1 ? prev - 1 : 1))
  }

  useEffect(() => {
    const fetchDetailProduct = async () => {
      try {
        console.log("🟨 받아온 id:", id)
        const response = await API.get(`/api/stockDetail/${id}`)
        console.log("✅ 상품 데이터:", response.data.product)
        setStock(response.data.product)
      } catch (error) {
        console.log(error)
      }
    }
    fetchDetailProduct()
  }, [id])

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        if (!stock || !stock.category || !stock._id) return

        const res = await API.get(`/api/relatedProducts/${stock.category}?excludeId=${stock._id}`)
        console.log("📌 Related Products:", res.data.products)
        setRelatedProducts(res.data.products)
      } catch (error) {
        console.error("❌ 관련 상품 가져오기 실패", error)
      }
    }

    fetchRelatedProducts()
  }, [stock])

  const handleSendProduct = async () => {
    try {
      const payload = {
        productId: stock._id,
        name: stock.name,
        image: stock.image,
        price: stock.price,
        quantity: count,
      }
      await API.post(`/api/cart`, payload)
      dispatch(addToCart(payload))
      alert("장바구니에 담겼습니다.")
    } catch (error) {
      console.log(error)
      alert("장바구니 담기에 실패했습니다.")
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <Title text="상품상세" />
      <div className={styles.stockDetail}>
        <div className={styles.breadcrumbs}>
          <span onClick={() => navigate("/")}>홈</span>
          <span className={styles.separator}>/</span>
          <span onClick={() => navigate("/shop")}>상품</span>
          <span className={styles.separator}>/</span>
          <span className={styles.current}>{stock.name || "상품 상세"}</span>
        </div>

        <div className={styles.stock}>
          <div className={styles.imageSection}>
            {/* {stock?.image && (
              <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: "상품 이미지",
                    isFluidWidth: false,
                    src: stock.image,
                    width: 500,
                    height: 500,
                  },
                  largeImage: {
                    src: `${stock.image}`,
                    width: 800,
                    height: 800,
                  },
                  enlargedImageContainerDimensions: {
                    width: "120%",
                    height: "120%",
                  },
                  lensStyle: {
                    backgroundColor: "rgba(0,0,0,.3)",
                    backdropFilter: "brightness(130%)",
                    width: "100px",
                    height: "100px",
                  },
                  enlargedImagePosition: "beside",
                  style: {
                    cursor: "default",
                  },
                  enlargedImageContainerStyle: {
                    marginLeft: "none",
                  },
                }}
              />
            )} */}
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={3}
              wheel={{ step: 0.1 }}
              pinch={{ step: 5 }}
              doubleClick={{ step: 0.7, mode: "toggle" }}
            >
              <TransformComponent
                wrapperStyle={{
                  width: "500px",
                  height: "500px",
                  cursor: "zoom-in"
                }}
                contentStyle={{
                  width: "100%",
                  height: "100%"
                }}
              >
                <img
                  src={stock.image || "/placeholder.svg"}
                  alt="상품 이미지"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </TransformComponent>
            </TransformWrapper>
          </div>

          <div className={styles.stockInfo}>
            <div className={styles.stockWord}>
              <h1 className={styles.productName}>{stock.name}</h1>
              <p className={styles.description}>{stock.description}</p>
              <div className={styles.price}>{stock.price} 원</div>
            </div>

            <div className={styles.stockOptionArea}>
              <div className={styles.countAreaSection}>
                <div className={styles.quantityLabel}>수량</div>
                <div className={styles.countArea}>
                  <button onClick={handleDecrease} className={styles.countBtn} disabled={count === 1}>
                    -
                  </button>
                  <div className={styles.countDisplay}>{count}</div>
                  <button onClick={handleIncrease} className={styles.countBtn}>
                    +
                  </button>
                </div>
              </div>

              <div className={styles.totalPrice}>
                <span>총 금액</span>
                <span>{(Number.parseInt(stock.price) * count).toLocaleString()} 원</span>
              </div>

              <div className={styles.actionButtons}>
                <button onClick={handleSendProduct} className={styles.cartBtn}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                  장바구니 담기
                </button>
                <button className={styles.buyBtn}>
                  <FontAwesomeIcon icon={faCreditCard} />
                  바로구매
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.relatedProductsSection}>
          <h2 className={styles.sectionTitle}>함께 비교하면 좋은 상품</h2>
          <div className={styles.another}>
            <button onClick={handlePrev} disabled={currentIndex === 0} className={styles.navButton}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <div className={styles.productsContainer}>
              {visibleProducts.map((item) => (
                <div className={styles.anotherItems} key={item._id}>
                  <div className={styles.productImageWrapper}>
                    <img
                      className={styles.anotherStock}
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      onClick={() => navigate(`/stockDetail/${item._id}`)}
                    />
                  </div>
                  <div className={styles.anotherStockInfo}>
                    <div className={styles.relatedProductName}>{item.name}</div>
                    <div className={styles.relatedProductDesc}>{item.description}</div>
                    <div className={styles.relatedProductPrice}>{item.price} 원</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              disabled={currentIndex + pageSize >= relatedProducts.length}
              onClick={handleNext}
              className={styles.navButton}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>

          {relatedProducts.length <= pageSize && <style>{`.${styles.navButton} { display: none; }`}</style>}
        </div>
      </div>
    </div>
  )
}

export default StockDetail
