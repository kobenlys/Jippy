import { useState, useEffect } from "react";
import staffApi from "./staffApi";
import { StaffInfo } from "../types/staff";

interface StaffListState {
  data: StaffInfo[] | null;
  isLoading: boolean;
  error: Error | null;
}

const useStaffList = (storeId: number): StaffListState => {
  const [data, setData] = useState<StaffInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStaffList = async () => {
    try {
      setIsLoading(true);
      const response = await staffApi.getStaffList(storeId);
      if (response.success) {
        setData(response.data);
      } else {
        // API 에러 응답 처리
        throw new Error(
          response.message || "직원 목록을 불러오는데 실패했습니다"
        );
      }
    } catch (err) {
      // 네트워크 에러 등 처리
      setError(
        err instanceof Error ? err : new Error("알 수 없는 에러가 발생했습니다")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, [storeId]);

  return { data, isLoading, error };
};

export default useStaffList;
