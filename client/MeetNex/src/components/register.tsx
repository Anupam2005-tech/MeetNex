import React from 'react';
import { useForm } from 'react-hook-form';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import FormInput from '../reuseableComponents/formInput';
import { Link } from 'react-router-dom';
import { Client, Account, OAuthProvider } from 'appwrite';

interface FormData {
  name: string;
  email: string;
  password: string;
}

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('68485ab4000c98b194f8');

const account = new Account(client);

const HoverButton = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
  const radius = 100;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [visible, setVisible] = React.useState(false);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: any) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      style={{
        background: useMotionTemplate`
          radial-gradient(
            ${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
            #3b82f6,
            transparent 80%
          )`
      }}
      className="cursor-pointer relative flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 font-medium text-white dark:text-white dark:border-zinc-800 dark:bg-zinc-600 w-full overflow-hidden"
    >
      {children}
    </motion.button>
  );
};

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
  };

  const handleSocialLogin = async (provider: 'google' | 'github' ) => {
    let oauthProvider;

    switch (provider) {
      case 'google':
        oauthProvider = OAuthProvider.Google;
        break;
      case 'github':
        oauthProvider = OAuthProvider.Github;
        break;
      default:
        return;
    }

    try {
      await account.createOAuth2Session(
        oauthProvider,
        'http://localhost:5173/login',
        'http://localhost:5173/failure'
      );
    } catch (error) {
      console.error(`OAuth login error with ${provider}:`, error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-x-hidden">
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8">
        <div className="text-center max-w-md">
          <h1 className="text-8xl font-bold mb-2">Welcome!</h1>
          <p className="text-lg text-gray-300">Join us and start your journey</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white dark:bg-black p-6">
        <div className="w-full max-w-md shadow-xl  rounded-xl p-6 bg-white dark:bg-zinc-900">
          <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">Create your account</h2>

          <div className="flex flex-col gap-3 mb-6">
            <HoverButton onClick={() => handleSocialLogin('google')}>
              <FaGoogle /> Sign up with Google
            </HoverButton>
            <HoverButton onClick={() => handleSocialLogin('github')}>
              <FaGithub /> Sign up with GitHub
            </HoverButton>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="border-b border-gray-700 flex-grow mr-2" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="border-b border-gray-300 flex-grow ml-2" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              label="Full Name"
              name="name"
              placeholder="John Doe"
              register={register}
              required={true}
              errors={errors}
            />
            <FormInput
              label="Email"
              name="email"
              placeholder="john@example.com"
              type="email"
              register={register}
              required={true}
              errors={errors}
            />
            <FormInput
              label="Password"
              name="password"
              placeholder="••••••••"
              type="password"
              register={register}
              required={true}
              errors={errors}
            />
            <button
              type="submit"
              className="w-full py-2 mt-4 bg-gray-950 text-white font-semibold rounded-md hover:bg-gray-800 transition-all cursor-pointer"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to={'/login'} className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;