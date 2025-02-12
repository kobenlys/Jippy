import axios from "axios";

// User 인터페이스 추가
interface User {
  email: string;
  name: string;
  age: string;
  // 필요한 다른 필드들 추가
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/user/update/userInfo`;

export const updateUserAPI = async (updatedUser: User, token: string) => {
  try {
    const response = await axios.put(API_URL, updatedUser, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    console.error("사용자 정보 업데이트 실패:", error);
    throw new Error("User update failed");
  }
};