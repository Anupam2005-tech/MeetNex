import React from "react";
import Card from "../../../../components/ui/Card";

function HeroShowcase() {
  return (
    <section className="w-full min-h-screen bg-neutral-50 px-6 md:px-12 py-24">
      {/* Heading */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-5xl md:text-6xl font-semibold mb-6">
          Unmatched collaboration
        </h2>
        <p className="max-w-2xl text-lg text-neutral-600">
          MeetNX brings meetings, scheduling, AI transcription,
          and secure collaboration into one seamless experience.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Row 1 */}
        <Card
          className="md:col-span-1"
          title="Smart Meetings"
          description="High-quality video calls with AI-powered insights."
          imageSrc="/heropic.png"
        />

        <Card
          className="md:col-span-2"
          title="Team Scheduling"
          description="Plan meetings and availability effortlessly."
         imageSrc="/download.png"
        />

        {/* Row 2 */}
        <Card
          className="md:col-span-2"
          title="AI Transcription"
          description="Turn conversations into searchable knowledge."
          imageSrc="/pm.jpg"
        />

        <Card
          className="md:col-span-1"
          title="Secure Sharing"
          description="Privacy-first, ephemeral file sharing."
          imageSrc="/ring.png"
        />
      </div>
    </section>
  );
}

export default HeroShowcase;
