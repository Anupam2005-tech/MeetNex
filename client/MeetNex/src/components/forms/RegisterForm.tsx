import { SignUp } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";

const RegisterForm = () => {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/home";

  return (
    <SignUp 
      routing="path" 
      path="/register"
      signInUrl={`/login?redirect_url=${encodeURIComponent(redirectUrl)}`}
      forceRedirectUrl={redirectUrl} 
    />
  );
};

export default RegisterForm;