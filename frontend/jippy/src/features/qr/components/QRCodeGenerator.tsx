"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Printer, QrCode, Loader2 } from "lucide-react";
import { Button } from "@/features/common/components/ui/button";
import { Card, CardContent } from "@/features/common/components/ui/card/Card";
import { RootState } from "@/redux/store";
import { QR_PAGES } from "@/features/qr/constants/pages";
import { QRPage } from "../types/qr";
import Image from "next/image";

const QRCodeCRUD: React.FC = () => {
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [qrImageBase64, setQrImageBase64] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 200, height: 200 });
  const [isLoading, setIsLoading] = useState(false);

  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const storeId = useSelector((state: RootState) => state.shop.currentShop?.id);

  useEffect(() => {
    if (qrImage) {
      const tempImg = document.createElement('img');
      tempImg.src = qrImage;
      tempImg.onload = () => {
        setImageDimensions({ 
          width: tempImg.naturalWidth, 
          height: tempImg.naturalHeight 
        });
      };
    }
  }, [qrImage]);

  const handleQRGenerate = async (name: string, url: string) => {
    if (!storeId) {
      alert("매장 정보가 없습니다.");
      return;
    }
    try {
      setIsLoading(true);
      setSelectedQR(name);
      setQrImage(null);
      setQrImageBase64(null);
      
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

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        setQrImageBase64(base64data);
      };

    } catch (error) {
      console.error("QR 코드 생성 오류:", error);
      alert("QR 코드 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (!qrImageBase64) return;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("팝업이 차단되었습니다 팝업 차단을 해제해 주세요");
      return;
    }

    printWindow?.document.write(`
      <html>
        <head>
          <title>${selectedQR} QR 코드</title>
          <style>
            body { text-align: center; padding: 20px; }
            img { width: 200px; height: 200px; }
          </style>
        </head>
        <style>
           body { 
              text-align: center; 
              padding: 40px 20px;
              margin: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background-color: #f8fafc;
              font-family: 'Noto Sans KR', sans-serif;
            }
            .container {
              background: white;
              padding: 48px;
              border-radius: 16px;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
              max-width: 400px;
              width: 100%;
            }
            .header {
              margin-bottom: 32px;
              padding-top: 16px;
            }
            .title {
              font-size: 24px;
              font-weight: 700;
              color: #1e293b;
              margin: 0 0 8px 0;
            }
            .subtitle {
              font-size: 14px;
              color: #64748b;
              margin: 0;
            }
            .qr-container {
              background: white;
              padding: 24px;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              margin: 24px 0;
            }
            img { 
              width: 280px; 
              height: 280px;
              object-fit: contain;
            }
            @media print {
              body {
                background: white;
                padding: 0;
              }
              .container {
                box-shadow: none;
                padding: 20px;
              }
            }
        </style>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">${selectedQR} QR 코드</h1>
            </div>
            <div class="qr-container">
              <img src="${qrImageBase64}" alt="QR Code" />
            </div>
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow?.document.close();
  };

  return (
    <div className="flex justify-center items-center p-8">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6">
          <div className="flex gap-8 items-center">
            {/* 좌측 버튼 메뉴 */}
            <div className="flex flex-col gap-3 w-48 shrink-0">
              {QR_PAGES.map((page: QRPage) => (
                <Button
                  key={page.path}
                  onClick={() => handleQRGenerate(page.name, page.path)}
                  variant={selectedQR === page.name ? "default" : "default"}
                  className={`w-full justify-start h-11 border ${
                    selectedQR === page.name 
                      ? 'border-gray-400 bg-gray-400 text-white hover:bg-gray-400' 
                      : 'border-gray-200 hover:border-gray-500 hover:text-gray-600'
                  }`}
                >
                  <QrCode className="w-4 h-4 mr-2 opacity-70" />
                  <span className="text-sm">{page.name}</span>
                </Button>
              ))}
            </div>
  
            {/* 우측 QR 코드 표시 영역 */}
            <div className="flex-1 flex justify-center">
              <div className="w-[320px]">
                <div className="flex flex-col items-center">
                  <div className="h-[500px] w-full flex items-center justify-center">
                    <div className="flex flex-col items-center w-full relative mt-10 mb-10">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        {selectedQR ? `${selectedQR} QR 코드` : 'QR 코드'}
                      </h3>
                      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6 w-[280px] h-[280px] flex items-center justify-center">
                        {isLoading ? (
                          <div className="flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin opacity-70 mb-4" />
                            <p className="text-sm text-gray-500">QR 코드 생성 중...</p>
                          </div>
                        ) : qrImage && imageDimensions.width > 0 ? (
                          <Image
                            src={qrImage}
                            alt="QR Code"
                            width={imageDimensions.width}
                            height={imageDimensions.height}
                            className="w-[200px] h-[200px] object-contain"
                            priority
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <QrCode className="w-16 h-16 mb-4 opacity-40" />
                            <p className="text-sm">QR 코드를 생성하려면 버튼을 클릭하세요</p>
                          </div>
                        )}
                      </div>
                      <Button 
                        onClick={handlePrint}
                        variant="orange"
                        className="w-full h-11"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        QR 코드 출력하기
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeCRUD;