import axios from 'axios';
import { UserState } from './userSlice';
import { setUserInfo } from './userSlice';
import { AppDispatch } from '../store'; // Redux store의 dispatch 타입

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/user/update/userInfo`; // 실제 API 엔드포인트로 수정

export const updateUserAPI = async (updatedUser: User, token: string) => {
  try {
    const response = await axios.put(API_URL, updatedUser, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('User update failed');
  }
};

