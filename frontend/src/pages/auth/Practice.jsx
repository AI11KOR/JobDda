import React, { useState } from 'react';
import './ProfileCards.css';

const cardData = [
  {
    id: 1,
    title: '구매내역',
    content: '최근 구매하신 상품들을 확인할 수 있습니다.',
    color: '#fdf6e3',
    border: '#ccc',
  },
  {
    id: 2,
    title: '글쓴 내역',
    content: '작성한 게시글 목록을 확인할 수 있습니다.',
    color: '#eef5ff',
    border: '#ccc',
  },
];

const Practice = () => {
  const [activeCard, setActiveCard] = useState(1);

  // 클릭한 카드를 앞으로 오게 정렬
  // cardData 복사해서 새로운 배열 만듦, activeCard가 맨 앞으로 오도록 정렬
  // click한 카드마 map()에서 index === 0이 되기 때문문
  const sortedCards = [...cardData].sort((a, b) =>
    a.id === activeCard ? -1 : b.id === activeCard ? 1 : 0
  );

  return (
    <div className="card-container">
      {sortedCards.map((card, index) => {
        const isActive = activeCard === card.id;

        return (
          <div
            key={card.id}
            className={`card ${isActive ? 'active' : ''}`} // 클래스에 active 붙으면 css 강조조
            style={{
              zIndex: cardData.length - index, // zIndex 위에 올수록 값이 높아야 함
              transform: isActive
              // 클릭된 카드면 아랫줄, 클릭 안된 카드는 두번쨰 아랫줄로 처리됨
                ? 'translateX(0) translateY(-10px) scale(1.05) rotateY(0deg)'
                : `translateX(${index * 30}px) rotateY(-5deg)`,
              background: card.color,
              borderColor: card.border,
            }}
            onClick={() => setActiveCard(card.id)}
          >
            <div className="card-content">
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </div>
          </div>
        );
      })}

      <div className="tab-bar">
        {cardData.map((card) => (
          <button
            key={card.id}
            className={`tab-btn ${activeCard === card.id ? 'selected' : ''}`}
            onClick={() => setActiveCard(card.id)}
          >
            {card.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Practice;
