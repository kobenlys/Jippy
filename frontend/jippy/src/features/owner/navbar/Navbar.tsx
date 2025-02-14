import Link from "next/link";
import { cookies } from "next/headers";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  console.log("🛠️ 서버에서 가져온 accessToken:", accessToken);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {/* 로고 */}
          <div className={styles.logo}>
            <Link href="/confirm" className={styles.logoText}>
              Jippy
            </Link>
          </div>

          {/* 네비게이션 메뉴 */}
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

            {/* 로그인 / 로그아웃 UI */}
            {accessToken ? (
              <div className={styles.profileDropdown}>
                <Link href="/update" className={styles.profileButton}>
                  마이페이지
                </Link>
                <form action="/api/logout" method="POST">
                  <button type="submit" className={styles.dropdownButton}>
                    로그아웃
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" className={styles.loginLink}>
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
