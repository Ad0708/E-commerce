import MaintenanceGuard from "@/components/store/MaintenanceGuard";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MaintenanceGuard>
      {children}
    </MaintenanceGuard>
  );
}