"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/userSlice"; // import 수정
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: RootState) => state.user);
  const username = user?.profile?.name || "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      if (!accessToken) {
        throw new Error("로그인 세션이 만료되었습니다.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("로그아웃 실패");
      }

      dispatch(logout()); // 단일 액션으로 변경

      setIsDropdownOpen(false);
      router.push("/");
      alert("성공적으로 로그아웃되었습니다.");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      alert(
        error instanceof Error
          ? error.message
          : "로그아웃 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.logo}>
            <Link href="/confirm" className={styles.logoText}>
              Jippy
            </Link>
          </div>

          <div className={styles.desktopMenu}>
            <div className={styles.navLinks}>
              <Link href="/owner/dashboard/sale" className={styles.navLink}>
                매출
              </Link>
              <Link href="/owner/dashboard/product" className={styles.navLink}>
                상품
              </Link>
              <Link href="/owner/dashboard/stock" className={styles.navLink}>
                재고
              </Link>
              <Link href="/owner/dashboard/staff" className={styles.navLink}>
                직원
              </Link>
              <Link href="/owner/dashboard/customer" className={styles.navLink}>
                고객
              </Link>
              <Link href="/owner/dashboard/qr" className={styles.navLink}>
                QR 관리
              </Link>
            </div>

            <Link href="/qr" className={styles.qrButton}>
              <Image
                src="/images/NavbarQR.svg"
                alt="QR Code"
                fill
                className={styles.qrImage}
              />
            </Link>

            {accessToken ? (
              <div className={styles.profileDropdown} ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={styles.profileButton}
                >
                  <span>{username ? `${username} 님` : "사용자"}</span>
                  <ChevronDown className={styles.dropdownIcon} />
                </button>

                {isDropdownOpen && (
                  <div className={styles.dropdownContent}>
                    <Link href="/update" className={styles.dropdownItem}>
                      마이페이지
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={styles.dropdownButton}
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className={styles.loginLink}>
                로그인
              </Link>
            )}
          </div>

          <div className={styles.mobileMenuButton}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={styles.mobileMenuIcon}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
