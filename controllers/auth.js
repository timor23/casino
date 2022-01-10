const User = require("../models/User");
const bcrypt = require('bcryptjs')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require("../utils/sendEmail")

exports.register = async (req, res, next) => {
    const {userName, email, password} = req.body

    try {
        const user = await User.create({
            userName,
            email,
            password
        })

        sendToken(user, 201, res)
    } catch (e) {
        next(e)
    }

}

exports.login = async (req, res, next) => {
    const {email, password} = req.body

    if (!email || !password) {
        return next(new ErrorResponse('please provide amil and password', 400))
    }

    try {
        const user = await User.findOne({email}).select('+password')

        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401))
        }

        const isMatch = await user.matchPasswords(password)

        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401))
        }

        sendToken(user, 200, res)

    } catch (e) {
        next(e)
    }
}

exports.forgotPassword = async (req, res, next) => {
    const {email} = req.body

    try {
        const user = await User.findOne({email})

        // check if user exists
        if (!user) {
            return next(new ErrorResponse("Email could not be sent", 404))
        }

        // Reset Token Gen and add to database hashed (private) version of token
        const resetToken = user.getResetPasswordToken()

        await user.save()

        // Create reset url to email to provided email
        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`

        // HTML Message
        const message = `
      <h1>You have requested a password reset</h1>
      <p>Please make a put request to the following link:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message,
            });

            res.status(200).json({success: true, data: "Email Sent"});
        } catch (err) {
            console.log(err);

            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return next(new ErrorResponse("Email could not be sent", 500));
        }
    } catch (err) {
        next(err);
    }

}

exports.resetPassword = (req, res, next) => {
    res.send('Reset Password Route')
}

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken()
    res.status(statusCode).json({success: true, token})
}

