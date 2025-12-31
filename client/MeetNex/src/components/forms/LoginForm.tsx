import { SignIn } from '@clerk/clerk-react';
import Loader from '../ui/Loader';

const LoginForm = () => {
  return (
    <SignIn 
      routing="path" 
      path="/login" // Tell Clerk this component is mounted on /login
      signUpUrl="/register"
      fallbackRedirectUrl="/home"
      forceRedirectUrl="/home"
      fallback={<Loader/>}
    />
  );
};

export default LoginForm;
