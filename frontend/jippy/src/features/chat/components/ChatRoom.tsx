// src/features/chat/components/ChatRoom.tsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { fetchMessages } from "@/redux/slices/chatSlice";
import { StoreChat } from "@/features/chat/types/chat";
import { AppDispatch } from "@/redux/store";

interface ChatRoomProps {
  chatRoom: StoreChat;
  userId: number;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatRoom, userId }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // 채팅방 입장 시 메시지 목록 불러오기
    dispatch(fetchMessages({ userId, storeId: chatRoom.storeId }));
  }, [chatRoom, userId, dispatch]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <h2>{"채팅방 " + chatRoom.storeId}</h2>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        <MessageList storeId={chatRoom.storeId} />
      </div>
      <div style={{ padding: "1rem", borderTop: "1px solid #ccc" }}>
        <MessageInput storeId={chatRoom.storeId} userId={userId} />
      </div>
    </div>
  );
};

export default ChatRoom;
