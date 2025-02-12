// src/features/chat/components/MessageList.tsx
import React from "react";
import { useSelector } from "react-redux";
import { Message } from "@/features/chat/types/chat";

interface MessageListProps {
  storeId: number;
}

const MessageList: React.FC<MessageListProps> = ({ storeId }) => {
  const messages: Message[] = useSelector((state: any) => state.chat.messages[storeId] || []);

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {messages.map((msg: Message, index: number) => (
        <li key={index} style={{ marginBottom: "0.5rem" }}>
          <strong>{msg.senderId}</strong>: {msg.messageContent}
          <div style={{ fontSize: "0.8rem", color: "#999" }}>{msg.timestamp}</div>
        </li>
      ))}
    </ul>
  );
};

export default MessageList;
