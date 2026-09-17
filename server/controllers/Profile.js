const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress');
const Profile = require('../models/Profile')
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const { convertSecondsToDuration } = require('../utils/secToDuration');

exports.updateProfile = async(req,res) => {
    try {
        // ? Get data (userId already present in req.body in auth middleware)
        const {dateOfBirth="", about="", contactNumber, gender=""} = req.body
        // ? Get userId
        const id = req.user.id;
       
        // ? find Profile Model
        const userDetails = await User.findById(id)
        const profileId = await userDetails.additionalDetails
        const profileDetails = await Profile.findById(profileId)

        // ? update Profile Model
        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.contactNumber = contactNumber
        profileDetails.gender = gender
        profileDetails.about = about

        await profileDetails.save()

        const newUser = await User.findById(id).populate("additionalDetails").exec()

        // ? return response
        return res.status(200).json({
            success:true,
            message:"Profile updated Sucessfully",
            updatedProfileDetails:newUser
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Problem in updating profile",
            error:error.message
        })
    }
}

// ! Delete account
// ! Explore -> how can we schedule this job 
exports.deleteAccount = async(req,res) => {
    try {
        // ? Get id
        const id = req.user.id
        // ? validation
        const userDetails = await User.findById(id)
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User not found",
            })
        }
        // ? delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
        //! TODO: un-erroll user from all enrolled courses
        // ? delete user
        await User.findByIdAndDelete({_id:id})
        // ? return response
        return res.status(200).json({
            success:true,
            message:"User Deleted Successfully",
            
        })




    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User cannot be deleted, please try again later",
            error:error.message
        })
    }
}

exports.getAllUserDetails = async(req,res) => {
    try {
        // ? get id
        const id = req.user.id
        // ? validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec()

        // ? return response 
        return res.status(200).json({
            success:true,
            message:"User data fetched successfully",
            userDetails
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Could not get user details",
            error:error.message
        })
    }
}

exports.updateDisplayPicture = async(req,res) => {
    try {
        const displayPicture = req.files.displayPicture
        const userId = req.user.id;
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000,
        )

        console.log(image)
        const updatedProfile = await User.findByIdAndUpdate(
            {_id:userId},
            {
                image:image.secure_url
            },
            {new:true}
        ).populate("additionalDetails")

        res.send({
            success:true,
            message:"Image Updated Successfully",
            data:updatedProfile
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
          })
    }
}

exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id
        let userDetails = await User.findOne({
            _id:userId
        }).populate({
            path:"courses",
            populate:{
                path:"courseContent",
                populate:"subsection"
            }
        }).exec()

        userDetails = userDetails.toObject()
	  var SubsectionLength = 0
	  for (var i = 0; i < userDetails.courses.length; i++) {
		let totalDurationInSeconds = 0
		SubsectionLength = 0
		for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
		  totalDurationInSeconds += userDetails.courses[i].courseContent[
			j
		  ].subsection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
		  userDetails.courses[i].totalDuration = convertSecondsToDuration(
			totalDurationInSeconds
		  )
		  SubsectionLength +=
			userDetails.courses[i].courseContent[j].subsection.length
		}
		let courseProgressCount = await CourseProgress.findOne({
		  courseId: userDetails.courses[i]._id,
		  userId: userId,
		})
		courseProgressCount = courseProgressCount?.completedVideos.length
		if (SubsectionLength === 0) {
		  userDetails.courses[i].progressPercentage = 100
		} else {
		  // To make it up to 2 decimal point
		  const multiplier = Math.pow(10, 2)
		  userDetails.courses[i].progressPercentage =
			Math.round(
			  (courseProgressCount / SubsectionLength) * 100 * multiplier
			) / multiplier
		}
	  }
  

        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find user wiht id: ${userDetails}`,
            })
        }
        return res.status(200).json({
            success:true,
            data:userDetails.courses
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
          })
    }
}


exports.instructorDashboard = async(req, res) => {
	try{
		const courseDetails = await Course.find({instructor:req.user.id})

        const courseData = courseDetails.map((course)=>{
            const totalStudentsEnrolled = course.studentsEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // ! Create a new object with the additional fields
            const courseDataWithStats = {
                _id:course._id,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated
            }
            return courseDataWithStats
        })

        return res.status(200).json({
            courses:courseData
        })

	}
	catch(error) {
		console.error(error);
		res.status(500).json({message:"Internal Server Error"});
	}
}