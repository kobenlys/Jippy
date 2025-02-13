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
import styles from "@/features/chat/styles/ChatPage.module.css";

const ChatPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chatRooms: StoreChat[] = useSelector((state: RootState) => state.chat.chatList);
  const selectedChatRoom: StoreChat | null = useSelector(
    (state: RootState) => state.chat.selectedChatRoom
  );
  // 실제 로그인된 사용자의 id (여기서는 1로 가정)
  const [userId] = useState<number>(1);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showChatList, setShowChatList] = useState<boolean>(true);

  const { initializeFCM } = useFCM();
  const { connect, disconnect } = useWebSocket(selectedChatRoom?.storeId);

  useEffect(() => {
    dispatch(fetchChatList(userId));
    initializeFCM();
  }, [userId, dispatch, initializeFCM]);

  useEffect(() => {
    if (selectedChatRoom) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [selectedChatRoom, connect, disconnect]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        setShowChatList(false);
      } else {
        setIsMobile(false);
        setShowChatList(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChatRoomSelect = (room: StoreChat): void => {
    dispatch(setSelectedChatRoom(room));
    if (isMobile) {
      setShowChatList(false);
    }
  };

  return (
    <div className={styles.container}>
      {isMobile && (
        <div className={styles.mobileHeader}>
          <button
            className={styles.toggleButton}
            onClick={() => setShowChatList(!showChatList)}
          >
            {showChatList ? "채팅 목록 숨기기" : "채팅 목록 보기"}
          </button>
        </div>
      )}
      <div className={styles.content}>
        {showChatList && (
          <ChatList chatRooms={chatRooms} onSelect={handleChatRoomSelect} />
        )}
        {selectedChatRoom ? (
          <ChatRoom chatRoom={selectedChatRoom} userId={userId} />
        ) : (
          <div className={styles.emptyRoom}>
            <h2>채팅방을 선택해 주세요.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;