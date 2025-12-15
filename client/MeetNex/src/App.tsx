import "./App.css";
import {MainLayout} from "./components/layout/MainLayout";
import Controls from "./components/video/Controls";
import LocalVideo from "./components/video/LocalVideo";
import ScreenShare from "./components/video/ScreenShare";
import HomeLayout from "./pages/dashboard/home/HomeLayout";
import JoinMeetingPage from "./pages/meeting/JoinMeetingPage";




function App() {
  return (
    <>
    <HomeLayout/>
    </>
  );
}

export default App;
