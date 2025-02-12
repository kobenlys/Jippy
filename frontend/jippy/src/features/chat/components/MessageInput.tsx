// src/features/chat/components/MessageInput.tsx
import React, { useState } from "react";
import useWebSocket from "../hooks/useWebSocket";

interface MessageInputProps {
  storeId: number;
  userId: number;
}

const MessageInput: React.FC<MessageInputProps> = ({ storeId, userId }) => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useWebSocket(storeId);

  const handleSend = () => {
    if (message.trim() === "") return;

    const chatMessage = {
      senderId: userId.toString(),
      messageContent: message,
      timestamp: new Date().toISOString(),
      messageType: "text",
    };

    sendMessage(storeId, chatMessage);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{ flex: 1, padding: "0.5rem" }}
        placeholder="메시지를 입력하세요."
      />
      <button onClick={handleSend} style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}>
        전송
      </button>
    </div>
  );
};

export default MessageInput;
