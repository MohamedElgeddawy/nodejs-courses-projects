const mongoose = require('mongoose');
const validator = require('validator');
const userRole = require('../utils/userRoles');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid email format']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    token: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: [userRole.USER, userRole.ADMIN, userRole.MANAGER],
        default: userRole.USER
    },
    avatar: {
        type: String,
        default: "uploads/profile.jpg"
    }


});

module.exports = mongoose.model('User', userSchema);