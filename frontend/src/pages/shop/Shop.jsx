import React, { useState, useEffect, useRef } from 'react';
import Title from '../../components/Title';
import axios from 'axios';
import styles from '../../css/shop/Shop.module.css';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axiosApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping } from '@fortawesome/free-solid-svg-icons';

const Shop = () => {
    
    const navigate = useNavigate()
  const images1 = [1, 2, 3, 4, 5, 6, 7, 8]
  const [leftIndex, setLeftIndex] = useState(0)
  const images2 = [9, 10, 11, 12, 13, 14, 15]
  const [rightIndex, setRightIndex] = useState(0)

  // 카테고리 상태관리
  const [category, setCategory] = useState("")
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState([])

  // 페이지네이션 관련
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  const fetchShop = async () => {
    try {
      const response = await API.get(`/api/shop?page=${currentPage}&category=${category}&search=${search}`)
      setProducts(response.data.product)
      setTotalPage(response.data.totalPage)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchShop()
  }, [currentPage, category])

  useEffect(() => {
    const interval = setInterval(() => {
      setLeftIndex((prev) => (prev + 1) % images1.length)
      setRightIndex((prev) => (prev + 1) % images2.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [images1.length, images2.length])

  // 검색 엔터 이벤트
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1)
      fetchShop()
    }
  }

  const renderPagination = () => {
    const pages = []
    const pageGroup = Math.ceil(currentPage / 5)
    const startPage = (pageGroup - 1) * 5 + 1
    let endPage = startPage + 4
    if (endPage > totalPage) endPage = totalPage

    // 항상 이전 버튼
    pages.push(
      <button
        key="prev"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          margin: "0 5px",
          width: "40px",
          fontSize: "12px",
          color: "black",
          backgroundColor: "#eee",
          border: "1px solid #eee",
          cursor: currentPage === 1 ? "default" : "pointer",
          opacity: currentPage === 1 ? 0.5 : 1,
        }}
      >
        이전
      </button>,
    )

    // 페이지 번호
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          style={{
            margin: "0 5px",
            padding: "6px 12px",
            width: "40px",
            fontSize: "14px",
            backgroundColor: currentPage === i ? "#eee" : "#fff",
            color: currentPage === i ? "#fff" : "#000",
            border: "1px solid #ccc",
            fontWeight: currentPage === i ? "bold" : "normal",
            cursor: "pointer",
          }}
        >
          {i}
        </button>,
      )
    }

    // 항상 다음 버튼
    pages.push(
      <button
        key="next"
        onClick={() => {
          if (currentPage < totalPage) {
            setCurrentPage(currentPage + 1)
          }
        }}
        style={{
          margin: "0 5px",
          width: "40px",
          fontSize: "12px",
          backgroundColor: "#eee",
          border: "1px solid #ccc",
          color: "black",
          cursor: currentPage === totalPage ? "default" : "pointer",
          opacity: currentPage === totalPage ? 0.5 : 1,
        }}
      >
        다음
      </button>,
    )
    return pages
  }

  return (
    <div className={styles.pageWrapper}>
      <Title text="상품페이지" />
      <div className={styles.shop}>
        <section className={styles.section1}>
          <img
            className={styles.leftImg}
            src={`/image/movie${images1[leftIndex]}.webp`}
            alt={`slide-${images1[leftIndex]}`}
          />
        </section>
        <section className={styles.mainSection}>
          <div className={styles.searchBox}>
            <select
              className={styles.select}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="">전체</option>
              <option value="car">자동차</option>
              <option value="perfume">향수</option>
              <option value="pants">바지</option>
              <option value="shoes">신발</option>
              <option value="cloth">옷</option>
            </select>
            <div className={styles.inpWrapper}>
              <input
                value={search}
                onKeyDown={handleEnter}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.inpSearch}
                placeholder="찾고 싶은 상품을 검색해 보세요"
              />
              <img
                className={styles.searchImg}
                src="/common/search.png"
                alt="search"
                onClick={() => {
                  setCurrentPage(1)
                  fetchShop()
                }}
              />
            </div>
            <div className={styles.fontSection}>
              <div onClick={() => navigate("/cart")} className={styles.fontImgSection}>
                <FontAwesomeIcon className={styles.fontImg} icon={faCartShopping} />
                <div>장바구니</div>
              </div>
            </div>
          </div>
          <div className={styles.main}>
            {products.map((item, i) => {
              console.log("✅ item 확인:", item)
              return (
                <div className={styles.stockSection} key={item.id}>
                  <img
                    onClick={() => {
                      console.log("👉 이동할 경로:", `/stockDetail/${item._id}`)
                      navigate(`/stockDetail/${item._id}`)
                    }}
                    className={styles.stockImg}
                    src={item.image || "/placeholder.svg"}
                    alt=""
                  />
                  <div>
                    <strong>{item.name}</strong>
                  </div>
                  <div>{item.description}</div>
                  <div>{item.price}</div>
                  <div>별점 들어갈 자리</div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: "50px" }}>{renderPagination()}</div>
        </section>
        <section className={styles.section2}>
          <img
            className={styles.rightImg}
            src={`/image/movie${images2[rightIndex]}.webp`}
            alt={`slide-${images2[rightIndex]}`}
          />
        </section>
      </div>
    </div>
  )
}


export default Shop;