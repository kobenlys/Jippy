// src/features/chat/components/ChatList.tsx
import React from "react";
import { StoreChat } from "@/features/chat/types/chat";

interface ChatListProps {
  chatRooms: StoreChat[];
  onSelect: (room: StoreChat) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chatRooms, onSelect }) => {
  return (
    <div style={{ width: "300px", borderRight: "1px solid #ccc", overflowY: "auto", padding: "1rem" }}>
      <h2>채팅방 목록</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {chatRooms.map((room) => (
          <li
            key={room.storeId}
            style={{ padding: "0.5rem", cursor: "pointer", borderBottom: "1px solid #eee" }}
            onClick={() => onSelect(room)}
          >
            {"채팅방 " + room.storeId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
