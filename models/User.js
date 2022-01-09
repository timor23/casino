const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!');
            }
        }
    },
    password: {
        type: String,
        required: true,
        select: false,
        validate(value) {
            if (value.length < 7) {
                throw new Error('Password length must be at least 7 characters')
            }
            if (value.toLowerCase().includes('password')) {
                throw new Error(`Password can't contain the word "password"`)
            }
        }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

// UserSchema.statics.findByCredentials = async (email, password) => {
//     const user = await User.findOne({ email })
//
//     if (!user) {
//         throw new Error('Unable to login')
//     }
//
//     const isMatch = await bcrypt.compare(password, user.password)
//
//     if (!isMatch) {
//         throw new Error('Unable to login')
//     }
//
//     return user
// }
//
UserSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    }

    next()
})

UserSchema.methods.matchPasswords = async function(password){
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', UserSchema)

module.exports = User