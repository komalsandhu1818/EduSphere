import React from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import ReactStars from 'react-stars'
import IconBtn from '../../common/IconBtn'
import { createRating } from '../../../services/operations/courseDetailsAPI'
import { AiOutlineClose } from 'react-icons/ai'

const CourseReviewModal = ({setReviewModal}) => {

    const {user} = useSelector((state)=>state.profile)
    const {token} = useSelector((state)=>state.auth)
    const {courseEntireData} = useSelector(state=>state.viewCourse)

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm()

    useEffect(()=>{
        setValue("courseExperience","")
        setValue("courseRating",0)
    },[])

    const ratingChange = (newRating) => {
        setValue("courseRating",newRating)
    }

    const onSubmit = async(data) => {
        await createRating(
            {
                courseId:courseEntireData._id,
                rating:data.courseRating,
                review:data.courseExperience,
            },
            token
        )

        setReviewModal(false)

    }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
        <div className="w-11/12 max-w-[600px] rounded-lg border border-richblack-400 bg-richblack-800 p-6" >
            {/* Modal Header */}
            <div className='flex justify-between items-center'>
                <p className='font-bold'>Add Review</p>
                <button onClick={()=>setReviewModal(false)}>
                    <AiOutlineClose size={24} />
                </button>
            </div>

            {/* Modal Body */}
            <div className='text-center'>
                <img 
                    src={user?.image}
                    alt='user'
                    className='aspect-square w-[50px] rounded-full object-cover mx-auto'
                />
                <div>
                    <p>{user?.firstName} {user?.lastName} </p>
                    <p></p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='mt-3  flex flex-col items-center'>
                <ReactStars 
                    count={5}
                    onChange={ratingChange}
                    size={24}
                    activeColor="ffd700"
                />

                <div>
                    <label htmlFor='courseExperience'>
                        Add Your Experience
                    </label>
                    <textarea 
                        id='courseExperience'
                        placeholder='Add your Experience here'
                        {...register("courseExperience", {required:true})}
                        className='form-style min-h-[130px] w-full'
                    />
                    {
                        errors.courseExperience && (
                            <span>Please add your Experience</span>
                        )
                    }
                </div>
                {/* Cancel and Save button */}
                <div className='flex gap-x-4 mt-3'>
                    <button type='button' className='bg-richblack-600 p-2 rounded-lg px-3' onClick={()=>setReviewModal(false)}>
                        Cancel
                    </button>
                    <IconBtn 
                        text={"Save"}
                    />
                </div>

            </form>
        </div>
    </div>
  )
}

export default CourseReviewModal