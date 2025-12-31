import { SignUp } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
import Loader from "../ui/Loader";

const RegisterForm = () => {
  const location = useLocation();
  const redirectUrl = location.state?.from?.pathname || "/home";

  return (
    <SignUp 
      routing="path" 
      path="/register"
      signInUrl="/login" 
      forceRedirectUrl={redirectUrl} 
      fallback={<Loader/>}
    />
  );
};

export default RegisterForm;