// src/features/chat/hooks/useWebSocket.ts
import { useCallback, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp, { Client, Message as StompMessage } from "stompjs";
import { useDispatch } from "react-redux";
import { receiveMessage } from "@/redux/slices/chatSlice";
import { Message } from "@/features/chat/types/chat";

const useWebSocket = (storeId?: number) => {
  // stompClient 타입은 Stomp Client 또는 null
  const stompClient = useRef<Client | null>(null);
  const dispatch = useDispatch();

  // WebSocket 연결 함수
  const connect = useCallback((): void => {
    if (!storeId) return;
    const socket = new SockJS("http://localhost:8080/ws-chat"); // 백엔드 WebSocket 엔드포인트 (환경에 맞게 수정)
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      stompClient.current?.subscribe(`/topic/chat/${storeId}`, (msg: StompMessage) => {
        const message: Message = JSON.parse(msg.body);
        dispatch(receiveMessage({ storeId, message }));
      });
    });
  }, [storeId, dispatch]);

  // WebSocket 연결 종료 함수
  const disconnect = useCallback((): void => {
    if (stompClient.current) {
      stompClient.current.disconnect(() => {
        console.log("WebSocket disconnected");
      });
    }
  }, []);

  // WebSocket을 통한 메시지 전송 함수
  const sendMessage = useCallback(
    (storeId: number, message: Message): void => {
      if (stompClient.current) {
        stompClient.current.send(`/app/chat/${storeId}/send`, {}, JSON.stringify(message));
      }
    },
    []
  );

  return { connect, disconnect, sendMessage };
};

export default useWebSocket;
