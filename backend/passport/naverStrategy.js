// naverStrategy.js
const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;
const connectDB = require('../config/database');
const jwt = require('jsonwebtoken');
require('dotenv').config();

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = await connectDB();
        const userCollection = db.collection('user'); // 컬렉션 이름 수정

        const email = profile.emails && profile.emails[0]?.value ? profile.emails[0].value : null;
        const nickname = profile.displayName || 'NaverUser';

        let user = await userCollection.findOne({ providerId: profile.id, provider: 'naver' });

        if (!user) {
          const newUser = {
            providerId: profile.id,
            email: email || `naver_${profile.id}@noemail.com`,
            nickname,
            provider: 'naver',
            createdAt: new Date(),
          };
          const result = await userCollection.insertOne(newUser);
          user = result.ops[0];
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });

        done(null, { ...user, token });
      } catch (err) {
        console.error('NaverStrategy Error:', err);
        done(err, null);
      }
    }
  )
);
