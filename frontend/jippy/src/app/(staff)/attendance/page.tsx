"use client";

import React from "react";
import AttendanceButtons from "@/features/attendance/components/AttendanceButtons";
import PageTitle from "@/features/common/components/layout/title/PageTitle";

const Home = () => {
  return (
    <div className="h-full">
      <PageTitle />
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
};

export default Home;
