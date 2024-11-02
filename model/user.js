const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CSchema= new Schema({
    firstName: {
        type: String,
        required: [true, 'firstName field required']
    },
    lastName: {
        type: String,
        required: [true, 'lastName field required']
    },
    userName: {
        type: String,
        required: [true, 'userName field required']
    },
    dob: {
        type: String,
        required: [true, 'dob field required']
    },
    password: {
        type: String,
        required: [true, 'password field required'],
        // select: false
    },
    email: {
        type: String,
        required: [true, 'email field required']
    },
    gender: {
        type: String,
        required: [true, 'gender field required']
    },
    role: {
        type: String,
        required: [true, 'role field required']
    },
    userStatus: {
        type: String,
        required: [true, 'userStatus field required']
    },
    isLoggedIn: {
        type: Boolean,
        required: [false, 'isLoggedIn ???']
    },
     

});

const User = mongoose.model('user', CSchema, 'users');

module.exports = User;