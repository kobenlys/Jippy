import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/common/components/ui/card/Card";
import { useCallback, useEffect, useState } from "react";

interface ScheduleRequest {
  uuid: string;
  staffId: number;
  staffName: string;
  beforeYear: string;
  beforeCheckIn: string;
  beforeCheckOut: string;
  newYear: string;
  newCheckIn: string;
  newCheckOut: string;
}

interface ScheduleChangeListProps {
  storeId: number;
}

const ScheduleChangeList: React.FC<ScheduleChangeListProps> = ({ storeId }) => {
  const [requests, setRequests] = useState<ScheduleRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/${storeId}/tempChange/list`
      );
      const data = await response.json();

      if (data.success) {
        setRequests(data.data.requestSchedule);
      } else {
        console.error("근무 변경 요청 목록 조회 실패");
      }
    } catch (error) {
      console.error("근무 변경 요청 목록 조회 실패", error);
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  const handleApprove = async (request: ScheduleRequest) => {
    try {
      console.log(request);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/${storeId}/tempChange/${request.staffId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uuid: request.uuid,
            newDate: request.newYear,
            newStartTime: request.newCheckIn,
            newEndTime: request.newCheckOut,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("근무 변경 요청이 승인되었습니다.");
        fetchRequests();
      } else {
        alert("근무 변경 요청 승인에 실패했습니다.");
      }
    } catch (error) {
      console.error("근무 변경 요청 승인 중 오류 발생:", error);
      alert("근무 변경 요청 승인 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>근무 변경 요청 목록</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">로딩 중...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            근무 변경 요청이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.uuid}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{request.staffName}</h3>
                    <div className="text-sm text-gray-500">
                      <div>
                        변경 전: {formatDate(request.beforeYear)}{" "}
                        {request.beforeCheckIn} - {request.beforeCheckOut}
                      </div>
                      <div>
                        변경 후: {formatDate(request.newYear)}{" "}
                        {request.newCheckIn} - {request.newCheckOut}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApprove(request)}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    승인
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleChangeList;
