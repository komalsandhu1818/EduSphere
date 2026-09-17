import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI'
import { updateCompletedLectures } from '../../../slices/viewCourseSlice'
import { Player } from "video-react";
import { AiFillPlayCircle } from "react-icons/ai";
import IconBtn from '../../common/IconBtn'

const VideoDetails = () => {

    const {courseId,sectionId, subSectionId} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const playerRef = useRef()
    const {token} = useSelector(state=>state.auth)
    const {courseSectionData,courseEntireData,completedLectures} = useSelector(state=>state.viewCourse) 
    const location = useLocation()

    const [videoData, setVideoData] = useState([]);
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        ;(()=>{ 
            if(!courseSectionData.length)
            return;
            
            if(!courseId && !sectionId && !subSectionId){
                navigate("/dashboard/enrolled-courses")
            }
            else{
                // * Lets assume k all 3 fieldar areprence
                const filteredData = courseSectionData.filter((course)=> course._id === sectionId)
                const filteredVideoData = filteredData?.[0].subsection.filter(data=>data._id === subSectionId)
                setVideoData(filteredVideoData[0])
                setVideoEnded(false)
            }



        })()
    },[courseSectionData,courseEntireData,location.pathname])

    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data)=>data._id === sectionId)
        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subsection.findIndex((data)=>data._id === subSectionId)
        
        if(currentSectionIndex === 0 && currentSubSectionIndex === 0)
            return true
        else
            return false
    }
    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data)=>data._id === sectionId)

        const noOfSubSections = courseSectionData[currentSectionIndex].subsection.length

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subsection.findIndex((data)=>data._id === subSectionId)
        
        if(currentSectionIndex === courseSectionData.length - 1 && currentSubSectionIndex === noOfSubSections-1)
            return true
        else
            return false
    }

    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data)=>data._id === sectionId)

        const noOfSubSections = courseSectionData[currentSectionIndex].subsection.length

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subsection.findIndex((data)=>data._id === subSectionId)

        // ! Same section ke andar aur lectures hai
        if(currentSubSectionIndex !== noOfSubSections -1){
            // * same section ki next video me jao
            const nextSubSectionId = courseSectionData[currentSectionIndex].subsection[currentSubSectionIndex + 1]._id

            // * iss video par jao
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)       
        
        }
        // ! Different section ke andar next lecture hai
        else{
            // * Diffrent section ki first video
            const nextSectionId = courseSectionData[currentSectionIndex + 1]._id
            const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subsection[0]._id

            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)       

            
        }
        
    }
    const goToPrevVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data)=>data._id === sectionId)

        const noOfSubSections = courseSectionData[currentSectionIndex].subsection.length

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subsection.findIndex((data)=>data._id === subSectionId)

        // ! Same section ke andar aur lectures hai
        if(currentSubSectionIndex !== 0){
            // * same section ki prev video me jao
            const prevSubSectionId = courseSectionData[currentSectionIndex].subsection[currentSubSectionIndex - 1]._id

            // * iss video par jao
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)       
        
        }
        // ! Different section ke andar prev lecture hai
        else{
            // * Diffrent section ki last video
            const nextSectionId = courseSectionData[currentSectionIndex - 1]._id
            const prevSubSectionLength = courseSectionData[currentSectionIndex -1].subsection.length
            const prevSubSectionId = courseSectionData[currentSectionIndex - 1].subsection[prevSubSectionLength - 1]._id

            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${prevSubSectionId}`)       

            
        }

    }

    const handleLectureCompletion = async() => {
        // TODO: Dummy code, baad me we will replace it with actual coll
        setLoading(true)

        const result = await markLectureAsComplete({courseId:courseId, subSectionId:subSectionId},token)

        if(result){
            dispatch(updateCompletedLectures(subSectionId))
        }
        setLoading(false)
    }

  return (
    <div>
        {
            !videoData ? (<div>
                No Data Found
            </div>):(
                <Player 
                    ref={playerRef}
                    aspectRatio='16:9'
                    playsInline
                    onEnded={()=>setVideoEnded(true)}
                    src={videoData?.videoUrl}
                    className="relative"
                >
                <AiFillPlayCircle />
                {
                    videoEnded && (
                        <div className='absolute'>
                            {
                            !completedLectures.includes(subSectionId)  && (
                                <IconBtn 
                                    disabled={loading}
                                    onclick={()=>handleLectureCompletion()}
                                    text={!loading ? "Mark as completed":"Loading..."}
                                />
                            )

                            }
                            <IconBtn 
                                disabled={loading}
                                onclick={()=>{
                                    if(playerRef?.current){
                                        playerRef.current?.seek(0)
                                        setVideoEnded(false)
                                    }
                                }}
                                text={"Rewatch"}
                                customClasses={"text-xl"}
                            />

                            <div>
                                {
                                    !isFirstVideo() && (
                                        <button
                                            disabled={loading}
                                            onClick={goToPrevVideo}
                                            className='blackButton'
                                        >
                                            Back
                                        </button>
                                    ) 
                                }
                                {
                                    !isLastVideo() && (
                                        <button
                                            disabled={loading}
                                            onClick={goToNextVideo}
                                            className='blackButton'
                                        >
                                            Next
                                        </button>
                                    ) 
                                }
                            </div>
                        </div>
                    )
                }
                </Player>
            )
        }

        <h1>
            {videoData?.title}
        </h1>
        <p>
            {videoData?.description}
        </p>
    </div>
  )
}

export default VideoDetails