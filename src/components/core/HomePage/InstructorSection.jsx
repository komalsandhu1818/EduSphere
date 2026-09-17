import React from 'react'
import Instructor from '../../../assets/Images/Instructor.png';
import InstructorMobile from '../../../assets/Images/SuccessfulWoman_Mentor.jpg';
import HighLightText from './HighLightText';
import { FaArrowRight } from 'react-icons/fa';
import CTAButton from './Button';

const InstructorSection = () => {
  return (
    <div className='mt-16'>
        <div className='flex md:flex-row flex-col-reverse gap-10 items-center'>
            {/* Left wala dabba (aunty ki image) */}
            <div className=' hidden md:block w-full'>
                <img 
                    src={Instructor}
                    alt=''
                    className='shadow-[-12px_-12px_0px_0px_rgba(255,255,255)]'
                />

            </div>
            <div className='flex flex-col gap-10 '>
                <div className='text-4xl font-semibold '>
                    Become an
                    <HighLightText text={"instructor"} />
                </div>
                <p className='font-medium text-[16px] text-richblack-300 '>
                    Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
                </p>
                <img 
                    src={InstructorMobile}
                    alt=''
                    className='md:hidden'
                />

                <div className='w-fit'>
                <CTAButton active={true} linkto={"/signup"}>
                    <div className='flex flex-row gap-2 items-center'>
                        Start Learning Today
                        <FaArrowRight />

                    </div>

                </CTAButton>
                </div>
                

            </div>

        </div>
    </div>
  )
}

export default InstructorSection