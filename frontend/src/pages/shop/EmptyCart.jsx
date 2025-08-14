import React from 'react';
import styles from '../../css/shop/EmptyCart.module.css';
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons"

const EmptyCart = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.emptyCart}>
      <div className={styles.iconContainer}>
        <FontAwesomeIcon icon={faShoppingCart} className={styles.icon} />
      </div>
      <h2 className={styles.title}>장바구니가 비어있습니다</h2>
      <p className={styles.description}>
        각 상품의 이미지를 클릭하시고 상세페이지에서
        <br />
        구매하기 또는 장바구니 담기 버튼을 눌러보세요!
      </p>
      <button className={styles.shopButton} onClick={() => navigate("/shop")}>
        <FontAwesomeIcon icon={faShoppingCart} className={styles.buttonIcon} />
        상품 둘러보기
      </button>
    </div>
  )
}

export default EmptyCart
