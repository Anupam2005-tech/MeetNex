import "./App.css";
import Approuter from "./routes/router";
import AuthBoundary from "./pages/auth/AuthBoundary";
import LenisProvider from "./provider/LenisProvider";
import { SocketProvider } from "./context/SocketContext";
import { ChatProvider } from "./context/ChatContext";


function App() {
  return (
    <LenisProvider>
      <SocketProvider>
        <ChatProvider>
          <AuthBoundary>
            <Approuter />
          </AuthBoundary>
        </ChatProvider>
      </SocketProvider>
    </LenisProvider>
  );
}

export default App;
