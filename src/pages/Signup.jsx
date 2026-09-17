import React from 'react';
import FormTemplate from '../components/core/Auth/FormTemplate';
import Students from '../assets/Images/signup.webp';

const Signup = () => {
  return (
    <div>
      <FormTemplate
        heading={'Join the millions learning to code with StudyNotion for free'}
        subheading={'Build skills for today, tomorrow, and beyond. '}
        rightImage={Students}
        highlight={'Education to future-proof your career.'}
        formtype={'Signup'}
      />
    </div>
  );
};

export default Signup;
