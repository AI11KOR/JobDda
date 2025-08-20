const express = require('express');
const passport = require('passport')
const router = express.Router();
require('../passport/googleStrategy');
require('../passport/kakaoStrategy');
require('../passport/naverStrategy')
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/jwtUtils');
const { handleGoogleCallback, handleKakaoCallback, handleNaverCallback } = require('../controller/socialController');
const authJWT = require('../middleware/authJWT');


// 구글 로그인
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), handleGoogleCallback);

// 카카오 로그인
router.get('/kakao', passport.authenticate('kakao', { scope: ['profile_nickname', 'account_email'] }));
router.get('/kakao/callback', passport.authenticate('kakao', { session: false, failureRedirect: '/login' }), handleKakaoCallback);

// 네이버 로그인
router.get('/naver', passport.authenticate('naver'));
router.get('/naver/callback', passport.authenticate('naver', { session: false, failureRedirect: '/login' }), handleNaverCallback);

module.exports = router;