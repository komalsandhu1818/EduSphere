import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../../../common/IconBtn'
import { resetCourseState, setStep } from '../../../../../slices/courseSlice'
import { COURSE_STATUS } from '../../../../../utils/constants'
import { useEffect } from 'react'
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI'
import { useNavigate } from 'react-router-dom'

const PublishCourse = () => {

    const {register,handleSubmit,setValue,getValues} = useForm()
    const {course} = useSelector((state) => state.course)
    const {token} = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(course?.status === COURSE_STATUS.PUBLISHED){
            setValue("public",true) 
        }
    },[])

    const goBack = ()=>{
        dispatch(setStep(2))
    }
    const goToCourses = ()=>{
        dispatch(resetCourseState())
        navigate("/dashboard/my-courses")
    }

    const handleCoursePublish = async() => {
        if((course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true) || (course.status === COURSE_STATUS.DRAFT && getValues("public")===false)){
            // No updation in form
            // no need to make api call
            goToCourses()
            return
        }
        //! if form is updated
        const formData = new FormData()
        formData.append("courseId",course._id)
        const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT
        formData.append("status",courseStatus)

        setLoading(true)
        const result = await editCourseDetails(formData,token)

        if(result){
            goToCourses()
        }

    }

    const onSubmit=()=>{
        handleCoursePublish();

    }


  return (
    <div className='rounded-md border-[1px] bg-richblack-800 p-6 border-richblack-700'>
        <p className='text-richblack-5 font-semibold'>Publish Course</p>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor='public'>
                    <input 
                        type='checkbox'
                        id='public'
                        {...register("public")}
                        className='rounded h-4 w-4 mt-5'
                    />
                    <span className='ml-3 text-white '>Make this course as public</span>
                </label>
            </div>

            <div className='flex mt-4 gap-x-2'>
                <button disabled={loading} type='button' onClick={goBack} className='flex items-center text-white px-4 py-2 bg-richblack-600 rounded-md'>
                    Back


                </button>
                <IconBtn disabled={loading} text={"Save changes"}/>
            </div>

        </form>

    </div>
  )
}

export default PublishCourse