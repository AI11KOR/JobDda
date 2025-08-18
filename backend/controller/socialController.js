// backend/controller/socialController.js

const generateToken = require('../utils/jwtUtils'); // 토큰 관련 함수
require('dotenv').config();

/**
 * 공통 소셜 로그인 처리 함수
 * @param {object} req - express req 객체 (req.user 필수)
 * @param {object} res - express res 객체
 * @param {object} user - 소셜 로그인 후 사용자 정보
 * @param {string} domain - 로그인 후 리다이렉트할 도메인
 */
async function socialLoginHandler(req, res, user, domain = process.env.CLIENT_URL || 'http://localhost:3000') {
  try {
    // 1️⃣ Access & Refresh 토큰 생성
    const accessToken = generateToken.createAccessToken(user);
    const refreshToken = await generateToken.createRefreshToken(user);

    // 2️⃣ Refresh 토큰 DB 저장
    await generateToken.saveRefreshTokenToDB(user._id, refreshToken);

    // 3️⃣ 쿠키 세팅
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,           // HTTPS일 때만 true
      sameSite: 'lax',          // CSRF 방어
      path: '/',
      maxAge: 1000 * 60 * 15,   // 15분
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    // 4️⃣ 로그인 성공 후 리다이렉트
    return res.redirect(domain);
  } catch (error) {
    console.error('소셜 로그인 처리 실패:', error);
    return res.status(500).json({ message: '소셜 로그인 처리 에러' });
  }
}

// --------------------- 소셜별 콜백 ---------------------

// Google
exports.handleGoogleCallback = async (req, res) => {
  try {
    await socialLoginHandler(req, res, req.user);
    console.log('✅ [Google] 로그인 성공:', req.user.email);
  } catch (error) {
    console.error('Google 로그인 실패:', error);
  }
};

// Kakao
exports.handleKakaoCallback = async (req, res) => {
  try {
    await socialLoginHandler(req, res, req.user);
    console.log('✅ [Kakao] 로그인 성공:', req.user.email);
  } catch (error) {
    console.error('Kakao 로그인 실패:', error);
  }
};

// Naver
exports.handleNaverCallback = async (req, res) => {
  try {
    await socialLoginHandler(req, res, req.user);
    console.log('✅ [Naver] 로그인 성공:', req.user.email);
  } catch (error) {
    console.error('Naver 로그인 실패:', error);
  }
};
