import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import CountryCode from "../../data/countrycode.json"

const ContactUsForm = () => {

    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState:{errors,isSubmitSuccessful}
    } = useForm()

    const submitContactForm = async(data) => {
        console.log("Logging data ", data)
        try {
            setLoading(true);
            // const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API,data)
            const response = {status:"OK"}
            console.log("Loggin response", response)
            setLoading(false);
        } catch (error) {
            console.log("Error: ", error.message)
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(isSubmitSuccessful){
            reset({
                 email:"",
                 firstName:"",
                 lastName:"",
                 message:"",
                 phoneNo:"",
            })
        }
    },[reset,isSubmitSuccessful])
    // ! Reset ko bhi rakhenge for

  return (
    <form className='flex flex-col gap-5' onSubmit={handleSubmit(submitContactForm)}>
        <div className='flex gap-5'>
            {/* firstname */}
            <div className='flex flex-col'>
                <label className='text-richblack-5 mb-2' htmlFor='firstname'>First Name</label>
                <input 
                    type='text'
                    name="firstname"
                    id='firstname'
                    className='text-black border-b border-richblack-300 bg-richblack-800  p-2 rounded-md '
                    placeholder='Enter first name'
                    {...register("firstname", {required:true})}
                />
                {
                    errors.firstName && (
                        <span>
                            Enter your First Name
                        </span>
                    )
                }
            </div>

            {/* lastname */}
            <div className='flex flex-col'>
                <label className='text-richblack-5 mb-2' htmlFor='lastname'>Last Name</label>
                <input 
                    type='text'
                    name="lastname"
                    id='lastname'
                    className='text-black border-b border-richblack-300 bg-richblack-800  p-2 rounded-md'
                    placeholder='Enter Last name'
                    {...register("lastname", {required:true})}
                />
                {
                    errors.lastName && (
                        <span>
                            Enter your Last Name
                        </span>
                    )
                }
            </div>

          
        </div>
          {/* Email */}
          <div className='flex flex-col'>
                <label className='text-richblack-5 mb-2' htmlFor='email'>Email Address</label>
                <input 
                    type='email'
                    name='email'
                    id='email'
                    className='text-black border-b border-richblack-300 bg-richblack-800  p-2 rounded-md'
                    placeholder='Enter email address'
                    {...register("email",{required:true})}

                />
                {
                    errors.email && (
                        <span>
                            Enter email address
                        </span>
                    )
                }
            </div>

            {/* Phone No. */}
            <div className='flex flex-col gap-2'>
                <label className='text-richblack-5 mb-2' htmlFor='phone Number' >Phone Number</label>
                <div className='flex  gap-5'>
                    {/* dropdown */}
                    <div >
                        <select  
                            name='dropdown'
                            id='dropdown'
                            className='flex w-[70px] rounded-md p-2 border-b border-richblack-300 bg-richblack-800  text-richblack-300'
                            {...register("countrycode",{required:true})}
                        >
                            {
                                CountryCode.map((element,index) => {
                                    return (
                                        <option className='' key={index} value={element.code}>
                                            {element.code} -{element.country}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    {/* Phone number */}
                    <input 
                        type='number'
                        name='phonenumber'
                        id='phonenumber'
                        placeholder='12345 67890'
                        className='text-black border-b border-richblack-300 bg-richblack-800 w-full rounded-md p-2'
                        {...register("phoneNo",{
                            required:{value:true,message:"Please Enter Phone Number"},
                            maxLength:{value:10,message:"Invalid Phone Number"},
                            minLength:{value:8,message:"Invalid Phone Number"}
                            
                        })}
                    />
                </div>
            </div>

            {/* Message */}
            <div className='flex flex-col'>
                <label className='text-richblack-5 mb-2' htmlFor='message'>Message</label>
                <textarea 
                    name='message'
                    id='message'
                    cols={"30"}
                    rows={"7"}
                    placeholder='Enter your message here'
                    className='text-black border-b border-richblack-300 bg-richblack-800 p-2 rounded-md '
                    {...register("message",{required:true})}
                />
                {
                    errors.message && (
                        <span>
                            Please enter your message
                        </span>
                    )
                }
            </div>
        <button type='submit' className='rounded-md bg-yellow-50 text-center px-6 text-[16px] font-bold text-black py-4'>
            Send Message
        </button>
    </form>
  )
}

export default ContactUsForm