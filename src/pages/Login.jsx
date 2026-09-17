import React from 'react';
import FormTemplate from '../components/core/Auth/FormTemplate';
import GirlStudent from '../assets/Images/login.png';

const Login = () => {
  return (
    <div>
      <FormTemplate
        heading={'Welcome Back'}
        subheading={'Build skills for today, tomorrow, and beyond. '}
        highlight={'Education to future-proof your career.'}
        rightImage={GirlStudent}
      />
    </div>
  );
};

export default Login;
