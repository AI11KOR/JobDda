import React, { useState, useEffect, useRef } from 'react';
import styles from '../../css/admin/AdminProductPage.module.css';
import { useNavigate } from 'react-router-dom';
import Title from '../../components/Title';
import API from '../../api/axiosApi';

const AdminProductPage = () => {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState([])
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState("")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [imageFile, setImageFile] = useState(null)
  
    // 검색 및 상태관리
    const [selectedCategory, setSelectedCategory] = useState("전체")
    const [type, setType] = useState("name")
    const [keyword, setKeyword] = useState("")
  
    // 저장된 데이터 가져오기
    const fetchProductData = async (page) => {
      try {
        const response = await API.get("/api/adminProduct", {
          params: {
            page,
            category: selectedCategory === "전체" ? "" : selectedCategory,
            type,
            keyword,
          },
        })
        setProducts(response.data.products)
        setTotalPage(response.data.totalPage)
      } catch (error) {
        console.log(error)
        alert("데이터 가져오기 실패:", error)
      }
    }
  
    useEffect(() => {
      fetchProductData(currentPage)
    }, [currentPage])
  
    // 해당 정보 저장하기
    const handleProductInfoSave = async () => {
      if (!category.trim() || !name.trim() || !price.trim() || !imageFile) {
        alert("모든 항목을 입력해 주세요")
        return
      }
      const confirmSave = window.confirm(`저장 정보를 다시 확인해주세요 확인을 누르면 저장됩니다.`)
      if (!confirmSave) return
  
      try {
        const formData = new FormData()
        formData.append("category", category)
        formData.append("name", name)
        formData.append("description", description)
        formData.append("price", price)
        formData.append("image", imageFile)
  
        await API.post("/api/adminProduct/save", formData)
        alert("저장 완료")
  
        // 폼 초기화
        setCategory("")
        setName("")
        setDescription("")
        setPrice("")
        setImageFile(null)
  
        // 데이터 새로고침
        fetchProductData(currentPage)
      } catch (error) {
        console.log(error)
        alert("상품 데이터 저장에 실패하였습니다.")
      }
    }
  
    const renderPagination = () => {
      const pages = []
      const pageGroup = Math.ceil(currentPage / 5)
      const startPage = (pageGroup - 1) * 5 + 1
      let endPage = startPage + 4
      if (endPage > totalPage) endPage = totalPage
  
      pages.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`${styles.paginationSideBtn} ${currentPage === 1 ? styles.disabled : ""}`}
          disabled={currentPage === 1}
        >
          이전
        </button>,
      )
  
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`${styles.paginationMiddleBtn} ${currentPage === i ? styles.active : ""}`}
          >
            {i}
          </button>,
        )
      }
  
      pages.push(
        <button
          key="next"
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`${styles.paginationSideBtn} ${currentPage === totalPage ? styles.disabled : ""}`}
          disabled={currentPage === totalPage}
        >
          다음
        </button>,
      )
      return pages
    }
  
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.adminProduct}>
          <Title text="상품 관리페이지" />
  
          <div className={styles.productSection}>
            <section className={styles.leftSection}>
              <h2>상품 전체</h2>
  
              <div className={styles.topSection}>
                <div>
                  <select
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value)
                      setCurrentPage(1)
                    }}
                    className={styles.productSelect}
                  >
                    <option value="name">상품명</option>
                    <option value="description">설명</option>
                    <option value="price">가격</option>
                  </select>
                </div>
  
                <div className={styles.searchArea}>
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setCurrentPage(1)
                        fetchProductData(1)
                      }
                    }}
                    className={styles.searchInput}
                    placeholder="검색입력"
                  />
                  <button
                    onClick={() => {
                      setCurrentPage(1)
                      fetchProductData(1)
                    }}
                    className={styles.searchButton}
                  >
                    검색
                  </button>
                </div>
              </div>
  
              <div className={styles.productInfoTitle}>
                <div>
                  <strong>Category</strong>
                </div>
                <div>
                  <strong>상품명</strong>
                </div>
                <div>
                  <strong>상품가격</strong>
                </div>
              </div>
  
              <div className={styles.productInfoSection}>
                {products.map((item, i) => (
                  <div key={item._id} className={styles.productInfo}>
                    <div className={styles.productCategory}>{item.category}</div>
                    <div className={styles.productName}>{item.name}</div>
                    <div className={styles.productPrice}>{item.price}원</div>
                  </div>
                ))}
              </div>
  
              <div className={styles.paginationBtn}>{renderPagination()}</div>
            </section>
  
            <section className={styles.rightSection}>
              <h2>상품 추가</h2>
  
              <div className={styles.productAddSection}>
                <div className={styles.productAddInfo}>
                  <div>카테고리 설정</div>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.addSelect}>
                    <option value="">카테고리</option>
                    <option value="car">car</option>
                    <option value="cloth">cloth</option>
                    <option value="pants">pants</option>
                    <option value="perfume">perfume</option>
                    <option value="shoes">shoes</option>
                  </select>
                </div>
  
                <div className={styles.productAddInfo}>
                  <div>상품명</div>
                  <input value={name} onChange={(e) => setName(e.target.value)} className={styles.addInp} />
                </div>
  
                <div className={styles.productAddInfo}>
                  <div>상품설명</div>
                  <input value={description} onChange={(e) => setDescription(e.target.value)} className={styles.addInp} />
                </div>
  
                <div className={styles.productAddInfo}>
                  <div>가격</div>
                  <input value={price} onChange={(e) => setPrice(e.target.value)} className={styles.addInp} />
                </div>
  
                <div className={styles.productAddInfo}>
                  <div>이미지</div>
                  <input onChange={(e) => setImageFile(e.target.files[0])} type="file" multiple />
                </div>
              </div>
  
              <div className={styles.saveButtonContainer}>
                <button onClick={handleProductInfoSave} className={styles.saveButton}>
                  저장하기
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
  
  export default AdminProductPage
  