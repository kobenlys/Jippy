import React from "react"
import Link from "next/link"

const BottomNavBar: React.FC = () => {
  const navItems = [
    { icon: "🏠", label: "메인", href: "/staff" },
    { icon: "📢", label: "공지사항", href: "/notifications" },
    { icon: "📅", label: "일정", href: "/schedule" },
    { icon: "💬", label: "피드백", href: "/feedback" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white h-[95px] rounded-t-[20px] flex justify-around items-center">
      {navItems.map((item, index) => (
        <Link 
          key={index} 
          href={item.href} 
          className="flex flex-col items-center justify-center"
        >
          <div className="text-2xl mb-1">{item.icon}</div>
          <span className="text-orange text-[15px] font-semibold">{item.label}</span>
        </Link>
      ))}
    </div>
  )
}

export default BottomNavBar