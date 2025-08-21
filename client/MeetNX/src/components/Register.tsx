import React from "react";
import { Link } from "react-router-dom";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { cn } from "../lib/Utils";
import {
  IconBrandGoogle,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import {
  createOAuth2Session,
} from "../appwrite/Appwrite";
import { OAuthProvider } from "appwrite";
import {InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator} from '../ui/OTPinput'
import {type AppDispatch,type RootState} from '../redux/Store'
import {useDispatch,useSelector} from 'react-redux'
import { setButtonDisabled, setOtpSent } from "../redux/AuthSlice";

export function Register() {

  const handleOAuthLogin = (provider: OAuthProvider) => {
    const successUrl = import.meta.env.VITE_SUCCESS_URL as string || "http://localhost:5173/login";
    const failureUrl = import.meta.env.VITE_FAILURE_URL as string || "http://localhost:5173/register";
    createOAuth2Session(provider, successUrl, failureUrl);
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      {/* Background Gradient (Purple / Dark Gray) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1b0a2f] via-[#241332] to-[#1a1a1a]"
        style={{
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
        }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-tr from-black via-[#0d0d0d] to-[#241332]"
        style={{
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
        }}
      />

      {/* Form Content */}
      <div className="relative z-10 flex flex-1 items-center justify-center p-8">
        <div className="shadow-2xl w-full max-w-md rounded-2xl p-8 bg-[#0f0a14]/80 backdrop-blur-md border border-[#2d1f3d]">
          <h2 className="text-3xl font-bold text-center mb-6 text-white">
            Create Your Account
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Join us today and unlock the full experience 🚀
          </p>

          <form className="mb-6">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="fullname" className="text-gray-300">
                Full Name
              </Label>
              <Input
                id="fullname"
                placeholder="John Doe"
                type="text"
                className="bg-[#241332]/50 text-white placeholder-gray-400 border-gray-600 focus:border-purple-500"
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="email" className="text-gray-300">
                Email Address
              </Label>
              <Input
                id="email"
                placeholder="you@example.com"
                type="email"
                className="bg-[#241332]/50 text-white placeholder-gray-400 border-gray-600 focus:border-purple-500"
              />
            </LabelInputContainer>

            <button
              className="group/btn cursor-pointer relative block h-11 w-full rounded-lg bg-gradient-to-br from-purple-800 to-black font-medium text-white shadow-md hover:shadow-lg transition"
              type="submit"
            >
              Register ✨
              <BottomGradient />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 h-[1px] w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent" />

          {/* Social Logins */}
          <div className="flex flex-col space-y-4">
            <SocialButton
              icon={<IconBrandGoogle size={18} />}
              label="Sign up with Google"
              onClick={() => handleOAuthLogin(OAuthProvider.Google)}
            />
            <SocialButton
              icon={<IconBrandLinkedin size={18} />}
              label="Sign up with LinkedIn"
              onClick={() => handleOAuthLogin(OAuthProvider.Linkedin)}
            />
          </div>
          {/* Redirect to Login */}
          <p className="text-center text-sm text-gray-400 mb-2 mt-6">
            Already have an account?{" "}
            <Link to={'/login'}
              className="text-purple-400 hover:text-fuchsia-400 font-medium transition"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const SocialButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <button
    className="group/btn shadow-md relative flex h-10 w-full items-center justify-center gap-3 rounded-md bg-[#1a1226]/80 px-4 font-medium text-white border border-gray-700 hover:bg-[#241332]/90 transition cursor-pointer"
    type="button"
    onClick={onClick}
  >
    <span className="flex items-center text-gray-200">{icon}</span>
    <span className="text-sm font-medium text-gray-300">{label}</span>
    <BottomGradient />
  </button>
);

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
