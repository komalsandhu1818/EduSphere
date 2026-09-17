import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CountryCode from '../../../data/countrycode.json';
import { setSignupData } from '../../../slices/authSlice';
import { sendOtp } from '../../../services/operations/authAPI';
import { useDispatch } from 'react-redux';

const SignupForm = ({}) => {

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        confirmPassword:"",
        phone:""
    });

    // console.log(CountryCode)

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false)

    const [accountType, setAccountType] = useState("Student")

    function changeHandler(event) {
        // const {type, value, } = event.target
    
        setFormData((prevData) => ({
          ...prevData,
          [event.target.name]: event.target.value,
        }));
      }

    function submitHandler(event) {
        event.preventDefault()
        if(formData.password!== formData.confirmPassword){
            toast.error("Passwords do not match")
            return;
        }
        const accountData = {
            ...formData
        }

        const signupData = {
            ...accountData,
            accountType,
            
        }

        console.log(signupData)

        // Setting signup data to state
    // To be used after otp verification
    dispatch(setSignupData(signupData))
    // Send OTP to user for verification
    dispatch(sendOtp(signupData.email, navigate))
    

        // navigate("/dashboard")
    }

  return (
    <div>
        {/* student-Instructor tab */}
        <div className='relative border-b flex  px-1 rounded-full bg-richblack-800 z-5 gap-x-1 my-6  max-w-max'>
            <div className={`${accountType==='Instructor'? "translate-x-[112px] ":""} absolute bg-richblack-900 h-4/5 w-1/2 bottom-0 top-0 my-auto py-2 px-4 rounded-full z-10 transition-all duration-500`}></div>
            <button onClick={()=> setAccountType("Student")} className={`${accountType==='Student'? " text-richblack-5":"   bg-transparent text-richblack-200"} m-1 z-10 py-2 px-5 rounded-full transition-all duration-200`}>
                Student
            </button>
            <button  className={`${accountType==='Instructor'? " text-richblack-5":"   bg-transparent text-richblack-200"} z-10 m-1 py-2 px-5 rounded-full transition-all duration-200`} onClick={()=> setAccountType("Instructor")}>
                Instructor
            </button>
        </div>

        <form onSubmit={submitHandler}>
        {/* firstName and lastName */}
        <div className='flex gap-x-4 mb-3  '>

            <label className='w-full text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>
                <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>First Name <sup className='text-pink-200'>*</sup></p>
                <input
                    required
                    type={"text"}
                    name="firstName"
                    onChange={changeHandler}
                    placeholder="Enter your First Name"
                    value={formData.firstName}
                    className='bg-richblack-800 rounded-[0.5rem]  text-richblack-5 w-full p-[12px] border-b'
                />
            </label>
            <label className='w-full text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>
                <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>Last Name <sup className='text-pink-200'>*</sup></p>
                <input
                    required
                    type={"text"}
                    name="lastName"
                    onChange={changeHandler}
                    placeholder="Enter your Last Name"
                    value={formData.lastName}
                    className='bg-richblack-800 rounded-[0.5rem]  text-richblack-5 w-full p-[12px] border-b'
                />
            </label>
        </div>
        {/* EMAIL Address */}
        <label className='my-3  text-[0.875rem] text-richblack-5 mb-5 leading-[1.375rem]'>
                <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>Email Address <sup className='text-pink-200'>*</sup></p>
                <input
                    required
                    type={"email"}
                    name="email"
                    onChange={changeHandler}
                    placeholder="Enter Email Address"
                    value={formData.email}
                    className='bg-richblack-800 rounded-[0.5rem]  text-richblack-5 w-full p-[12px] border-b'
                />
        </label>
        {/* Phone number */}
        <label className='my-4 text-[0.875rem] text-richblack-5 mb-3 leading-[1.375rem]'>
                <p className='text-[0.875rem] text-richblack-5 mb-1 mt-3 leading-[1.375rem]'>Phone Number<sup className='text-pink-200'>*</sup></p>
                <div className='flex gap-4'>
                <select
                    
                    name=""
                    onChange={changeHandler}
                    placeholder={"hi"}
                    className='bg-richblack-800 rounded-[0.5rem] w-[25%] text-richblack-5 p-[12px] border-b'
                >
                    {
                        CountryCode.map((Country,index) => {
                            return (
                              Country.country ==="India"?  <option key={index} label={Country.country} value={Country.code} selected>
                                    {`${Country.code} ${Country.country}`}
                                </option>
                                :
                                <option key={index} label={Country.country} value={Country.country} className='bg-blue-100' >
                                    {`${Country.code} ${Country.country}`}
                                </option>
                            )
                        })
                    }
                </select>
                <input
                    required
                    type={"number"}
                    name="phone"
                    onChange={changeHandler}
                    placeholder="12345 67890"
                    value={formData.phone}
                    className='bg-richblack-800 rounded-[0.5rem]  text-richblack-5 w-full p-[12px] border-b'
                />

                </div>
        </label>
        {/* CREATE Password AND confirmPassword */}
        <div className='flex gap-x-4 my-3'>
            <label className='w-full relative text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>
                    <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>Create Password<sup className='text-pink-200'>  *</sup></p>
                    <input
                        required
                        type={showPassword?("text"):("password")}
                        name="password"
                        onChange={changeHandler}
                        placeholder="Enter Password"
                        value={formData.password}
                        className='bg-richblack-800 rounded-[0.5rem]  border-b text-richblack-5 w-full p-[12px]'
                    />
                    <span className='absolute right-3 top-[38px] cursor-pointer transition-all duration-500' onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/> : <AiOutlineEye fontSize={24} fill="#AFB2BF"/>}
                    </span>
                </label>
            <label className='w-full relative text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>
                    <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>Confirm Password<sup className='text-pink-200'>*</sup></p>
                    <input
                        required
                        type={showConfirm?("text"):("password")}
                        name="confirmPassword"
                        onChange={changeHandler}
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        className='bg-richblack-800 rounded-[0.5rem] border-b text-richblack-5 w-full p-[12px]'
                    />
                    <span className='absolute right-3 top-[38px] cursor-pointer' onClick={() => setShowConfirm((prev) => !prev)}>
                    {showConfirm ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" /> : <AiOutlineEye fontSize={24} fill="#AFB2BF"/>}
                    </span>
                </label>
        </div>

        <button className='w-full bg-yellow-50 rounded-lg font-medium text-richblack-800 mt-3 px-3 py-2'>
            Create Account
        </button>




        </form>
    </div>
  )
}

export default SignupForm