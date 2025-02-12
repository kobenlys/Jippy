// updatePassword.ts
export const updatePasswordAPI = async (currentPassword: string, newPassword: string, token: string) => {
  const requestData = {
    currentPassword,
    newPassword,
    confirmPassword: newPassword,
  };

  console.log("Request data for password update:", requestData);

  const response = await fetch("http://localhost:8080/api/user/update/password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  });
  
  // 성공적인 응답이면(200 OK)
  if (response.ok) {
    return { success: true };
  }
  
  // 에러 응답의 경우
  try {
    const errorData = await response.json();
    throw new Error(errorData.message || "비밀번호 업데이트 실패");
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw new Error("응답 본문을 파싱하는데 실패했습니다");
  }
};