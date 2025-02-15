"use client";

import React from "react";
import AttendanceButtons from "@/features/attendance/components/AttendanceButtons";
import PageTitle from "@/features/common/components/layout/title/PageTitle";
import useUserName from "@/features/common/hooks/useUserName";

const Home = () => {
  const userName = useUserName();

  // 실제 사용자와 매장 정보 가져온 후 수정
  const storeId = 1;
  const staffId = 4;

  return (
    <div className="h-full">
      <PageTitle />
      <div className="text-center mt-[139px]">
        <h1 className="text-[24px] font-bold text-black">
          안녕하세요, {userName || "사용자"}님!
          <br />
          오늘도 파이팅하세요🍀
        </h1>
      </div>

      <br />
      <AttendanceButtons storeId={storeId} staffId={staffId} />
    </div>
  );
};

export default Home;
