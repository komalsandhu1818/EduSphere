const RatingAndReviews = require('../models/RatingAndReviews')
const Course = require('../models/Course')
const { default: mongoose } = require('mongoose')


// ! create Rating
exports.createRating = async(req,res) => {
    try {
        // ? Data fetch -> userid, rating, review, courseId
        const userId = req.user.id

        const {rating, review, courseId} = req.body
        // ? Check if user is enrolled or not
        const courseDetails = await Course.findOne(
            {
                _id:courseId,
                studentsEnrolled: {$elemMatch: {$eq:userId}}
                
            }
        )
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"User is not enrolled in the course"
            })
        }
        // ? Check if user has already reviewed the course
        const alreadyReviewed = await RatingAndReviews.findOne({
            user:userId,
            courseId:courseId
        })
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"User has already reviewed the course"
            })
        }

        // ? Create Rating and review
        const ratingAndReviews = await RatingAndReviews.create({
            rating, review, course:courseId, user:userId
        })

        // ? update course with rating and review
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
                {
                    $push:{
                        ratingAndReviews: ratingAndReviews._id
                    }
                },
                {new:true}
            )

        // ? Return response
        return res.status(200).json({
            success:true,
            message:"Rating and Review created Successfully"
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Could not create Rating, server error",
            error:error.message

        })        
    }
}


// ! get Average Rating
exports.getAverageRating = async(req,res) => {
    try {
        // ? get courseId
        const courseId = req.body.courseId
        // ? calculate average rating
        const result = await RatingAndReviews.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating:{ $avg: "rating"}
                }
            }
        ])


        //  ? return rating
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating
            })
        }

        // ? if no rating/review exists
        return res.status(200).json({
            success:true,
            message:"Average Rating is 0, no ratings given right now",
            averageRating: 0

        })



    } catch (error) {
        return res.status(500).json({
            success:false,
            error:error.message
        })   
    }
}



// ! get All rating
exports.getAllRating = async(req, res) => {
    try {
        const allReviews = await RatingAndReviews.find({})
                                    .sort({rating:"desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image"
                                    })
                                    .populate({
                                        path:"course",
                                        select:"courseName"
                                    })
                                    .exec()

        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            data: allReviews
        })



    } catch (error) {
        return res.status(500).json({
            success:false,
            error:error.message
        })  
    }
}