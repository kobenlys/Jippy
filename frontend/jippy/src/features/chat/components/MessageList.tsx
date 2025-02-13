// src/features/chat/components/MessageList.tsx
import React from "react";
import { useSelector } from "react-redux";
import { Message } from "@/features/chat/types/chat";
import { formatTimestamp } from "@/utils/formatDate";
import styles from "@/features/chat/styles/MessageList.module.css";

interface MessageListProps {
  storeId: number;
}

const MessageList: React.FC<MessageListProps> = ({ storeId }) => {
  const messages: Message[] = useSelector((state: { chat: { messages: { [key: number]: Message[] } } }) => state.chat.messages[storeId] || []);

  return (
    <ul className={styles.messageList}>
    {messages.map((msg: Message, index: number) => (
      <li key={index} className={styles.messageItem}>
        <div className={styles.messageHeader}>{msg.senderId}</div>
        <div>{msg.messageContent}</div>
        <div className={styles.messageTimestamp}>{formatTimestamp(msg.timestamp)}</div>
      </li>
    ))}
  </ul>
  );
};

export default MessageList;
