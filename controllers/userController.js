const passport = require('passport');
const User = require('../models/User');

const postJoin = async (req, res, next) => {
    const { emailId, emailDomain, password, password2 } = req.body;
    const email = `${emailId}@${emailDomain}`;
    req.body.email = email; // next로 넘길때 passport.authenticate() 함수가 얘를 봐야 함
    if ( password !== password2 || password.length < 8 ) {
        res.status(400);
        res.render('join', { pageTitle: 'join' });
    } else {
        try {
            const user = User({ email });
            // passport-local-mongoose가 준 register 함수. mongodb의 해당 유저에 salt, hash 필드 작성하여 저장함. (이 단계에서는 아직 쿠키나 세션같은건 없음!!!!!!)
            await User.register(user, password); 
            next();
        } catch (err) {
            console.error(err);
            res.redirect('/');
        }
    }
};

// postLogin: 받은 이메일과 비밀번호로 로그인 되는지 여부 판단하고 되면 어디로, 안되면 어디로 보낼지 정함.
// 'local' strategy 쓰면 passport.authenticate가 알아서 req.body에서 email, passport 받아옴
// 로그인 후에는 쿠키, 세션이 생성되고(serialize), 이 쿠키와 세션으로 req.user에 user 들어옴(deserialize)
const postLogin = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
})

module.exports = { postJoin, postLogin };