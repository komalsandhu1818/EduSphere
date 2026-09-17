const SubSection = require('../models/SubSection')
const Section = require('../models/Section')
const { uploadImageToCloudinary } = require('../utils/imageUploader')
const Course = require('../models/Course')

exports.createSubSection = async(req,res) => {
    try {
        // ? Fetch Data from req body
        const {sectionId, title, description, courseId} = req.body

        // ? Extract videoFile
        const video = req.files.videoFile
        // ? validation
        if(!sectionId || !title 
            //|| !timeDuration 
            || !description || !video){
            return res.status(400).json({
                success:false,
                message:"All Fields are required",
            })
        }
        // ? upload video to cloudinary -> get secureURL
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)
        // ? Create a subsection
        const SubSectionDetails = await SubSection.create({
            title,
            timeDuration: `${uploadDetails.duration}`,
            description,
            videoUrl:uploadDetails.secure_url
        })
        console.log("SubSectionDetails ", SubSectionDetails)
        // ? push the subSection into the Section model
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId}, { $push:{subsection:SubSectionDetails._id} }, {new:true}).populate("subsection").exec()
        // ! TODO: log updated section here, after adding populate
        const updatedCourse = await Course.findById(courseId).populate({
            path: 'courseContent',
            populate: {
              path: 'subsection',
            },
          })
          .exec();
        // ? return response
        return res.status(200).json({
            success:true,
            message:"SubSection created Sucessfully",
            data: updatedCourse
        })

    } catch (error) {
         return res.status(500).json({
            success:false,
            message:"Problem in creating SubSection",
            error:error.message
        })
    }
}

// ! TODO: updateSubsection
exports.updateSubSection = async(req,res) => {
    try {
        const { sectionId,subSectionId, title, description } = req.body
        const subSection = await SubSection.findById(subSectionId)
    
        if (!subSection) {
          return res.status(404).json({
            success: false,
            message: "SubSection not found",
          })
        }
    
        if (title !== undefined) {
          subSection.title = title
        }
    
        if (description !== undefined) {
          subSection.description = description
        }
        if (req.files && req.files.video !== undefined) {
          const video = req.files.video
          const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
          )
          subSection.videoUrl = uploadDetails.secure_url
          subSection.timeDuration = `${uploadDetails.duration}`
        }
    
        await subSection.save()
    
        const updatedSection = await Section.findById(sectionId).populate("subsection")
  
  
        return res.json({
          success: true,
          data:updatedSection,
          message: "Section updated successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Problem in updating section",
            error:error.message
        })
    }
}

// ! TODO: deleteSubsection
exports.deleteSubSection = async(req,res) => {
    try {
        const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }

      const updatedSection = await Section.findById(sectionId).populate("subsection")
  
      return res.json({
        success: true,
        data:updatedSection,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Problem in deleting section",
            error:error.message
        })
    }
}