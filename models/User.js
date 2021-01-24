const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    avatarUrl: String,
    kakaoID: Number,
    naverID: Number,
    googleID: Number,
    facebookID: Number,
});

UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model('User', UserSchema);