"use client";

import React from "react";
import AttendanceButtons from "@/features/attendance/components/AttendanceButtons";

export default function Home() {
  return (
    <div className="bg-bg-gray min-h-screen relative">
      <header className="p-4 flex items-center">
        <h1 className="text-[24px] font-archivo text-[#F27B39]">Jippy</h1>
      </header>

      <div className="text-center mt-[139px]">
        <h1 className="text-[24px] font-bold text-black">
          안녕하세요, 사용자님!
          <br />
          오늘도 파이팅하세요🍀
        </h1>
      </div>
      
      <br />
      <AttendanceButtons />
    </div>
  );
}