const {instance} = require('../config/razorpay')
const Course = require('../models/Course')
const User = require('../models/User')
const mailSender = require('../utils/mailSender')
const {courseEnrollmentEmail} = require('../mail/templates/courseEnrollmentEmail')
const { default: mongoose } = require('mongoose')
const { paymentSuccessEmail } = require('../mail/templates/paymentSuccessEmail')
const crypto = require("crypto")
const CourseProgress = require('../models/CourseProgress')

// ! Initiate the razorpay order
exports.capturePayment = async(req,res) => {

    const {courses} = req.body;
    const userId = req.user.id;

    if(courses.length === 0){
        return res.json({
            success:false,
            message:"Please provide Course ID"
        })
    }

    let totalAmount = 0;

    for(const course_id of courses){
        let course;
        console.log("THE COURSESES..",course_id)
        try {
            course = await Course.findById(course_id)
            if(!course){
                return res.status(200).json({
                    success:false,
                    message:"Could not find the course"
                })
            }

            const uid = new mongoose.Types.ObjectId(userId)

            if(course.studentsEnrolled.includes(uid)){
                return res.status(500).json({
                    success:false,
                    message:"Student is already Enrolled"
                })
            }

            totalAmount+=course.price

            console.log("COUSE BYINNG>>",course)

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }
    const currency = "INR";
    const options = {
        amount: totalAmount *100,
        currency,
        receipt: Math.random(Date.now()).toString()
    }


    try {
        const paymentResponse = await instance.orders.create(options)
        console.log("PAYMENT RESPONSE>>>>",paymentResponse)
        res.json({
            success:true,
            data:paymentResponse
        })

    } catch (error) {
        console.log(error)
            return res.status(500).json({
                success:false,
                message:"Could not initiate order"
            })
    }
}

// ! Verify the payment
exports.verifyPayment = async(req,res) => {
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature

    const courses = req.body?.courses;
    const userId = req.user.id

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
            return res.status(500).json({
                success:false,
                message:"Payment Failed"
            })
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")
    

    if(expectedSignature === razorpay_signature){
        // ? Enroll karwao student ko
        await enrollStudents(courses,userId,res);

        // ? Return res
        return res.status(200).json({
            success:true,
            message:"Payment Verified"
        })
    }
    return res.status(500).json({
        success:false,
        message:"Payment failed"
    })
}

const enrollStudents = async(courses,userId,res) => {
    if(!courses || !userId){
            return res.status(400).json({
                success:false,
                message:"Please provide data for courses or UserId"
            })
    }

    for(const courseId of courses){
        try {
            // ? find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
            {_id:courseId},
            {
                $push:{studentsEnrolled:userId}
            },
            {new:true}

        )
        if(!enrolledCourse){
            return res.status(404).json({
                success:false,
                message:"Course not found"
            })
        }

        const courseProgress = await CourseProgress.create({
            courseId:courseId,
            userId:userId,
            completedVideos:[]
        })

        // ? Find the studnent and add the course to their list of enrolled Courses
        const enrolledStudent = await User.findByIdAndUpdate(userId,{
            $push:{
                courses:courseId,
                courseProgress:courseProgress
            }
        },{new:true})

        // ? bacche ko mail send kardo

        const emailResponse = await mailSender(
            enrolledStudent.email,
            `Successfully Enrolled into ${enrolledCourse.courseName}`,
            courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
        )
        console.log("Email Sent Successfully....",emailResponse)
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }
}

exports.sendSuccessfullPaymentEmail = async(req,res) => {
    const {orderId,paymentId,amount} = req.body;

    const userId = req.user.id

    if(!orderId || !paymentId || !amount || !userId){
            return res.status(500).json({
                success:false,
                message:"Please provide all the fields"
            })
    }

    try {
        // * Student ko dhundho
        const enrolledStudent = await User.findById(userId)
        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(`${enrolledStudent.firstName}`,amount/100,orderId,paymentId),
            
        )
    } catch (error) {
        
    }

}

// exports.capturePayment = async(req,res) => {
//     // ? Get courseId and UserId
//     const {course_id} = req.body;
//     const userId = req.user.id
//     // ? validation
//     // ? valid courseId
//     if(!course_id){
//         return res.json({
//             success:false,
//             message:"Please provide valid course ID"
//         })
//     }
//     // ? valid courseDetail
//     let course
//     try {
//         course = await Course.findById(course_id)
//         if(!course){
//             return res.json({
//                 success:false,
//                 message:"Could not find the course"
//             })
//         }
//         // ? user already exists pay for the same course
//         const uid = new mongoose.Types.ObjectId(userId)
//         if(course.studentsEnrolled.includes(uid))
//         {
//             return res.json({
//                 success:false,
//                 message:"Student is already enrolled"
//             })
//         }


//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({
//             success:false,
//             message:error.message
//         })
//     }

//     // ? order create
//     const amount = course.price
//     const currency = "INR"
//     const options = {
//         amount: amount *100,
//         currency,
//         receipt:Math.random(Date.now().toString()),
//         notes:{
//             course_id:course_id,
//             userId,
//         }
//     }

//     try {
//         // ! Initiate the payment using razorpay
//         const paymentResponse = await instance.orders.create(options)
//         console.log(paymentResponse)

//         // ? return response
//         return res.status(200).json({
//             success:true,
//             courseName: course.courseName,
//             course: course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderid:paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount

//         })


//     } catch (error) {
//         console.log(error)
//         res.json({
//             success:false,
//             error:error.message
//         })
//     }
// }

// // ! Verify Signature of Razorpay and Server
// exports.verifySignature = async(req,res) => {
//     const webHookSecret = "1234578"

//     const signature = req.headers('x-razorpay-signature')

//     const shasum = crypto.createHmac("sha256", webHookSecret)
//     shasum.update(JSON.stringify(req.body))
//     const digest = shasum.digest('hex')

//      if(signature === digest)
//      {
//         console.log("Payment is Authorized")

//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try {
//             // ? fullfil the action

//             // ? Find the course and enroll the student
//             const enrolledCourse = await Course.findByIdAndUpdate(courseId, 
//                 {$push:{studentsEnrolled:userId}},
//                 {new:true}
//                 )
            
//                 if(!enrolledCourse)
//                 {
//                     return res.status(500).json({
//                         success:false,
//                         message:"Course not found"
//                     })
//                 }
//                 console.log(enrolledCourse)

//             // ? Find the studnet and add the course to their list of enrolled courses
//             const enrolledStudent = await User.findByIdAndUpdate(
//                 {_id:userId},
//                 {$push:{course:courseId}},
//                 {new:true},
//             )

//             // ? Confirmation mail send krdo
//             const emailResponse = await mailSender(
//                 enrolledStudent.email,
//                 "Congratulations from Codehelp",
//                 "Congratulations, you are onboarded into new Codehelp Course"
//             )

//             console.log(emailResponse)
//             return res.status(200).json({
//                 success:true,
//                 message:"Signature verified and Course added"
//             })

//         } catch (error) {
//             return res.status(500).json({
//                 success:false,
//                 message:"Error in enrollment"
//             })
//         }
//      } else{
//         return res.json(500).json({
//             success:false,
//             message:"Could not verify the signature"
//         })
//      }
// }