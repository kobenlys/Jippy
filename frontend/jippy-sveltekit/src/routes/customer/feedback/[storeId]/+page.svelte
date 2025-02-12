<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { format } from "date-fns";
  import "../../../../app.css";
  export let data;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  let complaintCategory = "SERVICE";
  let complaintContent = "";
  let isLoading = false;
  let customerId = "";

  // 브라우저에서 customerId 설정
  onMount(() => {
    let storedId = localStorage.getItem("customerId");
    if (!storedId) {
      storedId = window.crypto.randomUUID();
      localStorage.setItem("customerId", storedId);
    }
    customerId = storedId;
  });

  async function submitFeedback() {
    if (!complaintContent.trim()) {
      alert("불편 사항을 입력해주세요!");
      return;
    }

    isLoading = true;

    try {
      const response = await fetch(
        apiBaseUrl + "/api/feedback/" + data.storeId + "/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storeId: data.storeId,
            customerId: customerId,
            category: complaintCategory,
            content: complaintContent,
            timestamp: format(new Date(), "yyyy-MM-dd hh:ss:mm"),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("서버 오류가 발생했습니다.");
      }

      const result = await response.json();
      alert("불편 사항이 성공적으로 접수되었습니다!");
      goto("/customer/feedback/success");
    } catch (error) {
      alert("피드백 전송 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="flex justify-center items-center min-h-screen bg-gray-100">
  <div
    class="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl min-h-screen flex flex-col px-8 py-12 shadow-lg"
  >
    <!-- 상단 영역 (제목) -->
    <div class="flex-none">
      <h2 class="text-2xl font-bold mb-6">고객 의견</h2>
    </div>

    <!-- 중간 영역 (드롭다운 + 텍스트 입력) -->
    <div class="flex-grow flex flex-col space-y-6">
      <div class="relative">
        <select
          bind:value={complaintCategory}
          class="w-full border p-4 rounded appearance-none bg-white"
        >
          <option value="SERVICE">서비스 의견 제공</option>
          <option Value="PRODUCT">제품 의견 제공</option>
          <option value="LIVE">실시간 매장 의견 사항</option>
          <option Value="ETC">기타</option>
        </select>
        <!-- 아이콘 (SVG 직접 추가) -->
        <svg
          class="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 text-gray-500 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>

      <textarea
        bind:value={complaintContent}
        placeholder="불편 사항을 입력해주세요."
        class="w-full border p-4 rounded flex-grow resize-none"
      ></textarea>
    </div>

    <!-- 하단 영역 (버튼) -->
    <div class="flex-none mt-8">
      <button
        on:click={submitFeedback}
        class="w-full bg-[#FF5C00] text-white py-4 rounded-lg hover:bg-[#E65200] transition-all text-lg font-bold"
        disabled={isLoading}
      >
        {isLoading ? "전송 중..." : "보내기"}
      </button>
    </div>
  </div>
</div>
