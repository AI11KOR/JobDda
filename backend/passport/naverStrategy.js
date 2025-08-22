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

        const email = profile.emails?.[0]?.value || `naver_${profile.id}@noemail.com`;
        const nickname = profile.displayName || 'NaverUser';

        let user = await userCollection.findOne({ providerId: profile.id, provider: 'naver' });

        if (!user) {
          const newUser = { providerId: profile.id, email, nickname, provider: 'naver', createdAt: new Date() };
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
        console.error('NaverStrategy Error:', err);
        done(err, null);
      }
    }
  )
);
