const User = require("../models/User");
const bcrypt = require('bcryptjs')

exports.register = async (req, res, next) => {
    const {userName, email, password} = req.body

    try {
        const user = await User.create({
            userName,
            email,
            password
        })

        res.status(201).json({
            success: true,
            user
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            error: e.message
        })
    }

}

exports.login = async (req, res, next) => {
    const {email, password} = req.body

    if (!email || !password) {
        res.status(400).json({
            success: false,
            error: 'please provide amil and password'
        })
    }

    try {
        const user = await User.findOne({email}).select('+password')

        if (!user) {
            res.status(400).json({
                success: false,
                error: 'Invalid credentials'
            })
        }

        const isMatch = await user.matchPasswords(password)

        if (!isMatch) {
            res.status(400).json({
                success: false,
                error: 'Invalid credentials'
            })
        }

        res.status(200).json({
            success: true,
            token: "fdhfedy6tgj",
            user
        })

    } catch (e){
        res.status(500).json({
            success: false,
            error: e.message
        })
    }
}

exports.forgotPassword = (req, res, next) => {
    res.send('Forgot Password Route')
}

exports.resetPassword = (req, res, next) => {
    res.send('Reset Password Route')
}

