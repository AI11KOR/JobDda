// backend/controller/socialController.js
// SameSite 설정 → 배포 시 cross-site 허용 (none)
// secure 설정 → 배포 시 HTTPS
// 쿠키 세팅 방식 그대로 유지
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
    const accessToken = generateToken.createAccessToken(user);
    const refreshToken = await generateToken.createRefreshToken(user);

    await generateToken.saveRefreshTokenToDB(user._id, refreshToken);

    const isProd = process.env.NODE_ENV === 'production';

    // ✅ 쿠키 수정: SameSite=None, secure=true if prod (cross-site 허용)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,           // HTTPS일 때만 true
      sameSite: isProd ? 'none' : 'lax', // 배포 시 cross-site 허용
      path: '/',
      maxAge: 1000 * 60 * 15,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.redirect(domain);
  } catch (error) {
    console.error('소셜 로그인 처리 실패:', error);
    return res.status(500).json({ message: '소셜 로그인 처리 에러' });
  }
}

exports.handleGoogleCallback = async (req, res) => {
  try {
    await socialLoginHandler(req, res, req.user);
    console.log('✅ [Google] 로그인 성공:', req.user.email);
  } catch (error) {
    console.error('Google 로그인 실패:', error);
  }
};

exports.handleKakaoCallback = async (req, res) => {
  try {
    await socialLoginHandler(req, res, req.user);
    console.log('✅ [Kakao] 로그인 성공:', req.user.email);
  } catch (error) {
    console.error('Kakao 로그인 실패:', error);
  }
};

exports.handleNaverCallback = async (req, res) => {
  try {
    await socialLoginHandler(req, res, req.user);
    console.log('✅ [Naver] 로그인 성공:', req.user.email);
  } catch (error) {
    console.error('Naver 로그인 실패:', error);
  }
};
