import { AppDispatch } from "@/redux/store";
import { setUser } from "@/redux/userSlice";

const loginUser = async (dispatch: AppDispatch, loginData: LoginResponse) => {
  dispatch(setUser(loginData)); // Redux 상태 업데이트
};

export default loginUser;
