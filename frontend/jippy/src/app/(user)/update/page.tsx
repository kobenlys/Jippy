// src/app/update/page.ts
import React from "react";
import "@/app/globals.css";
import UpdateUserForm from "@/components/UpdateUserForm";

const UpdatePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-6">회원 정보 수정</h1>
      <UpdateUserForm />
    </div>
  );
};

export default UpdatePage;
