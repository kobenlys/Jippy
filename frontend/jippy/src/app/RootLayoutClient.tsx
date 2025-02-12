"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { Archivo_Black } from "next/font/google";
import "@/app/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar/Navbar";
import { useEffect } from "react";
import { registerServiceWorker } from "@/utils/serviceWorkerRegistration"; // PWA 서비스워커 등록 함수

const archivoBlack = Archivo_Black({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-archivo-black",
  display: "swap",
});

const hideNavbarPaths = ["/login", "/signup", "/attendance", "/calendar"];

const RootLayoutClient = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  useEffect(() => {
    registerServiceWorker(); // PWA 서비스워커 등록
  }, []);

  const isHiddenPath = hideNavbarPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isMainPage = pathname === "/";
  const showNavbar = !isMainPage && !isHiddenPath;

  return (
    <html lang="ko" className={`${archivoBlack.variable}`}>
      <head>
        <link rel="icon" href="/icons/favicon.ico" />
        <meta name="theme-color" content="#ffffff" /> {/* PWA 테마 색상 */}
      </head>
      <body>
        <Provider store={store}>
          <div className="main-layout">
            {showNavbar && (
              <div className="nav-space">
                <Navbar />
              </div>
            )}
            <div className="page-content">{children}</div>
            <div id="modal-root"></div>
            <ToastContainer
              toastClassName="custom-toast"
              progressClassName="custom-toast-progress"
            />
          </div>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayoutClient;
