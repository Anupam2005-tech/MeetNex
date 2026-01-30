import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MediaProvider } from './context/MeetingContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { ClerkProvider } from "@clerk/clerk-react";
import  ToastProvider  from './provider/ToastProvider.tsx'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <AuthProvider>
      <MediaProvider>
        <ToastProvider/>
        <App />
      </MediaProvider>
    </AuthProvider>
  </ClerkProvider>
)