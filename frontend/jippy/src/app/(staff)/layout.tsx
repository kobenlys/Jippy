"use client";

import "./globals.css";
import BottomNavBar from "@/components/layout/navbar/BottomNavBar";

const StaffLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-auto">{children}</main>
      <div className="h-[95px]">
        <BottomNavBar />
      </div>
    </div>
  );
};

export default StaffLayout;
