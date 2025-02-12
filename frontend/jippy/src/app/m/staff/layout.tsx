"use client";

import "./staff-globals.css"
import BottomNavBar from "@/components/layout/navbar/BottomNavBar"

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen pb-[95px]"> {/* 하단 네비게이션 바 높이만큼 패딩 추가 */}
      <main>
        {children}
      </main>
      <BottomNavBar />
    </div>
  )
}