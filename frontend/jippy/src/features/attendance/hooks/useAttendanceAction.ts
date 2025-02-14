import { useState } from "react";
import {
  ApiResponse,
  CheckInResponse,
  CheckOutResponse,
} from "../types/attendance";

const useAttendanceAction = (storeId: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    console.log(token);
    return token;
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const checkIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();

      const response = await fetch(
        `${API_URL}/api/attendance/${storeId}/checkIn`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText);
        throw new Error("리소스를 찾을 수 없습니다.");
      }

      const result: ApiResponse<CheckInResponse> = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "출근 처리 실패";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const checkOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/attendance/checkOut`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const result: ApiResponse<CheckOutResponse> = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "퇴근 처리 실패";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkIn,
    checkOut,
    isLoading,
    error,
  };
};

export default useAttendanceAction;
