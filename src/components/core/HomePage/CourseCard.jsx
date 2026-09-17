import React from 'react'

const CourseCard = ({cardData,currentCard,setCurrentCard}) => {

    const active = cardData.heading === currentCard

  return (
    <div  onClick={()=>{setCurrentCard(cardData.heading)}} className={`w-[342px] px-6 pt-8 pb-4 flex flex-col gap-5 ${active? "bg-white shadow-[12px_12px_0px_0px_rgba(109,40,217)]": "bg-richblack-800"} transition-all duration-300`}>
        <h2 className={`font-semibold text-xl  ${active? "text-richblack-800": "text-richblack-25"} `}>{cardData.heading}</h2>
        <p className={`text-base text-richblack-400 mb-16 ${active? "text-richblack-500": "text-richblack-400 "}`}>{cardData.description}</p>
        <div className={`w-[77%] overflow-hidden mx-auto scale-x-150 h-0 border-dashed border  ${active? "border-richblack-50": "border-richblack-600"}`} />
        <div className={`flex justify-between  font-medium ${active? "text-blue-500": "text-richblack-300"}`}>

            <div className='flex gap-2 items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" />
                </svg>


                <div>{cardData.level}</div>
            </div>
            <div className='flex gap-2 items-center relative'>
                <i className="fi fi-sr-chart-tree absolute -left-6 top-[2px]"/>
                <div>{cardData.lessionNumber} lessons</div>
            </div>


        </div>
    </div>
  )
}

export default CourseCard