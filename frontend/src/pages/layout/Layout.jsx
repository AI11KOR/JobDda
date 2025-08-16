// src/pages/layout/Layout.jsx
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, logout } from '../../slices/authSlice';
import API from '../../api/axiosApi';

const Layout = () => {
  // const dispatch = useDispatch();
  // const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await API.get('/api/user/info', { withCredentials: true });

  //       if (response.data && response.data.email) {
  //         dispatch(setUser(response.data)); // 인증 성공 시 사용자 정보 저장
  //       } else {
  //         dispatch(logout());
  //       }
  //     } catch (error) {
  //       console.log('🔴 accessToken 만료 또는 유효하지 않음');

  //       try {
  //         const retry = await API.post('/api/token/reissue', {}, { withCredentials: true });

  //         if (retry.status === 200) {
  //           console.log('accessToken 재발급 성공');
  //           const response = await API.get('/api/user/info', { withCredentials: true });
  //           dispatch(setUser(response.data));
  //         } else {
  //           dispatch(logout());
  //         }
  //       } catch (err) {
  //         console.log('refreshToken도 유효하지 않음', err);
  //         dispatch(logout());
  //       }
  //     }
  //   };

  //   fetchUser();
  // }, [dispatch]);

  // if (!isAuthChecked) {
  //   return <div>로딩중...</div>;
  // }

  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
