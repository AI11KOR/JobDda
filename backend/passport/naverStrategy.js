// naverStrategy.js
const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;
const connectDB = require('../config/database');
const { createAccessToken, createRefreshToken, saveRefreshTokenToDB } = require('../utils/jwtUtils');
require('dotenv').config();

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CLIENT_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = await connectDB();
        const userCollection = db.collection('user');

        const provider = 'naver';
        const providerId = profile.id;
        const email = profile.emails?.[0]?.value || `naver_${profile.id}@noemail.com`;
        const nickname = profile.displayName || 'NaverUser';

        let user = await userCollection.findOne({ providerId, provider });
        if (!user) user = await userCollection.findOne({ email, provider });

        if (!user) {
          const newUser = { providerId, email, nickname, provider, createdAt: new Date() };
          const result = await userCollection.insertOne(newUser);
          user = { ...newUser, _id: result.insertedId };
        }

        return done(null, user); // [CHANGED] 전략에서 토큰 생성/저장 제거
      } catch (err) {
        console.error('NaverStrategy Error:', err);
        return done(err, null);
      }
    }
  )
);