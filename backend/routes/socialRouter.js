const express = require('express');
const passport = require('passport')
const router = express.Router();
require('../passport/googleStrategy');
require('../passport/kakaoStrategy');
require('../passport/naverStrategy')
const jwt = require('jsonwebtoken');
// const { generateToken } = require('../utils/jwtUtils');
const { handleGoogleCallback, handleKakaoCallback, handleNaverCallback } = require('../controller/socialController');
// const authJWT = require('../middleware/authJWT');


// 구글 로그인
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 추가 미들웨어 authenticate 다음에 req.user 상태를 확인 및 로그
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }),
(req, res, next) => {
    console.log('[ROUTE] google/callback req.user:', {
      _id: req.user?._id,
      email: req.user?.email,
      provider: req.user?.provider,
    });
    if (!req.user) return res.status(401).json({ message: 'Google 인증 실패(사용자 없음)' }); // ✅ 가드
    next();
  },
  handleGoogleCallback
);

// 카카오 로그인
router.get('/kakao', passport.authenticate('kakao', { scope: ['profile_nickname', 'account_email'] }));
// router.get('/kakao/callback', passport.authenticate('kakao', { session: false, failureRedirect: '/login' }), handleKakaoCallback);
router.get(
    '/kakao/callback',
    passport.authenticate('kakao', { session: false, failureRedirect: '/login' }),
    (req, res, next) => {
      // console.log('[ROUTE] kakao/callback req.user:', { _id: req.user?._id, email: req.user?.email, provider: req.user?.provider });
      if (!req.user) return res.status(401).json({ message: 'Kakao 인증 실패(사용자 없음)' });
      next();
    },
    handleKakaoCallback
  );

// 네이버 로그인
router.get('/naver', passport.authenticate('naver'));
// router.get('/naver/callback', passport.authenticate('naver', { session: false, failureRedirect: '/login' }), handleNaverCallback);
router.get(
    '/naver/callback',
    passport.authenticate('naver', { session: false, failureRedirect: '/login' }),
    (req, res, next) => {
      // console.log('[ROUTE] naver/callback req.user:', { _id: req.user?._id, email: req.user?.email, provider: req.user?.provider });
      if (!req.user) return res.status(401).json({ message: 'Naver 인증 실패(사용자 없음)' });
      next();
    },
    handleNaverCallback
  );
  

module.exports = router;