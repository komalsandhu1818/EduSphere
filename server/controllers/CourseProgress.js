const CourseProgress = require("../models/CourseProgress")
const SubSection = require("../models/SubSection")


exports.updateCourseProgress = async(req,res) => {
    const {courseId, subSectionId} = req.body
    const userId = req.user.id

    try {
        // * Check if the subsection is valid
        const subSection = await SubSection.findById(subSectionId)

        if(!subSection){
            return res.status(400).json({
                success:false,
                error:"Invalid SubSection"
            })
        }


        // !Check for old entry
        let courseProgress = await CourseProgress.findOne({
            courseId:courseId,
            userId:userId,
        })
        if(!courseProgress){
            return res.status(400).json({
                success:false,
                message:"Course Progress does not exist"
            })
        }
        else{
            // * Check for re-completing video/subsection
            if(courseProgress.completedVideos.includes(subSectionId)){
                return res.status(400).json({
                    error:"SubSection already completed"
                })
            }

            // ? Push into completed videos
            courseProgress.completedVideos.push(subSectionId)
        }

        await courseProgress.save()
        return res.status(200).json({
            success:"true",
            message:"Lecture completed"
        })


    } catch (error) {
        console.log(error)
        return res.status(400).json({
            error:"Internal server Error"
        })
        
    }
}