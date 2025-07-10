import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import RegisterForm from "./components/register";
import LoginForm from "./components/login";
import { GridBackgroundDemo } from "./reuseableComponents/grid";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";


const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  }, [location.pathname]);

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={location.pathname}
        
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <PageWrapper>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<GridBackgroundDemo />} />
        </Routes>
      </PageWrapper>
      <LoginForm/>
      <RegisterForm/>

    </BrowserRouter>
  );
}
