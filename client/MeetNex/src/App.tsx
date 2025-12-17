import { lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeLayout from "./pages/dashboard/home/HomeLayout";
import Loader from "./components/ui/Loader";
import { MainLayout } from "./components/layout/MainLayout";

// Lazy-loaded pages
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));

function App() {
  return (
    <Router>
      <Suspense
        fallback={
         <Loader/>
        }
      >
        <Routes>
          <Route path="/" element={<HomeLayout />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<MainLayout />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
