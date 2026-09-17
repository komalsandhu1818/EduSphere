const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const mailSender = require('../utils/mailSender');
const Profile = require('../models/Profile'); 

// *SendOTP
exports.sendOTP = async (req, res) => {
  try {
    // ? (1) Fetch email from req body
    const { email } = req.body;

    // ? (2) Check if user already exist
    const checkUserPresent = await User.findOne({ email });

    // ? if user already exist
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: 'user already registered',
      });
    }

    // ? (3) Generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log('OTP generated ', otp);

    // ?check unique otp
    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    // ? (4) OTP entry in DB
    const otpPayload = { email, otp };

    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    // ? (5) Return response successfully
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp: otp
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'OTP error',
    });
  }
};

// * SignUp
exports.signUp = async (req, res) => {
  try {
    // ?DAta fetch from request ki body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // ? validate krlo
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // ? 2 password match krlo
    if (password !== confirmPassword)
      return res.status(400).json({
        success: false,
        message: 'Password and Confirm password fields do not match',
      });

    //? check user already exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(existingUser)
      return res.status(400).json({
        success: false,
        message: 'User is already registered',
        existingUser
      });
    }

    // ? find most recent OTP stored for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log('Most recent otp ', recentOtp);

    // ? validate OTP
    if (recentOtp.length === 0) {
      // * Otp not found
      return res.status(400).json({
        success: false,
        message: 'OTP not found',
      });
    } else if (otp !== recentOtp[0].otp) {
      // * Invalid otp
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // ? Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

    // ? Create entry in DB
    const profileDetails = await Profile.create({
      gender: null,
      dataOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({ 
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType:accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // ? return res
    return res.status(200).json({
      success: true,
      message: 'User is registered successfully',
      user
    });
  } catch (error) {
    return res.status(400).json({
        success:false,
        message:"Failed to register User",
        error:error.message
    })
  }
};

// *Login
exports.login = async (req,res) =>{
    try {
        // ? Get data from req.body
        const {email, password} = req.body;

        // ? validataion data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required, please try again"
            })
        }

        // ? Check if user exists in DB
        const user = await User.findOne({email}).populate("additionalDetails")
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered, please signup first"
            })
        }
        // ? password matching -> generate JWT token
        if(await bcrypt.compare(password, user.password)){

            const payload = {
                email: user.email,
                id:user._id,
                accountType:user.accountType,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn:"2 days"
            })
            user.token = token;
            user.password = undefined;

            const options = {
                expires:new Date(Date.now() + 2*24*60*60*1000)
            }

            // ? create a cookie for storing session
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in Successfully"

            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Incorrect Password"
            })
        }
 
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Log In error, Please try again later"
        })
    }
}

// *ChangePassword
// ! TODO: HOMEWORK
exports.changePassword = async (req,res) =>{
   try {
     // ?get data from req.body
        // * get oldPassword, newPassword, confirmPassword
        const userDetails = await User.findById(req.user.id);

    const {oldPassword, newPassword, confirmPassword} = req.body;
    const userId = req.user.id
    // ? validation
    if(!oldPassword || !newPassword )
    {
      return res.status(400).json({
        success:false,
        message:"All fields are required"
      })
    }
    // Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}
    // if(newPassword!==confirmPassword){
    //   return res.status(400).json({
    //     success:false,
    //     message:"Passwords do not match, try again"
    //   })
    // }
    // ? Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ? Update pwd in DB
    const updatedProfile = await User.findByIdAndUpdate(
      {_id:userId},
      {
          password:hashedPassword
      },
      {new:true}
    )


    // ? send mail - Password updated
    const emailResponse = await mailSender( 
      userDetails.email,
      "PASSWORD UPDATED",
      "Your password has successfully been updated"
    )

    // ? return response
    return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });

   } catch (error) {
    console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
   }

    
}