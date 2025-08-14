import React, { useState, useEffect, useRef } from 'react';
import styles from '../../css/auth/FirstPage.module.css'
import { useNavigate } from 'react-router-dom'

const FirstPage = () => {
  const navigate = useNavigate();

// ===== 초창기 버전의 상태 관리 방식 =====
const [showText, setShowText] = useState(false) // 히어로(첫 문장/버튼) 노출
const [upText1, setUpText1] = useState(false) // 3줄 문구 단계 1
const [upText2, setUpText2] = useState(false) // 3줄 문구 단계 2
const [upText3, setUpText3] = useState(false) // 3줄 문구 단계 3
const [showSlide, setShowSlide] = useState(false) // 하단 슬라이드 노출

// ===== 인기 콘텐츠 섹션용 상태 =====
const [slideVisible, setSlideVisible] = useState(false)
const [currentSlide, setCurrentSlide] = useState(0)

// 영화 이미지 배열
const movieImages = Array.from({ length: 15 }, (_, i) => `/image/movie${i + 1}.webp`)
const backgroundImages = Array.from({ length: 15 }, (_, i) => `/image/image${i + 1}.jpg`)

// ===== refs =====
const heroRef = useRef(null)
const upTextRef = useRef(null)
const upTextArmedRef = useRef(false)

// ===== 초기 로딩: 히어로 영역 처리 =====
useEffect(() => {
  if (window.scrollY < 30) {
    setShowText(true)
  }
}, [])

// ===== IntersectionObserver: 3줄 문구 컨테이너 진입 감지 =====
useEffect(() => {
  if (!upTextRef.current) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target === upTextRef.current && entry.isIntersecting) {
          upTextArmedRef.current = true
        }
      })
    },
    {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.1,
    },
  )

  observer.observe(upTextRef.current)
  return () => observer.disconnect()
}, [])

// ===== 스크롤 핸들러: 초창기 버전 방식 =====
useEffect(() => {
  let ticking = false

  const onScroll = () => {
    if (ticking) return
    ticking = true

    requestAnimationFrame(() => {
      const y = window.scrollY

      // 히어로(문장/버튼): 최상단에서만 노출
      setShowText(y < 30)

      // 3줄 문구: 섹션이 활성화(armed)된 이후에만 단계 연출
      if (upTextArmedRef.current) {
        if (y < 100) {
          // 아직 스크롤 시작 전
          setUpText1(false)
          setUpText2(false)
          setUpText3(false)
        } else if (y >= 100 && y < 400) {
          // 첫 번째 텍스트만
          setUpText1(true)
          setUpText2(false)
          setUpText3(false)
        } else if (y >= 400 && y < 700) {
          // 두 번째 텍스트까지
          setUpText1(true)
          setUpText2(true)
          setUpText3(false)
        } else if (y >= 700 && y < 1000) {
          // 세 번째 텍스트까지
          setUpText1(true)
          setUpText2(true)
          setUpText3(true)
        } else if (y >= 1000) {
          // 모든 텍스트 표시 유지
          setUpText1(true)
          setUpText2(true)
          setUpText3(true)
        }
      } else {
        setUpText1(false)
        setUpText2(false)
        setUpText3(false)
      }

      // 인기 콘텐츠 섹션 노출 (더 일찍 나타나도록)
      setSlideVisible(y > 1200)

      ticking = false
    })
  }

  onScroll()
  window.addEventListener("scroll", onScroll)
  return () => window.removeEventListener("scroll", onScroll)
}, [])

// ===== 자동 슬라이드 효과 =====
useEffect(() => {
  if (!slideVisible) return

  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % movieImages.length)
  }, 3000)

  return () => clearInterval(interval)
}, [slideVisible, movieImages.length])

