import "./App.css";
import Approuter from "./routes/router";
import AuthBoundary from "./pages/auth/AuthBoundary";
import LenisProvider from "./provider/LenisProvider";


function App() {
  return (

    <LenisProvider>
      <AuthBoundary>
        <Approuter />
      </AuthBoundary>
    </LenisProvider>

  );
}

export default App;
