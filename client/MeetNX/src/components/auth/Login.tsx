import React, { useState } from "react";
import { Label } from "../../ui/Label";
import { Input } from "../../ui/Input";
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
} from "../../ui/OTPinput";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

// Login Component
export function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const { buttonDisabled, otpSent } = useSelector(
    (state: RootState) => state.auth
  );

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  // OAuth Login
  const handleOAuthLogin = (provider: OAuthProvider) => {
    const successUrl = import.meta.env.VITE_SUCCESS_URL as string;
    const failureUrl = import.meta.env.VITE_FAILURE_URL as string;
    createOAuth2Session(provider, successUrl, failureUrl);
  };

  // Step 1: Send OTP
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setButtonDisabled(true));
    try {
      const token = await createEmailTokenForLogin(email);
      setUserId(token.userId);
      dispatch(setOtpSent(true));
      toast("OTP sent to your email!", {
        style:{
          backgroundColor: "#0f0a14", // your base black overlay
          border: "1px solid #2d1f3d", // subtle purple-gray border
          color: "#e5e5e5", // light gray text for readability
          fontWeight: 900,
          borderRadius: "0.75rem", // rounded for elegance
          padding: "12px 16px",
        }
      });
    } catch (err: any) {
      toast(err.message || "Something went wrong!", {
        style:{
          backgroundColor: "#0f0a14", // your base black overlay
          border: "1px solid #2d1f3d", // subtle purple-gray border
          color: "#e5e5e5", // light gray text for readability
          fontWeight: 900,
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
      toast("Login successful ", {
        style:{
          backgroundColor: "#0f0a14", // your base black overlay
          border: "1px solid #2d1f3d", // subtle purple-gray border
          color: "#e5e5e5", // light gray text for readability
          fontWeight: 900,
          borderRadius: "0.75rem", // rounded for elegance
          padding: "12px 16px",
        }
      });
      navigate("/dashboard");
    } catch (err: any) {
      toast("Invalid OTP. Please try again.", {
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
        className="absolute inset-0 bg-gradient-to-br from-[#0a192f] via-[#031326] to-[#04183c]"
        style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-tr from-black via-[#0d0d0d] to-[#112240]"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-1 items-center justify-center p-8">
        <div className="shadow-2xl w-full max-w-md rounded-2xl p-8 bg-[#0f0a14]/80 backdrop-blur-md border border-[#1f2a3d]">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white tracking-wide">
              Welcome Back 👋
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Please login to continue your journey
            </p>
          </div>

          {/* Step 1: Email form */}
          {!otpSent && (
            <form className="mb-6" onSubmit={handleLogin}>
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
                  className="bg-[#0a192f]/50 text-white placeholder-gray-400 border-gray-600 focus:border-blue-500"
                  required
                />
              </LabelInputContainer>

              <button
                className={`group/btn cursor-pointer relative block h-11 w-full rounded-lg font-medium text-white shadow-md transition
                  ${
                    buttonDisabled
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-br from-blue-900 to-black hover:shadow-lg"
                  }`}
                type="submit"
                disabled={buttonDisabled}
              >
                {buttonDisabled ? "Please wait..." : "Send OTP"}
                <BottomGradient />
              </button>
            </form>
          )}

          {/* Step 2: OTP Input */}
          {otpSent && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[0, 1, 2].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-10 h-12 text-center text-white text-lg bg-[#112240]/70 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                      />
                    ))}
                  </InputOTPGroup>

                  <InputOTPSeparator />

                  <InputOTPGroup>
                    {[3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-10 h-12 text-center text-white text-lg bg-[#112240]/70 border border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Label className="text-green-600 text-sm">
                Enter the 6-digit OTP sent to your email.
              </Label>
              <button
                onClick={handleVerifyOtp}
                className={`group/btn relative block h-11 w-full rounded-lg font-medium text-white shadow-md transition ${
                  otp.length !== 6
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-br from-blue-900 to-black hover:shadow-lg"
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
              label="Continue with Google"
              onClick={() => handleOAuthLogin(OAuthProvider.Google)}
            />
            <SocialButton
              icon={<IconBrandLinkedin size={18} />}
              label="Continue with LinkedIn"
              onClick={() => handleOAuthLogin(OAuthProvider.Linkedin)}
            />
          </div>

          {/* Redirect */}
          <p className="text-center text-gray-400 text-sm mb-4 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:underline hover:text-blue-300 transition"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* Helpers */
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
    className="group/btn cursor-pointer shadow-md relative flex h-10 w-full items-center justify-center gap-3 rounded-md bg-[#0f1a2b]/80 px-4 font-medium text-white border border-gray-700 hover:bg-[#112240]/90 transition"
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
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
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

