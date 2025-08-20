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
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = await connectDB();
        const userCollection = db.collection('user');

        const email = profile._json?.kakao_account?.email || `kakao_${profile.id}@noemail.com`;
        const nickname = profile._json?.kakao_account?.profile?.nickname || 'KakaoUser';

        let user = await userCollection.findOne({ providerId: profile.id, provider: 'kakao' });

        if (!user) {
          const newUser = { providerId: profile.id, email, nickname, provider: 'kakao', createdAt: new Date() };
          const result = await userCollection.insertOne(newUser);
          user = { ...newUser, _id: result.insertedId };
        }

        // JWT 생성
        const access = createAccessToken(user);
        const refresh = await createRefreshToken(user);

        // DB에 refreshToken 저장
        await saveRefreshTokenToDB(user._id, refresh);

        done(null, { ...user, accessToken: access, refreshToken: refresh });
      } catch (err) {
        console.error('KakaoStrategy Error:', err);
        done(err, null);
      }
    }
  )
);
