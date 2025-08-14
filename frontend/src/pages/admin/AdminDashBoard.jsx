import React, { useState, useEffect, useRef } from 'react';
import styles from '../../css/admin/AdminDashBoard.module.css'
import { useNavigate } from 'react-router-dom';
import Title from '../../components/Title';

const cardData = [
  {
    id: 1,
    title: "게시글",
    content: "회원들의 게시글을 확인 수정 및 삭제 하는 곳",
    color: "linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)",
    border: "#81d4fa",
    path: "/adminPost",
  },
  {
    id: 2,
    title: "상품목록",
    content: "상품의 품목을 확인 수정 및 삭제하는 카드",
    color: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
    border: "#ffb74d",
    path: "/adminProduct",
  },
]

const AdminDashBoard = () => {
  const [activeCard, setActiveCard] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    setActiveCard(1)
  }, [])

  // 클릭한 카드를 앞으로 오게 정렬
  const sortedCards = [...cardData].sort((a, b) => (a.id === activeCard ? -1 : b.id === activeCard ? 1 : 0))

  return (
    <div className={styles.pageWrapper}>
      <Title text="관리자 대시보드" />

      <div className={styles.adminTitle}>
        <h1>Admin Dashboard</h1>
        <p>시스템 관리 및 모니터링</p>
      </div>

      <div className={styles.cardContainer}>
        {sortedCards.map((card, index) => {
          const isActive = activeCard === card.id

          return (
            <div
              key={card.id}
              className={`${styles.card} ${isActive ? styles.active : ""}`}
              style={{
                zIndex: cardData.length - index,
                transform: isActive
                  ? "translate(-50%, -50%) translateY(-10px) scale(1.05) rotateY(0deg)"
                  : `translate(-50%, -50%) translateX(${index * 30}px) rotateY(-5deg)`,
                background: card.color,
                borderColor: card.border,
              }}
              onClick={() => setActiveCard(card.id)}
            >
              <div className={styles.cardContent}>
                <h3>{card.title}</h3>
                <p>{card.content}</p>
                {isActive && (
                  <div className={styles.cardDetail}>
                    <button
                      className={styles.goBtn}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(card.path)
                      }}
                    >
                      {card.title} 관리하러 가기
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminDashBoard
