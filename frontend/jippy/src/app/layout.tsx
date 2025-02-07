"use client"; // 클라이언트 컴포넌트로 지정

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { Archivo_Black } from "next/font/google"
import "@/app/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Archivo Black 설정
const archivoBlack = Archivo_Black({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-archivo-black",
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${archivoBlack.variable}`}>
      <head>
        <link rel="icon" href="/icons/favicon.ico" />
      </head>
      <body>
        <Provider store={store}>
          {children}
          <ToastContainer />
        </Provider>
      </body>
    </html>
  );
}
