import "./App.css";
import Approuter from "./routes/router";
import AuthBoundary from "./pages/auth/AuthBoundary";
import LenisProvider from "./provider/LenisProvider";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { MediaProvider } from "./context/MeetingContext";


function App() {
  return (
    <LenisProvider>
      <AuthProvider>
        <SocketProvider>
          <MediaProvider>
              <AuthBoundary>
                <Approuter />
              </AuthBoundary>
          </MediaProvider>
        </SocketProvider>
      </AuthProvider>
    </LenisProvider>
  );
}

export default App;
