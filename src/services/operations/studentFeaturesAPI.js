import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Images/62cc1d95150d5de9a3dad5fa.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const { studentEndpoints } = require("../apis");


const {COURSE_PAYMENT_API,COURSE_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints

function loadScript(src) {
    return new Promise((resolve)=>{
        const script = document.createElement("script")
        script.src = src;

        script.onload = ()=>{
            resolve(true)
        }
        script.onerror=()=>{
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

export async function buyCourse(token,courses,userDetails,navigate,dispatch) {
    const toastId = toast.loading("Loading...")
    try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

        if(!res){
            toast.error("Razorpay SDK failed to load")
            return;
        }
        console.log("Working till here")

        // ! initiate the order
        const orderResponse = await apiConnector("POST",COURSE_PAYMENT_API,{courses},{
            Authorization:`Bearer ${token}`
        })

        console.log("HERER aloso")
        console.log("PRINTING ORDER RESPONSE>>>>", orderResponse)

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message)
        }

        // ! options
        const options = {
            key: process.env.RAZORPAY_KEY,
            currency: orderResponse.data.data.currency,
            ammount: `${orderResponse.data.data.amount}`,
            order_id: orderResponse.data.data.id,
            name:"StudyNotion",
            description:"Thank you for purchasing the course",
            image:rzpLogo,
            prefill:{
                name:`${userDetails.firstName}`,
                email:userDetails.email
            },
            handler: function (response) {
                // ? send successfull wala mail
                sendSuccessfulPaymentEmail(response,orderResponse.data.data.amount,token)

                // ? verify the payment
                verifyPayment({...response,courses},token,navigate,dispatch)
            }
        }
        //miss hogya tha 
        const paymentObject = new window.Razorpay(options)
        paymentObject.open()
        paymentObject.on("payment.failed",function(response){
            toast.error("oops,payment failed")
            console.log(response.error)
        })


    } catch (error) {
        console.log("PAYMENT API ERROR.....",error)
        toast.error("Could not make payment")
    }
    toast.dismiss(toastId)
}

async function sendSuccessfulPaymentEmail(response,amount,token) {
    try {
        await apiConnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API,{
            orderId:response.razorpay_order_id,
            paymentId:response.razorpay_payment_id,
            amount,
        },{
            Authorization: `Bearer ${token}`
        })
    } catch (error) {
        console.log("PAYMENT EMAIL ERROR....", error)
    }
}

// ! Verify Payment
async function verifyPayment(bodyData,token,navigate,dispatch){
    const toastId = toast.loading("Verifying Payment...")
    dispatch(setPaymentLoading(true))
    try {
        const response = await apiConnector("POST",COURSE_VERIFY_API,bodyData,{
            Authorization: `Bearer ${token}`
        })

        if(!response.data.success){
            throw new Error(response.data.message)
        }

        toast.success("Payment Successfull, you are enrolled to the course")
        navigate("/dashboard/enrolled-courses")
        dispatch(resetCart())

    } catch (error) {
        console.log("PAYMENT VERIFICATION ERROR.....",error)
    }
    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false))
}