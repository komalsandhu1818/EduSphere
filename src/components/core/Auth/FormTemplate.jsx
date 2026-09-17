import React from 'react';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import ImageBack from '../../../assets/Images/ImageBack.png';

const FormTemplate = ({
  rightImage,
  highlight,
  heading,
  subheading,
  formtype,
}) => {
  return (
    <div className="">
      <div className="flex flex-row gap-10 w-10/12 mx-auto max-w-maxContent h-screen items-center text-white justify-evenly ">
        {/* Left wala section */}
        <div className="flex flex-col gap-5 justify-start w-[40%] ">
          <h2 className="text-3xl font-semibold text-start text-richblack-5">
            {heading}
          </h2>
          <p className="text-lg text-richblack-100">
            {subheading}
            <span className="text-[#47A5C5] font-edu-sa leading-6 text-[16px] italic"> 
              {highlight}
            </span>
          </p>

          {formtype === 'Signup' ? <SignupForm /> : <LoginForm />}
        </div>
        {/* Right wali image */}
        <div className="w-[558px] h-[504px] relative">
          <img
            src={rightImage}
            alt=""
            className="object-contain absolute z-20"
          />
          <img src={ImageBack} alt="" className="absolute inset-5 z-10" />
        </div>
      </div>
    </div>
  );
};

export default FormTemplate;
