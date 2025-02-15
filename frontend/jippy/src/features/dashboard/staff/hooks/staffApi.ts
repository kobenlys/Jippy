import { ApiResponse } from "@/features/attendance/types/attendance";
import {
  DeleteStaffResponse,
  StaffInfo,
  UpdateStaffRequest,
  WorkingStaffResponse,
} from "../types/staff";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const staffApi = {
  getWorkingStaff: async (storeId: number): Promise<WorkingStaffResponse> => {
    const response = await fetch(
      `${BASE_URL}/api/dashboard/staff/${storeId}/working`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch working status");
    return response.json();
  },

  getTotalStoreSalary: async (storeId: string, token: string) => {
    const response = await fetch(
      `${BASE_URL}/api/dashboard/staff/${storeId}/totalStoreSalary`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch total salary");
    return response.json();
  },

  getStaffTotalStatus: async (
    storeId: string,
    staffId: string,
    token: string
  ) => {
    const response = await fetch(
      `${BASE_URL}/api/dashboard/staff/${storeId}/totalStatus/${staffId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch staff status");
    return response.json();
  },

  getStaffList: async (storeId: number): Promise<ApiResponse<StaffInfo[]>> => {
    const response = await fetch(
      `${BASE_URL}/api/storeStaff/${storeId}/select`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch staff list");
    return response.json();
  },

  //   getStaffDetail: async (storeId: string, staffId: string, token: string) => {
  //     const response = await fetch(
  //       `${BASE_URL}/api/storeStaff/${storeId}/select/${staffId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (!response.ok) throw new Error("Failed to fetch staff detail");
  //     return response.json();
  //   },

  //   getStoreSalary: async (storeId: string, token: string) => {
  //     const response = await fetch(
  //       `${BASE_URL}/api/dashboard/staff/${storeId}/storeSalary`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (!response.ok) throw new Error("Failed to fetch store salary");
  //     return response.json();
  //   },

  //   getStaffStatus: async (storeId: string, staffId: string, token: string) => {
  //     const response = await fetch(
  //       `${BASE_URL}/api/dashboard/staff/${storeId}/status/${staffId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (!response.ok) throw new Error("Failed to fetch staff status");
  //     return response.json();
  //   },

  updateStaff: async (
    storeId: number,
    staffId: number,
    data: UpdateStaffRequest
  ): Promise<UpdateStaffRequest> => {
    const response = await fetch(
      `${BASE_URL}/api/storeStaff/${storeId}/update/${staffId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error("Failed to update staff");
    return response.json();
  },

  deleteStaff: async (
    storeId: number,
    staffId: number
  ): Promise<DeleteStaffResponse> => {
    const response = await fetch(
      `${BASE_URL}/api/storeStaff/${storeId}/delete/${staffId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error("Failed to delete staff");
    return response.json();
  },
};

export default staffApi;
