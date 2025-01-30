'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignupOwner = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/user/signup/owner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType: 'OWNER',
        }),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      setError('서버와의 연결에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-screen-sm mx-auto bg-white border border-gray-300 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-8 text-center">점주 회원가입</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">이름</label>
              <input
                type="text"
                name="name"
                placeholder="이름을 입력해주세요"
                className="w-full p-2 border rounded bg-gray-50 text-[12px]"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">생년월일</label>
              <input
                type="text"
                name="age"
                placeholder="YYYY-MM-DD"
                className="w-full p-2 border rounded bg-gray-50 text-[12px]"
                value={formData.age}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">이메일</label>
            <input
              type="email"
              name="email"
              placeholder="이메일을 입력해주세요 (ex. jippy@gmail.com)"
              className="w-full p-2 border rounded bg-gray-50 text-[12px]"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력해주세요"
              className="w-full p-2 border rounded bg-gray-50 text-[12px]"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className={`w-full p-3 text-white rounded ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'}`}
            disabled={isLoading}
          >
            {isLoading ? '처리중...' : '가입하기'}
          </button>

          <div className="h-px bg-gray-300 my-6"></div>

          <p className="text-center text-sm">
            계정이 이미 있으신가요?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              로그인
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupOwner;