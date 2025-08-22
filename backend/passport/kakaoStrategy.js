// kakaoStrategy.js
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const connectDB = require('../config/database');
const { createAccessToken, createRefreshToken, saveRefreshTokenToDB } = require('../utils/jwtUtils');
require('dotenv').config();

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CLIENT_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = await connectDB();
        const userCollection = db.collection('user');

        const provider = 'kakao';
        const providerId = profile.id;
        const email = profile._json?.kakao_account?.email || `kakao_${providerId}@noemail.com`;
        const nickname = profile._json?.kakao_account?.profile?.nickname || 'KakaoUser';

        let user = await userCollection.findOne({ providerId, provider });
        if (!user) user = await userCollection.findOne({ email, provider });

        if (!user) {
          const newUser = { providerId, email, nickname, provider, createdAt: new Date() };
          const result = await userCollection.insertOne(newUser);
          user = { ...newUser, _id: result.insertedId };
        }

        return done(null, user); // [CHANGED] 전략에서 토큰 생성/저장 제거
      } catch (err) {
        console.error('KakaoStrategy Error:', err);
        return done(err, null);
      }
    }
  )
);