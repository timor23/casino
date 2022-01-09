const User = require("../models/User");
exports.register = (req, res, next) => {
    res.send('Register Route')
}

exports.login = async (req, res, next) => {
    const {userName, email, password} = req.body

    try {
        const  user = await User.create({
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

exports.forgotPassword = (req, res, next) => {
    res.send('Forgot Password Route')
}

exports.resetPassword = (req, res, next) => {
    res.send('Reset Password Route')
}

