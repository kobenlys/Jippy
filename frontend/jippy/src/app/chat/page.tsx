// src/app/chat/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatList from "@/features/chat/components/ChatList";
import ChatRoom from "@/features/chat/components/ChatRoom";
import useFCM from "@/features/chat/hooks/useFCM";
import useWebSocket from "@/features/chat/hooks/useWebSocket";
import { fetchChatList, setSelectedChatRoom } from "@/redux/slices/chatSlice";
import { StoreChat } from "@/features/chat/types/chat";
import { RootState, AppDispatch } from "@/redux/store";


const ChatPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chatRooms: StoreChat[] = useSelector((state: RootState) => state.chat.chatList);
  const selectedChatRoom: StoreChat | null = useSelector(
    (state: RootState) => state.chat.selectedChatRoom
  );
  // 실제 로그인된 사용자의 id를 사용하세요.
  const [userId] = useState<number>(1);

  // FCM 초기화
  const { initializeFCM } = useFCM();

  // WebSocket hook (storeId가 있을 때 연결)
  const { connect, disconnect } = useWebSocket(selectedChatRoom?.storeId);

  useEffect(() => {
    // 채팅방 목록 불러오기
    dispatch(fetchChatList(userId));
    // FCM 초기화 (토큰 획득 및 onMessage 핸들러 등록)
    initializeFCM();
  }, [userId, dispatch, initializeFCM]);

  useEffect(() => {
    // 채팅방 선택 시 WebSocket 연결
    if (selectedChatRoom) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [selectedChatRoom, connect, disconnect]);

  const handleChatRoomSelect = (room: StoreChat): void => {
    dispatch(setSelectedChatRoom(room));
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 왼쪽: 채팅방 목록 */}
      <ChatList chatRooms={chatRooms} onSelect={handleChatRoomSelect} />
      {/* 오른쪽: 선택된 채팅방 화면 */}
      {selectedChatRoom ? (
        <ChatRoom chatRoom={selectedChatRoom} userId={userId} />
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <h2>채팅방을 선택해 주세요.</h2>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
