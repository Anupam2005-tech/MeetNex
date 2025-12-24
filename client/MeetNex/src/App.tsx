import "./App.css";
import Approuter from "./routes/router";
import { ClerkProvider } from "@clerk/clerk-react";
import AuthBoundary from "./pages/auth/AuthBoundary";
import LenisProvider from "./provider/LenisProvider";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <LenisProvider>
        <AuthBoundary>
          <Approuter />
        </AuthBoundary>
      </LenisProvider>
    </ClerkProvider>
  );
}

export default App;
