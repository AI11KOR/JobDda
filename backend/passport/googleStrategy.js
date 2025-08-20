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
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = await connectDB();
        const userCollection = db.collection('user');

        const email = profile.emails?.[0]?.value;
        const nickname = profile.displayName || 'GoogleUser';

        if (!email) return done(new Error('Google 계정에서 이메일을 가져올 수 없음'));

        let user = await userCollection.findOne({ email, provider: 'google' });
        if (!user) {
          const result = await userCollection.insertOne({ email, nickname, provider: 'google', createdAt: new Date() });
          user = result.ops[0];
        }

        done(null, user); // token 생성은 socialController에서 처리
      } catch (err) {
        done(err, null);
      }
    }
  )
);
