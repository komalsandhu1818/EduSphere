import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../services/operations/authAPI';

const LoginForm = ({ }) => {

  const navigate = useNavigate()
  const dispatch = useDispatch()


  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [accountType, setAccountType] = useState("Student")

  function changeHandler(event) {
    // const {type, value, } = event.target

    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    dispatch(login(formData.email, formData.password, navigate))
  }

  return (
    <div>
         {/* student-Instructor tab */}
         {/* <div className='relative border-b flex  px-1 rounded-full bg-richblack-800 z-5 gap-x-1 my-6  max-w-max'>
            <div className={`${accountType==='Instructor'? "translate-x-[112px] ":""} absolute bg-richblack-900 h-4/5 w-1/2 bottom-0 top-0 my-auto py-2 px-4 rounded-full z-10 transition-all duration-500`}></div>
            <button onClick={()=> setAccountType("Student")} className={`${accountType==='Student'? " text-richblack-5":"   bg-transparent text-richblack-200"} m-1 z-10 py-2 px-5 rounded-full transition-all duration-200`}>
                Student
            </button>
            <button  className={`${accountType==='Instructor'? " text-richblack-5":"   bg-transparent text-richblack-200"} z-10 m-1 py-2 px-5 rounded-full transition-all duration-200`} onClick={()=> setAccountType("Instructor")}>
                Instructor
            </button>
        </div> */}
        <form onSubmit={submitHandler} className='flex flex-col w-full gap-y-4 mt-6'>
      <label className='w-full real' htmlFor="">
        <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>
          Email Address <sup className='text-pink-200'>*</sup>
        </p>
        <input
          required
          type="email"
          value={formData.email}
          onChange={changeHandler}
          placeholder="Enter email address"
          name="email"
          className='bg-richblack-800 border-b rounded-[0.5rem]  text-richblack-5 w-full p-[12px]'
        />
      </label>
      <label className='w-full relative' htmlFor="">
        <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>
          Password <sup className='text-pink-200'>*</sup>
        </p>
        <input
          required
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={changeHandler}
          placeholder="Enter password"
          name="password" className='bg-richblack-800 rounded-[0.5rem] border-b  text-richblack-5 w-full p-[12px]'
        />
        <span className='absolute right-3 top-[38px] cursor-pointer' onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"  /> : <AiOutlineEye fontSize={24} fill="#AFB2BF"  />}
        </span>

        <Link to="/forgot-password">
          <p className='text-xs mt-1 text-blue-100 max-w-max ml-auto'>Forgot Password</p>
        </Link>
      </label>

      <button className='bg-yellow-50 rounded-lg font-medium text-richblack-800 px-3 py-2'>Sign In</button>
    </form>
    </div>
  );
};

export default LoginForm;
