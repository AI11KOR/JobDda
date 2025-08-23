// backend/passport/googleStrategy.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const connectDB = require('../config/database');
const jwt = require('jsonwebtoken');
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CLIENT_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = await connectDB();
        const userCollection = db.collection('user');

        const email = profile.emails?.[0]?.value;
        const nickname = profile.displayName || 'GoogleUser';
        // 추가본 이메일 닉네임 안전 추출
        const provider = 'google';
        const providerId = profile.id;

        if (!email) return done(new Error('Google 계정에서 이메일을 가져올 수 없음'));

        // 1순위: providerId + provider로 찾기 (소셜 계정 고유키)
        let user = await userCollection.findOne({ providerId, provider });

        // 2순위: 같은 이메일 + 같은 provider 조합이 있는지 (선택)
        if (!user) user = await userCollection.findOne({ email, provider });

        if (!user) {
          const newUser = { providerId, email, nickname, provider, createdAt: new Date() };
          const result = await userCollection.insertOne(newUser);
          user = { ...newUser, _id: result.insertedId }; // ✅ ops 사용 금지
        }

        // ✅ 전략에서는 "유저만" 넘긴다 (토큰은 컨트롤러에서)
        return done(null, user);
      } catch (err) {
        console.error('GoogleStrategy Error:', err);
        return done(err, null);
      }
    }
  )
);