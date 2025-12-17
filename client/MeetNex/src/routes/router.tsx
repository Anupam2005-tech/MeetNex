import { MainLayout } from "@/components/layout/MainLayout";
import Settings from "@/components/layout/Settings";
import Loader from "@/components/ui/Loader";
import HomeLayout from "@/pages/dashboard/home/HomeLayout";
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// lazy load

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));

function Approuter() {
  return (
    <>
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
          <Route path="/settings" element={<Settings/>}/>
        </Routes>
      </Suspense>
    </Router>
    </>
  )
}

export default Approuter