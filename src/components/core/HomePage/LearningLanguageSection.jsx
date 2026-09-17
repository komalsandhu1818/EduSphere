import React from 'react'
import HighLightText from './HighLightText'
import Compare_with_others from '../../../assets/Images/Compare_with_others.png';
import Know_your_progress from '../../../assets/Images/Know_your_progress.png';
import Plan_your_lessons from '../../../assets/Images/Plan_your_lessons.png';
import CTAButton from './Button';

const LearningLanguageSection = () => {
  return (
    <div className='mt-[130px] mb-32'>
        <div className='flex flex-col gap-5 items-center'>
            {/* Heading */}
            <div className='text-4xl font-semibold text-center'>
              Your Swiss Knife for
              <HighLightText text={"learning any language"} />
            </div>

            {/* Sub-Heading */}
            <div className='sm:text-center  text-richblack-600 mx-auto text-base font-medium sm:w-[70%]'>
              Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
            </div>

            {/* Images */}
            <div className='flex flex-row flex-wrap items-center justify-center mt-5'>
              <img 
                src={Know_your_progress}
                alt='know your progress'
                className='object-contain min-[874px]:-mr-32'
              />
              <img 
                src={Compare_with_others}
                alt='compare with others'
                className='object-contain '
              />
              <img 
                src={Plan_your_lessons}
                alt='plan your lessons'
                className='object-contain min-[1277px]:-ml-32'
              />

            </div>

            {/* CTAButton */}
            <div className='w-fit'>
              <CTAButton active={true} linkto={"/signup"} >
                  Learn More
              </CTAButton>
            </div>
        </div>
    </div>
  )
}

export default LearningLanguageSection