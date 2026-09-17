const User = require('../models/User')
const mailSender = require('../utils/mailSender')
const bcrypt = require('bcrypt')
const crypto = require('crypto')


//  * ResetPasswordToken
exports.resetPasswordToken = async(req,res) =>{

    try {
        
    // ? Get email from req.body
    const email = req.body.email;

    // ? check user for this email in DB, email validation
    const user = await User.findOne({email:email})
    if(!user){
        return res.status(400).json({
            success:false,
            message:"Your email is not registered with us"
        })
    }

    // ? generate token
    const token = crypto.randomUUID()

    // ? update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate({email:email},{
        token:token,
        resetPasswordExpires:Date.now() + 3600000
    },
    {new:true})

    // ? create url
    const url = `http://localhost:3000/update-password/${token}`

    // ? send mail containing the url
    await mailSender(
        email, 
        "Password Reset Link",
        `Password Reset Link:${url}`)

    // ? return response
    return res.json({
        success:true,
        message:"Email sent successfully, please check email for changing the password"
    })

    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Error is reseting the password",
            error:error.message
        })
    }
}


// * resetPassword (Forgot password wali game)
exports.resetPassword = async(req,res) => {
    try {
        // ? Data fetch
        const {password, confirmPassword, token} = req.body;

        // ? validation
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password not matching"
            })
        }

        // ? get user details from db using token
        const userDetails = await User.findOne({token:token})


        // ? if no entry - invalid token
        if(!userDetails)
        {
            return res.status(400).json({
                success:false,
                message:"Token is invalid"
            })
        }

        // ? token time check
        if(!(userDetails.resetPasswordExpires > Date.now()))
        {
            return res.status(400).json({
                success:false,
                message:"Token has expired, please try again"
            })
        }

        // ? hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // ? Password update
        await User.findOneAndUpdate({token:token},
            {password:hashedPassword},
            {new:true})

        //  ? return response
        return res.status(200).json({
            success:true,
            message:"Password reset successful"
        })

    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Something went wrong while resetting the password"
        })
    }
}