import "./App.css";
import Approuter from "./routes/router";
import { ClerkProvider } from "@clerk/clerk-react";
import AuthBoundary from "./pages/auth/AuthBoundary";
import JoinMeetingPage from "./pages/meeting/JoinMeetingPage";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <AuthBoundary>
        <Approuter />
        {/* <JoinMeetingPage/> */}
      </AuthBoundary>
    </ClerkProvider>
  );
}

export default App;