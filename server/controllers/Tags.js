const Tag = require('../models/Tags')

// ! Create tag handler function
exports.createTag = async(req,res) =>{
    try {
        
        const {name, description} = req.body;

        if(!name || !description)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        // ? Create entry in DB
        const tagDetails = await Tag.create({
            name,description
        })
        // ? return response
        return res.status(200).json({
            success:true,
            message:"Tag created successfully"
        })


    } catch (error) {
        return res.status(500).json({
            sucess:false,
            message:error.message,
        })
    }
}


// ! getAllTags handler function

exports.showAllTags = async(req,res) =>{
    try {
        const allTags = await Tag.find({}, {name:true, description:true})
        return res.status(200).json({
            success:true,
            message:"All tags returned successfully",
            allTags,
        })

        
    } catch (error) {
        return res.status(500).json({
            sucess:false,
            message:error.message,
        })
    }
}