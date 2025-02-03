import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function Navbar() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <nav className="p-4 bg-gray-800 text-white">
      {user.accessToken ? (
        <span>환영합니다, {user.email}님!</span>
      ) : (
        <span>로그인해주세요.</span>
      )}
    </nav>
  );
}
