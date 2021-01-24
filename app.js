require('dotenv').config();
const express = require('express');
require('./db');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const { postJoin, postLogin } = require('./controllers/userController');
const passport = require('passport');

require('./passport');

const app = express();

app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_ID));
app.use(session({
    secret: process.env.COOKIE_ID,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}))

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.pageTitle = 'Relation';
    res.locals.user = req.user || null;
    next();
});

app.get('/', (req,res) => {
    res.render('home', {siteName: 'home'});
});

app.get('/join', (req, res) => res.render('join', {siteName: 'join'}));
app.post('/join', postJoin, postLogin);

app.get('/login', (req, res) => res.render('login', {siteName: 'login'}));
app.post('/login', postLogin);

app.get('/auth/kakao', passport.authenticate('kakao'));
app.get('/auth/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

app.listen(8888, () => console.log('✅ listening on port: 8888'));