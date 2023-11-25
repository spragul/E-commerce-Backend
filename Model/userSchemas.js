const mongoose = require('mongoose');
var validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    role: { 
        type: String, 
        default: 'user' 
    },
    favoriteProducts:{
        type:Array,
        required:false
    },
    orderHistory:{
        type:Array,
        required:false
    },
    date: {
        type: Date,
        default: Date.now
    }
});
let UserModel = mongoose.model('users', userSchema);
module.exports = { UserModel };