// src/pages/layout/Header.jsx
import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import logo from '../../logo.svg';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../slices/authSlice';
import API from '../../api/axiosApi';
import { setUser } from '../../slices/authSlice';


const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false); // ✅ 모바일 메뉴 상태

  // 메뉴 클릭 시 닫히도록 공통 핸들러
  const go = (path) => {
    navigate(path);
    setOpen(false);
  };

  const { user, isAdmin, isLoggedIn } = useSelector((state) => state.auth);

  // 로그인 상태 확인용(소셜로그인 관련 및 로그인 전체 관련)
  // 헤더는 전역에서 관리를 하고 있기 때문에 유저의 정보가 필요하여 여기다가 상태 확인이 필요
  // 로그인 여부와 무관하게 한 번만 호출돼서 로그인 상태를 유지하거나, 비로그인 상태를 유지하는 데 사용됨

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/api/me');
        dispatch(setUser({ ...res.data.user, isLoggedIn: true }));
      } catch (error) {
        console.log('🔴 accessToken 만료 또는 유효하지 않음');
        try {
          await API.post('/api/token/reissue');
          const res = await API.get('/api/me');
          dispatch(setUser({ ...res.data.user, isLoggedIn: true }));
        } catch {
          dispatch(setUser({ user: null, isLoggedIn: false }));
        }
      }
    };
    fetchUser();
  }, [dispatch]);

  


  // 비로그인 유저 장바구니 사용 불가 로그인 페이지로 전환
  const handleCartClick = () => {
    if(!user) {
      alert('로그인이 필요한 페이지입니다.');
      navigate('/login');
    } else {
      navigate('/cart')
    }
  }

  // 비로그인 유저 마이페이지 사용 불가 로그인 페이지로 전환
  const handleMyPageClick = () => {
    if(!user) {
      alert('로그인이 필요한 페이지입니다.');
      navigate('/login');
    } else {
      navigate('/myPage')
    }
  }

  const handleLogout = async () => {
    if (!window.confirm('정말 로그아웃 하시겠습니까?')) return;

    try {
      await API.post('/api/logout');
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.log('로그아웃 실패:', error);
    }
  };

  //   try {
  //     await API.post('/api/logout', {}, { withCredentials: true });
  //     dispatch(logout());
  //     navigate('/login');
  //   } catch (error) {
  //     console.log('로그아웃 실패:', error);
  //   }
  // };

  return (
    <div className={styles.header}>
      <section className={styles.leftSide}>
        <div className={styles.leftSide1} onClick={() => go('/')} style={{cursor:'pointer'}}>
          <img className={styles.img} src={logo || "/placeholder.svg"} alt="logoImg" />
          <h1 className={styles.logo}>잡다</h1>
        </div>
        <div className={styles.leftSide2}>
          <div onClick={() => navigate("/list")} className={styles.leftBtn}>
            게시판
          </div>
          <div onClick={() => navigate("/shop")} className={styles.leftBtn}>
            상품몰
          </div>
          <div onClick={handleCartClick} className={styles.leftBtn}>
            장바구니
          </div>
        </div>
      </section>
      <section className={styles.rightSide}>
        {isLoggedIn ? (
          <>
            <span className={isAdmin ? styles.adminNickname : styles.nickname}>
              {isAdmin ? "관리자님 환영합니다." : `${user.nickname}님 환영합니다`}
            </span>
            <div onClick={handleMyPageClick} className={styles.rightBtn}>
              마이페이지
            </div>
            <div onClick={handleLogout} className={styles.rightBtn}>
              로그아웃
            </div>
          </>
        ) : (
          <>
            <div onClick={() => navigate("/login")} className={styles.rightBtn}>
              로그인
            </div>
            <div onClick={() => navigate("/condition")} className={styles.rightBtn}>
              회원가입
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Header;
