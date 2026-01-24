import { SignIn } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router-dom';

const LoginForm = () => {
  const [searchParams] = useSearchParams();
  
  const redirectUrl = searchParams.get("redirect_url") || "/home";

  return (
    <SignIn 
      routing="path" 
      path="/login" 
      signUpUrl={`/register?redirect_url=${encodeURIComponent(redirectUrl)}`}
      forceRedirectUrl={redirectUrl}
    />
  );
};

export default LoginForm;