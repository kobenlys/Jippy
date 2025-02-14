import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { StoreChat } from "@/features/chat/types/chat";
import { formatTimestamp } from "@/utils/formatDate";
import styles from "@/features/chat/styles/ChatListItem.module.css";

interface ChatListItemProps {
  chatRoom: StoreChat;
  onSelect: (room: StoreChat) => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chatRoom, onSelect }) => {
  // Redux에 저장된 메시지를 통해 최근 메시지를 가져옴
  const messages = useSelector(
    (state: RootState) => state.chat.messages[chatRoom.storeId] || []
  );
  const recentMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  return (
    <li className={styles.listItem} onClick={() => onSelect(chatRoom)}>
      <div className={styles.roomTitle}>채팅방 {chatRoom.storeId}</div>
      {recentMessage ? (
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
