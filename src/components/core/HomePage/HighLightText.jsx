import React from 'react'

const HighLightText = ({text}) => {
  return (
    <span className='font-bold text-blue-100  from-[#84abfb] to-[#b5dc92]'>
        {" "}
        {text}
        {" "}
    </span>
  )
}

export default HighLightText