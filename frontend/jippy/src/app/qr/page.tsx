// app/qr/page.tsx
import QRCodeGenerator from "@/features/qr/components/QRCodeGenerator";

export default function QRPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">QR 코드 생성기</h1>
      <QRCodeGenerator />
    </main>
  );
}