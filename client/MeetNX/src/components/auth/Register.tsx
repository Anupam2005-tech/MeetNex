import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Label } from "../../reuseable Components/ui/Label";
import { Input } from "../../reuseable Components/ui/Input";
import { cn } from "../../lib/Utils";
import { IconBrandGoogle, IconBrandLinkedin } from "@tabler/icons-react";
import {
  createOAuth2Session,
  createEmailTokenForLogin,
  completeEmailSession,
} from "../../appwrite/Appwrite";
import { OAuthProvider } from "appwrite";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../../redux/Store";
import { setButtonDisabled, setOtpSent } from "../../redux/AuthSlice";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../reuseable Components/ui/OTPinput";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"

export function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const { buttonDisabled, otpSent } = useSelector(
    (state: RootState) => state.auth
  );

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const navigate=useNavigate()

  const handleOAuthLogin = (provider: OAuthProvider) => {
    const successUrl =
      (import.meta.env.VITE_SUCCESS_URL as string)
    const failureUrl =
      (import.meta.env.VITE_FAILURE_URL as string) 
    createOAuth2Session(provider, successUrl, failureUrl);
  };

  // Step 1: Send OTP
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setButtonDisabled(true));
    try {
      const token = await createEmailTokenForLogin(email); // <-- appwrite call
      setUserId(token.userId); // save returned userId
      dispatch(setOtpSent(true));
    } catch (err:any) {
      toast(err,{
        style:{
          backgroundColor: "#0f0a14", // your base black overlay
          border: "1px solid #2d1f3d", // subtle purple-gray border
          color: "#e5e5e5", // light gray text for readability
          fontWeight: 500,
          borderRadius: "0.75rem", // rounded for elegance
          padding: "12px 16px",

        }
      });
    } finally {
      dispatch(setButtonDisabled(false));
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    try {
 await completeEmailSession(userId, otp);
      toast("User verified successfully",{
        style:{
          backgroundColor: "#0f0a14", // your base black overlay
          border: "1px solid #2d1f3d", // subtle purple-gray border
          color: "#e5e5e5", // light gray text for readability
          fontWeight: 500,
          borderRadius: "0.75rem", // rounded for elegance
          padding: "12px 16px",

        }
      });
      navigate("/login")

    } catch (err) {
      toast("Invalid OTP. Please try again.",{
        style:{
          backgroundColor: "#0f0a14", // your base black overlay
          border: "1px solid #2d1f3d", // subtle purple-gray border
          color: "#e5e5e5", // light gray text for readability
          fontWeight: 900,
          borderRadius: "0.75rem", // rounded for elegance
          padding: "12px 16px",
        }
      });
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1b0a2f] via-[#241332] to-[#1a1a1a]"
        style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-tr from-black via-[#0d0d0d] to-[#241332]"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
      />

      {/* Form Content */}
      <div className="relative z-10 flex flex-1 items-center justify-center p-8">
        <div className="shadow-2xl w-full max-w-md rounded-2xl p-8 bg-[#0f0a14]/80 backdrop-blur-md border border-[#2d1f3d]">
          <h2 className="text-3xl font-bold text-center mb-6 text-white">
            Create Your Account
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Join us today and unlock the full experience 
          </p>

          {/* Step 1: Email input */}
          {!otpSent && (
            <form className="mb-6" onSubmit={handleRegister}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email" className="text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#241332]/50 text-white placeholder-gray-400 border-gray-600 focus:border-purple-500"
                  required
                />
              </LabelInputContainer>

              <button
                className={`group/btn cursor-pointer relative block h-11 w-full rounded-lg font-medium text-white shadow-md transition
                  ${
                    buttonDisabled
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-br from-purple-800 to-black hover:shadow-lg"
                  }`}
                type="submit"
                disabled={buttonDisabled}
              >
                {buttonDisabled ? "Please wait..." : "Send OTP "}
                <BottomGradient />
              </button>
            </form>
          )}

          {/* Step 2: OTP Section */}
          {otpSent && (
            <div className="space-y-4 mb-6">

              <div className="flex items-center justify-center"><InputOTP
  maxLength={6}
  value={otp}
  onChange={(val) => setOtp(val)}
>
  <InputOTPGroup>
    <InputOTPSlot
      index={0}
      className="w-10 h-12 text-center text-white text-lg bg-[#241332]/70 border border-gray-600 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
    />
    <InputOTPSlot
      index={1}
      className="w-10 h-12 text-center text-white text-lg bg-[#241332]/70 border border-gray-600 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
    />
    <InputOTPSlot
      index={2}
      className="w-10 h-12 text-center text-white text-lg bg-[#241332]/70 border border-gray-600 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
    />
  </InputOTPGroup>

  <InputOTPSeparator />

  <InputOTPGroup>
    <InputOTPSlot
      index={3}
      className="w-10 h-12 text-center text-white text-lg bg-[#241332]/70 border border-gray-600 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
    />
    <InputOTPSlot
      index={4}
      className="w-10 h-12 text-center text-white text-lg bg-[#241332]/70 border border-gray-600 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
    />
    <InputOTPSlot
      index={5}
      className="w-10 h-12 text-center text-white text-lg bg-[#241332]/70 border border-gray-600 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
    />
  </InputOTPGroup>
</InputOTP>
</div>
              
              <Label htmlFor="otp" className="text-green-600 text-sm">
                Enter the 6-digit OTP sent to your email.
              </Label>
              <button
                onClick={handleVerifyOtp}
                className={`group/btn relative block h-11 w-full rounded-lg font-medium text-white shadow-md transition ${
                  otp.length !== 6
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-br from-purple-800 to-black hover:shadow-lg"
                }`}
                disabled={otp.length !== 6}
              >
                Verify OTP 
                <BottomGradient />
              </button>
            </div>
          )}

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
          <p className="text-center text-sm text-gray-400 mb-2 mt-6">
            Already have an account?{" "}
            <Link
              to={"/login"}
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

// Reusable components

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

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
