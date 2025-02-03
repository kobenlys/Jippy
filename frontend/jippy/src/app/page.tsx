'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import '@/app/globals.css';
import styles from "./page.module.css";
import Button from '@/component/Button';

const JippyPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 페이지 로드 시 로그인 상태 체크
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // 로그아웃 처리
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
      setIsLoggedIn(false);  // 로그아웃 후 상태 업데이트
      console.log('로그아웃 성공');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  // 로그인 상태에 따라 버튼 텍스트 변경
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className={styles.title}>Jippy</h1>
      
      <div className="flex flex-col gap-4 w-64">
        <Button type="orange">
          <Link href="/signup" className="w-full block">
            계정 생성
          </Link>
        </Button>

        {isLoggedIn ? (
          <Button type="orange" onClick={handleLogout}>로그아웃</Button>
        ) : (
          <Button type="orange-border">
            <Link href="/login" className="w-full block">
              로그인
            </Link>
          </Button>
        )}

        <Button type="primary">
          <Link href="/update" className="w-full block">
            회원 정보 수정
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default JippyPage;
