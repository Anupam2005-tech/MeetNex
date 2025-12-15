import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const LoginForm = () => {
  return (
    <>
    <SignIn oauthFlow='popup'/>
    </>
  );
};

export default LoginForm;
