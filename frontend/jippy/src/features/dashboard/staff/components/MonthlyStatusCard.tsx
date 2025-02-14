import { Clock, AlertTriangle } from "lucide-react";
import { useStaffMonthlyStatus } from "../hooks/useStaffStatistic";
import LoadingSpinner from "@/features/common/components/ui/LoadingSpinner";

interface MonthlyStatusCardProps {
  storeId: number;
  staffId: number;
  staffName: string;
}

const formatWorkTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}분`;
  }

  return remainingMinutes > 0
    ? `${hours}시간 ${remainingMinutes}분`
    : `${hours}시간`;
};

const MonthlyStatusCard = ({
  storeId,
  staffId,
  staffName,
}: MonthlyStatusCardProps) => {
  const currentDate = new Date().toISOString().slice(0, 7);

  const { data, isLoading, error } = useStaffMonthlyStatus(
    storeId,
    staffId,
    currentDate
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return null;
  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            {staffName}님의 이번 달 근태
          </h3>
          <p className="text-sm text-gray-500">{currentDate}</p>
        </div>
        <Clock className="w-6 h-6 text-blue-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">총 근무시간</p>
          <p className="text-xl font-bold text-blue-700">
            {formatWorkTime(data.workMinutes)}
          </p>
        </div>

        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-gray-600">근태 이슈</p>
          </div>
          <div className="mt-1">
            <p className="text-md">
              지각{" "}
              <span className="font-bold text-red-600">{data.lateCount}</span>회
            </p>
            <p className="text-md">
              조기퇴근{" "}
              <span className="font-bold text-red-600">
                {data.earlyLeaveCount}
              </span>
              회
            </p>
          </div>
        </div>
      </div>

      {data.salary > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">이번 달 예상 급여</p>
          <p className="text-xl font-bold">{data.salary.toLocaleString()}원</p>
        </div>
      )}
    </div>
  );
};

export default MonthlyStatusCard;
