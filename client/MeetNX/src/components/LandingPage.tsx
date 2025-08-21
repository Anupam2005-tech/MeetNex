import { lazy } from "react";
import { SpotlightText } from "../reuseable Components/SpotlightText";
const Navbar = lazy(() => import("../reuseable Components/Navbar"));
const Footer = lazy(() => import("../reuseable Components/Footer"));
const LandingPage = () => {
  return (
    <>
      <div>
        <Navbar />
      </div>

      <div>
        <SpotlightText />

      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
