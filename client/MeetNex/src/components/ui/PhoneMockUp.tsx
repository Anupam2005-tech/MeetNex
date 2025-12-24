"use client";
import { ChatSimulator } from "./ChatSimulator";

export function PhoneMockup() {
  return (
    <div className="relative w-full max-w-[280px] aspect-[9/18.5] mx-auto">
      <div className="absolute -inset-10 bg-indigo-100/30 rounded-full blur-[80px] pointer-events-none" />
      <div className="relative w-full h-full bg-white rounded-[2.5rem] border-[8px] border-slate-100 shadow-2xl ring-1 ring-slate-200 overflow-hidden flex flex-col">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-100 rounded-b-2xl z-40" />
        <div className="flex-1 overflow-hidden"><ChatSimulator /></div>
      </div>
    </div>
  );
}