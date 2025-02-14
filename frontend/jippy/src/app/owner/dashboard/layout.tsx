import Navbar from "@/features/owner/navbar/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main className="mt-16">{children}</main>
    </div>
  );
}
