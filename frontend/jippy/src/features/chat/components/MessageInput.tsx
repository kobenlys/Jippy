// src/features/chat/components/MessageInput.tsx
import React, { useState } from "react";
import useWebSocket from "../hooks/useWebSocket";
import styles from "@/features/chat/styles/MessageInput.module.css";

interface MessageInputProps {
  storeId: number;
  userName: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ storeId, userName }) => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useWebSocket(storeId);

  const handleSend = () => {
    if (message.trim() === "") return;

    const chatMessage = {
      senderId: userName,
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
    <div className={styles.messageInputContainer}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        className={styles.inputField}
        placeholder="메시지를 입력하세요."
      />
      <button onClick={handleSend} className={styles.sendButton}>
        전송
      </button>
    </div>
  );
};

export default MessageInput;
