import StaffAttendanceList from "@/features/dashboard/staff/components/StaffAttendanceList";
import StaffListCard from "@/features/dashboard/staff/components/StaffListCard";
import StaffScheduleCard from "@/features/dashboard/staff/components/StaffScheduleCard";
import WorkingStaffCard from "@/features/dashboard/staff/components/WorkingStaffCard";

const StaffDashboardPage = () => {
  const storeId = 1;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">인적 관리</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <WorkingStaffCard storeId={storeId} />
        <StaffAttendanceList storeId={storeId} />
        {/* 여기에 추가 통계 카드들 */}
      </div>
      <div className="mt-8">
        <StaffListCard storeId={storeId} />
      </div>
      <div className="mt-8">
        <StaffScheduleCard storeId={storeId} />
      </div>
    </div>
  );
};

export default StaffDashboardPage;
