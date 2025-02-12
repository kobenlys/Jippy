// src/features/chat/chatSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { StoreChat, Message } from "@/features/chat/types/chat";

// 채팅방 목록 불러오기
export const fetchChatList = createAsyncThunk<StoreChat[], number>(
  "chat/fetchChatList",
  async (userId: number) => {
    const response = await axios.get(`/api/chat/${userId}`);
    return response.data.data as StoreChat[];
  }
);

// 특정 채팅방의 메시지 불러오기
export const fetchMessages = createAsyncThunk<
  { storeId: number; messages: Message[] },
  { userId: number; storeId: number }
>(
  "chat/fetchMessages",
  async ({ userId, storeId }: { userId: number; storeId: number }) => {
    const response = await axios.get(`/api/chat/${userId}/select/${storeId}`);
    return { storeId, messages: response.data.data as Message[] };
  }
);

export interface ChatState {
  chatList: StoreChat[];
  messages: { [storeId: number]: Message[] };
  selectedChatRoom: StoreChat | null;
}

const initialState: ChatState = {
  chatList: [],
  messages: {},
  selectedChatRoom: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChatRoom(state, action: PayloadAction<StoreChat>) {
      state.selectedChatRoom = action.payload;
    },
    // WebSocket을 통해 수신한 메시지를 추가하는 액션
    receiveMessage(state, action: PayloadAction<{ storeId: number; message: Message }>) {
      const { storeId, message } = action.payload;
      if (!state.messages[storeId]) {
        state.messages[storeId] = [];
      }
      state.messages[storeId].push(message);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChatList.fulfilled, (state, action: PayloadAction<StoreChat[]>) => {
      state.chatList = action.payload;
    });
    builder.addCase(
      fetchMessages.fulfilled,
      (state, action: PayloadAction<{ storeId: number; messages: Message[] }>) => {
        const { storeId, messages } = action.payload;
        state.messages[storeId] = messages;
      }
    );
  },
});

export const { setSelectedChatRoom, receiveMessage } = chatSlice.actions;
export default chatSlice.reducer;
