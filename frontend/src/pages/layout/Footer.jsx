

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';
import logo from '../../logo.svg'

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.topContainer}>
                <p>
                <strong>개인정보처리방침</strong>
                </p>
                <div className={styles.divider}>|</div>
                <p>공지사항</p>
                <div className={styles.divider}>|</div>
                <p>이용약관</p>
                <div className={styles.divider}>|</div>
                <p>제휴문의</p>
                <div className={styles.divider}>|</div>
                <p>오시는길</p>
                <div className={styles.divider}>|</div>
                <p>고객센터</p>
            </div>
            <div className={styles.bottomContainer}>
                <div className={styles.leftContainer}>
                <div className={styles.section}>
                    <h3>서비스</h3>
                    <div>게시판</div>
                    <div>상품몰</div>
                    <div>고객지원</div>
                </div>
                <div className={styles.section}>
                    <h3>회사</h3>
                    <div>회사소개</div>
                    <div>채용정보</div>
                    <div>투자정보</div>
                </div>
                <div className={styles.section}>
                    <h3>지원</h3>
                    <div>도움말</div>
                    <div>문의하기</div>
                    <div>신고하기</div>
                </div>
                </div>
                <div className={styles.rightContainer}>
                <div className={styles.logoSection}>
                    <img src={logo || "/placeholder.svg"} alt="logo" className={styles.footerLogo} />
                    <div className={styles.copyright}>
                    © 2025 CopyRight <span className={styles.brandName}>잡다</span> All rights reserved.
                    </div>
                </div>
                <div className={styles.companyInfo}>
                    <p>대표이사: 김우현</p>
                    <p>부산광역시 사하구 다대로 301번지</p>
                    <p>사업자 등록번호 : 120-88-100321</p>
                    <p>통신판매업신고 : 2025-부산광역시-0523</p>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;