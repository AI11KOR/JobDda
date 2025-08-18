// googleStrategy.js
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
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = await connectDB();
        const userCollection = db.collection('user'); // 컬렉션 이름 수정

        const email = profile.emails && profile.emails[0]?.value ? profile.emails[0].value : null;
        const nickname = profile.displayName || 'GoogleUser';

        if (!email) {
          return done(new Error('Google 계정에서 이메일을 가져올 수 없습니다.'));
        }

        let user = await userCollection.findOne({ email, provider: 'google' });

        if (!user) {
          const newUser = {
            email,
            nickname,
            provider: 'google',
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
        console.error('GoogleStrategy Error:', err);
        done(err, null);
      }
    }
  )
);
