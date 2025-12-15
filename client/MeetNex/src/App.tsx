import "./App.css";
import {MainLayout} from "./components/layout/MainLayout";
import LocalVideo from "./components/video/LocalVideo";
import ScreenShare from "./components/video/ScreenShare";
import JoinMeetingPage from "./pages/meeting/JoinMeetingPage";




function App() {
  return (
    <>
    <MainLayout/>
    <JoinMeetingPage/>
    <ScreenShare/>
    </>
  );
}

export default App;
