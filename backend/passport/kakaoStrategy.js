// kakaoStrategy.js
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const connectDB = require('../config/database');
const jwt = require('jsonwebtoken');
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
        const userCollection = db.collection('user'); // 컬렉션 이름 수정

        const email = profile._json?.kakao_account?.email || null;
        const nickname = profile._json?.kakao_account?.profile?.nickname || 'KakaoUser';

        if (!email) {
          console.warn('Kakao email 동의 없음, 임시 이메일 생성:', `kakao_${profile.id}@noemail.com`);
        }

        let user = await userCollection.findOne({ providerId: profile.id, provider: 'kakao' });

        if (!user) {
          const newUser = {
            providerId: profile.id,
            email: email || `kakao_${profile.id}@noemail.com`,
            nickname,
            provider: 'kakao',
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
        console.error('KakaoStrategy Error:', err);
        done(err, null);
      }
    }
  )
);
