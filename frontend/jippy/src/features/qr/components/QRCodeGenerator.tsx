"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Printer } from "lucide-react";
import { Button } from "@/features/common/components/ui/button";
import { Card, CardContent } from "@/features/common/components/ui/card/Card";
import { RootState } from "@/redux/store";
import { QR_PAGES } from "@/features/qr/constants/pages";
import Image from "next/image";

const QRCodeCRUD: React.FC = () => {
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const accessToken = useSelector((state: RootState) => state.user.auth.accessToken);
  const storeId = useSelector((state: RootState) => state.shop.shop.currentShop?.id);

  const handleQRGenerate = async (name: string, url: string) => {
    if (!storeId) {
      alert("매장 정보가 없습니다.");
      return;
    }
    try {
      setSelectedQR(name);
      setQrImage(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qr/${storeId}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ explain: `${name} QR 코드`, url }),
      });
      
      if (!response.ok) throw new Error("QR 코드 생성 실패");
      const blob = await response.blob();
      setQrImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error("QR 코드 생성 오류:", error);
      alert("QR 코드 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handlePrint = () => {
    if (!qrImage) return;

    const printWindow = window.open("", "_blank");
    printWindow?.document.write(`
      <html>
        <head>
          <style>
            body { text-align: center; padding: 20px; }
            img { width: 200px; height: 200px; }
          </style>
        </head>
        <body>
          <h3>${selectedQR} QR 코드</h3>
          <img src="${qrImage}" alt="QR Code" />
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow?.document.close();
  };

  return (
    <div className="flex gap-8 p-6">
      <div className="flex flex-col gap-4 w-48">
        {QR_PAGES.map((page) => (
          <Button
            key={page.path}
            onClick={() => handleQRGenerate(page.name, page.path)}
            variant={selectedQR === page.name ? "orangeBorder" : "default"}
          >
            {page.name} QR
          </Button>
        ))}
      </div>
      
      <div className="flex-1">
        {qrImage ? (
          <Card>
            <CardContent className="p-6 flex flex-col items-center gap-4">
              <h3 className="text-lg font-semibold">{selectedQR} QR 코드</h3>
              <Image
                src={qrImage}
                alt="QR Code"
                className="border p-4 rounded-lg bg-white"
              />
              <Button onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" /> 출력하기
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            QR 코드를 생성하려면 버튼을 클릭하세요
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeCRUD;
