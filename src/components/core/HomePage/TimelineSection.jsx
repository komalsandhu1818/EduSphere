import React from 'react'
import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg';
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg';
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg';
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg';
import timelineImage from "../../../assets/Images/TimelineImage.png"

import "./TimelineSection.css"


const timeline = [
    {
        Logo: Logo1,
        heading: "Leadership",
        Description: "Fully committed to the success company"
    },
    {
        Logo: Logo2,
        heading: "Responsibility",
        Description: "Students will always be our top priority"
    },
    {
        Logo: Logo3,
        heading: "Flexibility",
        Description: "The ability to switch is an important skills"
    },
    {
        Logo: Logo4,
        heading: "Solve the problem",
        Description: "Code your way to a solution"
    },
]


const TimelineSection = () => {
  return (
    <div>
        <div className='flex md:flex-row flex-col gap-14 items-center'>
            {/* Left wala box */}
            <div className='md:w-[45%] flex flex-col gap-16'> 
                 {
                    timeline.map((element, index) => {
                        return (
                        <div className='flex flex-row gap-6' key={index}>
                            <div className='w-[50px] h-[50px] bg-white rounded-full justify-center flex flex-col items-center relative shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)] z-1'>
                                <img src={element.Logo} alt='Logo'/>
                               {
                                !(index === timeline.length-1) && <div className='w-[42px] border-dashed border border-[#AFB2BF] rotate-90 top-[80px] order-4 flex-grow absolute bg-gradient-to-r z-10'/>
                                }
                            </div>

                            <div>
                                <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                <p className='text-base'>{element.Description} </p>
                            </div>

                        </div>
                        )
                    })
                 }
            </div>

            {/* Right wala part (Image) */}
            <div className='relative  shadow-blue-200'>
                 <img src={timelineImage} alt='timelineImage' className='shadow-white object-cover h-fit scale-105'/>

                 <div className='absolute bg-caribbeangreen-700  sm:gap-0 flex flex-col sm:flex-row sm:w-fit w-[200px] text-white uppercase py-10  mx-auto inset-x-0 sm:-translate-y-12 -translate-y-20'>
                    <div className='flex gap-5 items-center  border-r-0  sm:border-b-0 sm:border-r pb-4 sm:pb-0 border-b border-caribbeangreen-300 mx-7 sm:mx-0 sm:px-7'>
                        <p className='text-3xl font-bold'>10</p>
                        <p className='text-caribbeangreen-300 text-sm'>Year of Experience</p>
                    </div>
                    <div className='flex gap-5 items-center sm:pt-0 pt-4 mx-7 sm:px-7 sm:mx-0'>
                        <p className='text-3xl font-bold'>250</p>
                        <p className='text-caribbeangreen-300 text-sm'>Type of Courses</p>
                    </div>

                 </div>

            </div>

        </div>
    </div>
  )
}

export default TimelineSection