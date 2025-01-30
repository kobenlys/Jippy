import { FC } from 'react';
import Link from "next/link";

const SignupTypeSelection: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div>
        <h2 className="text-2xl mb-6">시작해볼까요?</h2>
      </div>

      <div className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mt-4">
        <button>
          <Link href="/signup/staff">직원 모드</Link>
        </button>
      </div>

      <div className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mt-4">
        <button>
          <Link href="/signup/owner">점주 모드</Link>
        </button>
      </div>

    </div>
  );
};

export default SignupTypeSelection;