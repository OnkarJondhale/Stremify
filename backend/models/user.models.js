const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    avatar: {
        type: String,
        default: ""
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    address: {
        type: String
    },
    username: {
        type: String,
    },
    gender: {
        type: String
    },
    dob: {
        type: Date,
    },
    phone: {
        type: Number
    },
    country: {
        type: String,
    },
    nativeLanguage: {
        type: String,
    },
    proficientLanguages: [
        {
            type: String,
        }],
    interests: [
        {
            type: String,
        }
    ],
    bio: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model("User", schema);