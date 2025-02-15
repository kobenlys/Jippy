package com.hbhw.jippy.domain.chat.service;

import com.hbhw.jippy.domain.chat.dto.request.ChatMessageRequest;
import com.hbhw.jippy.domain.chat.dto.request.CreateChatRequest;
import com.hbhw.jippy.domain.chat.dto.response.ChatListResponse;
import com.hbhw.jippy.domain.chat.dto.response.ChatMessageResponse;
import com.hbhw.jippy.domain.chat.entity.Message;
import com.hbhw.jippy.domain.chat.entity.StoreChat;
import com.hbhw.jippy.domain.chat.repository.ChatListRepository;
import com.hbhw.jippy.domain.chat.repository.ChatRepository;
import com.hbhw.jippy.utils.DateTimeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
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
    public List<ChatMessageResponse> getMessages(Integer storeId, int limit, String before) {
        Optional<StoreChat> storeChatOpt;

        // before 값이 존재하면 과거 메시지를 조회
        if (before != null && !before.isEmpty()) {
            storeChatOpt = chatRepository.findOldMessages(storeId, before);
        } else {
            storeChatOpt = chatRepository.findRecentMessages(storeId);
        }

        StoreChat storeChat = storeChatOpt.orElseThrow(() ->
                new NoSuchElementException("채팅방을 찾을 수 없습니다. storeId=" + storeId));

        // messages 리스트 가져오고, limit 개수만큼 제한
        List<Message> messages = storeChat.getMessages();

        if (messages.size() > limit) {
            messages = messages.subList(0, limit); // 최신 limit 개만 남김
        }

        return messages.stream()
                .map(msg -> new ChatMessageResponse(
                        msg.getSenderId(),
                        msg.getMessageId(),
                        msg.getMessageContent(),
                        msg.getTimestamp(),
                        msg.getMessageType()
                ))
                .collect(Collectors.toList());
    }

    // 채팅방 생성
    public void createChat(Integer storeId) {
        StoreChat chat = StoreChat.builder()
                .storeId(storeId)
                .messages(new ArrayList<>())
                .build();
        chatRepository.insert(chat);
    }


    // 채팅방 퇴장
    public void deleteChat(Integer storeId) {
        chatRepository.deleteByStoreId(storeId);
    }

    /**
     * 채팅 메시지를 저장하고 반환
     */
    public ChatMessageResponse saveMessage(Integer storeId, ChatMessageRequest request) {
        // 1) 기존 storeChat 문서 조회
        StoreChat storeChat = chatRepository.findByStoreId(storeId)
                .orElseThrow(() -> new NoSuchElementException("채팅방을 찾을 수 없습니다. storeId=" + storeId));

        // 2) 새 메시지 생성
        // request.getSenderId()
        // 나중에 회원 정보 조회 생기면 senderId에 회원정보 이름 담기
        Message message = Message.builder()
                .senderId(request.getSenderId())
                .messageId(request.getMessageId())
                .messageContent(request.getMessageContent())
                .messageType(request.getMessageType())
                .timestamp(DateTimeUtils.nowString()) // yyyy-MM-dd HH:mm:ss 등 원하는 포맷
                .build();

        // 3) 기존 messages 리스트에 추가
        storeChat.getMessages().add(message);

        // 4) DB에 업데이트 (storeChat 전체 문서가 업데이트됨)
        chatRepository.save(storeChat);

        // 5) 응답 DTO 구성
        return ChatMessageResponse.builder()
                .senderId(request.getSenderId())
                .messageId(request.getMessageId())
                .messageContent(request.getMessageContent())
                .messageType(request.getMessageType())
                .timestamp(message.getTimestamp())
                .build();
    }


}
