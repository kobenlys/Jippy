package com.hbhw.jippy.domain.chat.service;

import com.hbhw.jippy.domain.chat.dto.request.CreateChatRequest;
import com.hbhw.jippy.domain.chat.dto.response.ChatListResponse;
import com.hbhw.jippy.domain.chat.dto.response.MessageResponse;
import com.hbhw.jippy.domain.chat.entity.StoreChat;
import com.hbhw.jippy.domain.chat.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRepository chatRepository;

    // 채팅방 목록 조회
    public List<ChatListResponse> getChatList(Integer userId) {
        return chatRepository.findAll().stream()
                .map(chat -> new ChatListResponse(chat.getStoreId()))
                .collect(Collectors.toList());
    }

    // 메시지 조회
    public List<MessageResponse> getMessages(Integer storeId) {
        StoreChat storeChat = chatRepository.findByStoreId(storeId)
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));

        return storeChat.getMessages().stream()
                .map(msg -> new MessageResponse(
                        msg.getReceiverId(),
                        msg.getMessageContent(),
                        msg.getTimestamp(),
                        msg.getMessageType()
                ))
                .collect(Collectors.toList());
    }

    // 채팅방 생성
    public StoreChat createChat(CreateChatRequest request) {
        StoreChat chat = StoreChat.builder()
                .storeId(request.getStoreId())
                .messages(new ArrayList<>())
                .build();
        return chatRepository.save(chat);
    }

    // 채팅방 퇴장
    public void leaveChat(Integer storeId, String receiverId) {
        StoreChat storeChat = chatRepository.findByStoreId(storeId)
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));

        storeChat.getMessages().removeIf(msg -> msg.getReceiverId().equals(receiverId));
        chatRepository.save(storeChat);
    }
}
