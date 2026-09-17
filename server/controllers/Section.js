const Section = require('../models/Section');
const Course = require('../models/Course');

exports.createSection = async (req, res) => {
  try {
    // ? data fetch
    const { sectionName, courseId } = req.body;
    // ? Data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Missing Properties',
      });
    }
    // ? Create section
    const newSection = await Section.create({ sectionName });
    // ? update courese with section ObjectID
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: 'courseContent',
        populate: {
          path: 'subsection',
        },
      })
      .exec();
    // TODO: use populate to replace sections and subsections both in the updated course details
    // ? return response
    return res.status(200).json({
      success: true,
      message: 'Section created Sucessfully',
      updatedCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Problem in creating section',
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    // ? Data input
    const { sectionName, sectionId, courseId } = req.body;
    // ? Data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: 'Missing Properties',
      });
    }
    // ? update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    const result = await Course.findById(courseId).populate({
      path: 'courseContent',
      populate: {
        path: 'subsection',
      },
    })
    .exec();
    // ? return res
    return res.status(200).json({
      success: true,
      message: 'Section updated Sucessfully',
      data:result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Problem in updating section',
      error: error.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    // ? get ID - assuming we are sending ID in params
    const { sectionId, courseId } = req.body;

    // ? use findbyid and delete
    await Section.findByIdAndDelete(sectionId);
    // ! TODO: Do we need to delete section entry in Course model
    const result = await Course.findByIdAndUpdate(courseId,{
      $pull: {courseContent: sectionId}
    },{new:true}).populate({
      path: 'courseContent',
      populate: {
        path: 'subsection',
      },
    })
    .exec();
    // ? return res
    return res.status(200).json({
      success: true,
      message: 'Section deleted Sucessfully',
      data:result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Problem in deleting section',
      error: error.message,
    });
  }
};
