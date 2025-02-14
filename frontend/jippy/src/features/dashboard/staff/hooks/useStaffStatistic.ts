import { useEffect, useState } from "react";
import { StaffMonthlyStatus, WorkingStaffData } from "../types/staff";
import staffApi from "./staffApi";

interface WorkingStaffState {
  data: WorkingStaffData | null;
  isLoading: boolean;
  error: Error | null;
}

interface StaffMonthlyStatusState {
  data: StaffMonthlyStatus | null;
  isLoading: boolean;
  error: Error | null;
}

const useWorkingStaff = (storeId: number): WorkingStaffState => {
  const [data, setData] = useState<WorkingStaffData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkingStaff = async () => {
    try {
      setIsLoading(true);
      const response = await staffApi.getWorkingStaff(storeId);

      if (response.success) {
        setData(response.data);
      } else {
        throw new Error("근무 현황을 불러오는데 실패했습니다");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("알 수 없는 에러가 발생했습니다")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkingStaff();
  }, [storeId]);

  return { data, isLoading, error };
};

const useStaffMonthlyStatus = (
  storeId: number,
  staffId: number,
  date: string
): StaffMonthlyStatusState => {
  const [data, setData] = useState<StaffMonthlyStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/staff/${storeId}/status/${staffId}?date=${date}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch status");

        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.message || "데이터 조회 실패");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("알 수 없는 에러가 발생했습니다")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [storeId, staffId, date]);

  return { data, isLoading, error };
};

export { useWorkingStaff, useStaffMonthlyStatus };
