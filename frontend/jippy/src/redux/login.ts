import { AppDispatch } from "@/redux/store";
import { setUserInfo } from "@/redux/slices/userSlice";

const loginUser = async (
  dispatch: AppDispatch, 
  loginData: {
    id: number;
    email: string;
    name: string;
    age: string;
    userType: string;
    accessToken: string;
    refreshToken: string;
  }
) => {       
  dispatch(setUserInfo(loginData)); // Redux 상태 업데이트
};

export default loginUser;