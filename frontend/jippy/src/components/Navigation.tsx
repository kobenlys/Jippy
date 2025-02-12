import Link from "next/link";

const Navigation = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-5 bg-white shadow-md">
    
      {/* 로고 */}
      <div className="flex items-center space-x-2">
        <span className="text-pink-500 text-2xl font-bold">JIPPY</span>
      </div>

      {/* 네비게이션 메뉴 */}
      <div className="flex">
      <div className="flex items-center space-x-7 px-12 text-gray-700 font-semibold">
        <Link href="/owner/dashboard/sales">
          <span className="hover:text-orange-500 cursor-pointer">매출/분석</span>
        </Link>
        <Link href="/owner/dashboard/products">
          <span className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 cursor-pointer">
            상픔
          </span>
        </Link>
        <Link href="/owner/dashboard/stock">
        <span className="hover:text-orange-500 cursor-pointer">
            재고
          </span>
        </Link>
        <Link href="/owner/dashboard/customers">
          <span className="hover:text-orange-500 cursor-pointer">직원/고객</span>
        </Link>
        <Link href="/owner/dashboard/qrcode">
          <span className="hover:text-orange-500 cursor-pointer">QR코드</span>
        </Link>
      </div>

      {/* 알림 & 프로필 */}
      <div className="flex items-center space-x-4">
        <button className="relative">
          <span className="material-icons text-gray-700"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M4 8a8 8 0 1 1 16 0v4.697l2 3V20h-5.611a4.502 4.502 0 0 1-8.777 0H2v-4.303l2-3zm5.708 12a2.5 2.5 0 0 0 4.584 0zM12 2a6 6 0 0 0-6 6v5.303l-2 3V18h16v-1.697l-2-3V8a6 6 0 0 0-6-6"/></svg></span>
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            9{/* 알림 개수 가져오기 */}
          </span>
        </button>
        <button className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold"> 
          R{/* 유저 정보로 이미지 만들기  */}
        </button>
      </div>
      </div>
    </nav>
  );
};

export default Navigation;
