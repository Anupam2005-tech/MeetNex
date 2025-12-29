import { SignIn } from '@clerk/clerk-react';
import Loader from '../ui/Loader';

const LoginForm = () => {
  return (
    <>
    <SignIn oauthFlow='popup' fallback={<Loader/>} fallbackRedirectUrl={'/home'}/>
    </>
  );
};

export default LoginForm;
