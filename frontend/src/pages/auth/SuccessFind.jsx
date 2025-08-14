import React, { useState, useEffect, useRef } from 'react';
import Title from '../../components/Title';
import axios from 'axios';
import styles from '../../css/auth/SuccessFind.module.css'
import { useNavigate } from 'react-router-dom';

const SuccessFind = () => {
    const navigate = useNavigate()
  
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.successFind}>
          <h1>비밀번호가 변경되었습니다</h1>
          <p>
            새로운 비밀번호로 로그인하여
            <br />
            서비스를 이용해보세요.
          </p>
          <button onClick={() => navigate("/login")} className={styles.button}>
            로그인 페이지로 돌아가기
          </button>
          <div className={styles.infoText}>로그인에 문제가 있으시면 고객센터로 문의해주세요.</div>
        </div>
      </div>
    )
  }
  
  export default SuccessFind