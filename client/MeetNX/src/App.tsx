import "./App.css";
import { lazy, Suspense } from "react";
const LandingPage = lazy(() => import("./components/LandingPage"));
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
const UserDashboard=lazy(()=>import("./components/UserDashboard"))

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
