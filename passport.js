const passport = require('passport');
const User = require('./models/User');

const KakaoStrategy = require('passport-kakao').Strategy;

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser()); // req.session 에 유저 id만 넣음
passport.deserializeUser(User.deserializeUser()); // cookie에 있는 값으로 req.session 에서 id 얻어와서 req.user에 유저 넣음

// kakao

passport.use(
    new KakaoStrategy(
        {
            clientID: process.env.KAKAO_ID, // kakao developer에서 발급받는 REST API 키
            callbackURL: '/auth/kakao/callback', // 인증 결과를 받을 라우터
        }, async (_, __, profile, cb) => {
            const {
                id,
                username: name,
                _json: {
                    properties: { profile_image },
                    kakao_account: { email },
                },
            } = profile;
            try {
                const user = await User.findOne({ email });
                if (user) {
                    user.kakaoID = id;
                    user.save();
                    return cb(null, user);
                } else {
                    const newUser = await User.create({
                        email: email || name, // 카카오 동의 화면에서 email 동의 안했으면 email field에 그냥 이름 넣음. (usernameField가 email이라서 일단 이렇게)
                        name,
                        kakaoId: id,
                        avatarUrl: profile_image,
                    });
                    return cb(null, newUser);
                }
            } catch (err) {
                return cb(err);
            }
        }
    )
)