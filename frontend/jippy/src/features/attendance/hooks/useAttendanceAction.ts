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
    const token = document.cookie
      .split("; ")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("accessToken="))
      ?.split("=")[1];
    console.log(token);
    return token;
  };

  const getStaffId = () => {
    const token = document.cookie
      .split("; ")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("userId="))
      ?.split("=")[1];
    console.log(token);
    return token;
  };

  const getLocation = async (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            console.log("✅ 위치 정보:", coords);
            resolve(coords); // ✅ 위치 값을 반환
          },
          (err: GeolocationPositionError) => {
            console.log(`위치 정보를 가져올 수 없습니다: ${err.message}`);
            reject(new Error(`위치 정보를 가져올 수 없습니다: ${err.message}`));
          }
        );
      } else {
        const errorMsg = "Geolocation이 지원되지 않는 브라우저입니다.";
        console.log(errorMsg);
        reject(new Error(errorMsg));
      }
    });
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const checkIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { latitude, longitude } = await getLocation();

      console.log("✅ 서버로 보낼 위도:", latitude);
      console.log("✅ 서버로 보낼 경도:", longitude);

      if (latitude === null || longitude === null) {
        throw new Error("위치 정보를 가져올 수 없습니다.");
      }
      const staffId = getStaffId();
      const token = getAuthToken();
      const response = await fetch(
        `${API_URL}/api/attendance/${storeId}/checkIn`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            latitude, // 위도 추가
            longitude, // 경도 추가
            staffId,
          }),
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
