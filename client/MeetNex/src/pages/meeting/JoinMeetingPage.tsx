import React from 'react';
import Button from "../../components/ui/Button"; // Adjust path
import { FaVideo } from 'react-icons/fa';
import Dropdown from '../../components/ui/Dropdown'; // Adjust path

const JoinMeetingPage = () => {
  return (
    // Main container uses Grid layout. On large screens (lg), 5-column grid.
    <div className="min-h-screen  bg-gray-50 grid lg:grid-cols-12">

      {/* Video Preview Section (4/5 width on large screens) */}
      <div className="lg:col-span-7 flex flex-col justify-start lg:justify-center items-center p-4 sm:p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-300">
        
        {/* Content wrapper for video and dropdown */}
        <div className="w-full max-w-xl md:max-w-4xl"> 
          
          {/* Video Box */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden flex justify-center items-center shadow-lg">
            <video
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Dropdown under video */}
          <div className="mt-4">
            <Dropdown />
          </div>
        </div>

      </div>

      {/* Join Section (1/5 width on large screens) */}
      <div className="lg:col-span-4 flex flex-col justify-center items-center p-6 sm:p-8">
        <div className="flex flex-col items-center gap-8 text-center w-full max-w-xs">
          <h1 className="font-semibold text-2xl sm:text-3xl lg:text-4xl text-gray-800">
            Ready to join?
          </h1>

          <Button text="Join" icon={FaVideo} />
        </div>
      </div>

    </div>
  );
};

export default JoinMeetingPage;
