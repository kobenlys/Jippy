import React from "react";
import { StoreChat } from "@/features/chat/types/chat";
import useRecentMessage from "@/features/chat/hooks/useRecentMessage";
import { formatTimestamp } from "@/utils/formatDate";
import styles from "@/features/chat/styles/ChatListItem.module.css";

interface ChatListItemProps {
    chatRoom: StoreChat;
    onSelect: (room: StoreChat) => void;
  }
  
  const ChatListItem: React.FC<ChatListItemProps> = ({ chatRoom, onSelect }) => {
    const { recentMessage, loading, error } = useRecentMessage(chatRoom.storeId);
  
    return (
      <li 
        className={styles.listItem}
        onClick={() => onSelect(chatRoom)}
      >
        <div className={styles.roomTitle}>채팅방 {chatRoom.storeId}</div>
        {loading ? (
          <div className={styles.preview}>로딩 중...</div>
        ) : error ? (
          <div className={styles.preview}>오류 발생</div>
        ) : recentMessage ? (
          <div className={styles.preview}>
            <span className={styles.messageContent}>
              {recentMessage.messageContent}
            </span>
            <span className={styles.timestamp}>
              {formatTimestamp(recentMessage.timestamp)}
            </span>
          </div>
        ) : (
          <div className={styles.preview}>메시지가 없습니다.</div>
        )}
      </li>
    );
  };
  
  export default ChatListItem;