return (
  <div>
    <div className={styles.firstPage}>
      <div>
        <div className={styles.wrapper}>
          <div className={styles.videoBg}>
            {/* 비디오 배경 */}
            <video autoPlay muted loop playsInline>
              <source src="/video/video1.mp4" type="video/mp4" />
            </video>

            {/* 히어로(문장+버튼) 래퍼 */}
            <div ref={heroRef}>
              <div className={`${styles.inVideoWord} ${showText ? styles.show : styles.hide}`}>
                Fine Original 콘텐츠는
                <br /> 오직 Fine TV+ 에서만
              </div>

              <button
                onClick={() => navigate("/login")}
                className={`${styles.button} ${showText ? styles.show : styles.hide}`}
              >
                지금 로그인하기
              </button>
            </div>

            {/* 3줄 문구 컨테이너 */}
            <div ref={upTextRef} className={styles.videoWord}>
              <p className={`${styles.upText1} ${upText1 ? styles.show : styles.hide}`}>
                매달 새롭게 추가되는 Fine Original 콘텐츠를 <br />
                언제나 광고 없이
              </p>
              <p className={`${styles.upText2} ${upText2 ? styles.show : styles.hide}`}>
                Fine 기기, 스마트 TV, 게임 콘솔 또는 <br />
                스틱 등을 통해
              </p>
              <p className={`${styles.upText3} ${upText3 ? styles.show : styles.hide}`}>
                Fine TV 앱에서 스트리밍 가능
              </p>
            </div>
          </div>

          {/* 무한 슬라이드 (기존 방식) */}
          <div className={styles.videoBottom}>
            <div className={`${styles.slideTrack} ${showSlide ? styles.show : ""}`}>
              {[...backgroundImages, ...backgroundImages].map((item, i) => (
                <img
                  key={`${item}-${i}`}
                  className={styles.image}
                  src={item || "/placeholder.svg"}
                  alt={`slide-${i}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ===== 인기 콘텐츠 섹션 (우리가 만든 부분) ===== */}
    <section className={styles.slideSection}>
      <div className={styles.slideContainer}>
        <h2 className={styles.slideTitle}>인기 콘텐츠</h2>

        <div className={`${styles.slideWrapper} ${slideVisible ? styles.visible : styles.hidden}`}>
          {/* 메인 슬라이드 */}
          <div className={styles.mainSlide}>
            <img
              src={movieImages[currentSlide] || "/placeholder.svg"}
              alt={`Movie ${currentSlide + 1}`}
              className={styles.mainSlideImage}
            />
            <div className={styles.slideInfo}>
              <h3>Featured Content {currentSlide + 1}</h3>
              <p>최고의 오리지널 콘텐츠를 만나보세요</p>
              <button className={styles.watchButton}>지금 시청하기</button>
            </div>
          </div>

          {/* 썸네일 슬라이드 */}
          <div className={styles.thumbnailSlides}>
            {movieImages.map((image, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${index === currentSlide ? styles.active : ""}`}
                onClick={() => setCurrentSlide(index)}
              >
                <img src={image || "/placeholder.svg"} alt={`Movie ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* 무한 스크롤 배너 */}
        <div className={styles.infiniteSlide}>
          <div className={styles.slideTrack2}>
            {[...movieImages, ...backgroundImages].map((image, index) => (
              <div key={index} className={styles.slideItem}>
                <img src={image || "/placeholder.svg"} alt={`Slide ${index}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* 추가 콘텐츠 섹션 */}
    <section className={styles.contentGrid}>
      <div className={styles.gridContainer}>
        <h2>더 많은 콘텐츠</h2>
        <div className={styles.grid}>
          {backgroundImages.slice(0, 8).map((image, index) => (
            <div key={index} className={styles.gridItem}>
              <img src={image || "/placeholder.svg"} alt={`Content ${index + 1}`} />
              <div className={styles.gridOverlay}>
                <h4>콘텐츠 {index + 1}</h4>
                <p>지금 시청 가능</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
)
}


export default FirstPage;
