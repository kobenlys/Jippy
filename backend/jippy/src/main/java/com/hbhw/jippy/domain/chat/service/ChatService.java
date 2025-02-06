package com.hbhw.jippy.domain.chat.service;

import com.hbhw.jippy.domain.chat.dto.request.ChatMessageRequest;
import com.hbhw.jippy.domain.chat.dto.request.CreateChatRequest;
import com.hbhw.jippy.domain.chat.dto.response.ChatListResponse;
import com.hbhw.jippy.domain.chat.dto.response.ChatMessageResponse;
import com.hbhw.jippy.domain.chat.entity.Message;
import com.hbhw.jippy.domain.chat.entity.StoreChat;
import com.hbhw.jippy.domain.chat.repository.ChatListRepository;
import com.hbhw.jippy.domain.chat.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRepository chatRepository;
    private final ChatListRepository chatlistRepository;

    // 채팅방 목록 조회
    public List<ChatListResponse> getChatList(Integer userId) {
        return chatlistRepository.findByUserStaffId(userId).stream()
                .map(storeUserStaff -> new ChatListResponse(storeUserStaff.getStore().getId()))
                .collect(Collectors.toList());
    }

    // 메시지 조회
    public List<ChatMessageResponse> getMessages(Integer storeId) {
        StoreChat storeChat = chatRepository.findByStoreId(storeId)
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));

        return storeChat.getMessages().stream()
                .map(msg -> new ChatMessageResponse(
                        msg.getSenderId(),
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

        storeChat.getMessages().removeIf(msg -> msg.getSenderId().equals(receiverId));
        chatRepository.save(storeChat);
    }

    /**
     * 채팅 메시지를 저장하고 반환
     */
    public ChatMessageResponse saveMessage(Integer storeId, ChatMessageRequest request) {
        StoreChat storeChat = chatRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));

        Message message = Message.builder()
                .senderId(request.getSenderId())  // 수신자 ID
                .messageContent(request.getMessageContent())
                .messageType(request.getMessageType())
                .timestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .build();

        storeChat.getMessages().add(message);
        chatRepository.save(storeChat);

        return ChatMessageResponse.builder()
                .senderId(request.getSenderId())
                .messageContent(request.getMessageContent())
                .messageType(request.getMessageType())
                .timestamp(message.getTimestamp())
                .build();
    }
}
