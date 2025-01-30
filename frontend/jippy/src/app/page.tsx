'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const JippyPage = () => {
 const [isLoggedIn, setIsLoggedIn] = useState(false);

 useEffect(() => {
   const token = localStorage.getItem('token');
   setIsLoggedIn(!!token);
 }, []);

 const handleLogout = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('저장된 토큰:', token);
    if (!token) {
      throw new Error('로그인 세션이 만료되었습니다.');
    }

    const response = await fetch('http://localhost:8080/api/user/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('로그아웃 실패');
    }

    localStorage.removeItem('token');
    console.log('로그아웃 성공');
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error);
  }
};


 return (
   <div className="flex flex-col items-center justify-center min-h-screen gap-4">
     <h1 className="text-3xl font-bold mb-8">Jippy</h1>
     
     <div className="flex flex-col gap-4 w-64">
       <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
         <Link href="/signup" className="w-full block">
           계정 생성
         </Link>
       </button>

       {isLoggedIn ? (
         <button 
           onClick={handleLogout}
           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
         >
           로그아웃
         </button>
       ) : (
         <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
           <Link href="/login" className="w-full block">
             로그인
           </Link>
         </button>
       )}
     </div>
   </div>
 );
};

export default JippyPage;