// src/features/chat/hooks/useWebSocket.ts
import { useCallback, useRef } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
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
    // @stomp/stompjs와 함께 SockJS 사용
    const socket = new SockJS("http://localhost:8080/ws-chat");
    stompClient.current = new Client({
      webSocketFactory: () => socket as WebSocket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.current?.subscribe(`/topic/chat/${storeId}`, (msg: IMessage) => {
          const message: Message = JSON.parse(msg.body);
          dispatch(receiveMessage({ storeId, message }));
        });
      },
    });
    stompClient.current.activate();
  }, [storeId, dispatch]);

  // WebSocket 연결 종료 함수
  const disconnect = useCallback((): void => {
    if (stompClient.current) {
      stompClient.current.deactivate();
    }
  }, []);

  // WebSocket을 통한 메시지 전송 함수
  const sendMessage = useCallback(
    (storeId: number, message: Message): void => {
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.publish({
          destination: `/app/chat/${storeId}/send`,
          body: JSON.stringify(message),
        });
      }
    },
    []
  );

  return { connect, disconnect, sendMessage };
};

export default useWebSocket;
