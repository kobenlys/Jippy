package com.hbhw.jippy.domain.chat.controller;

import com.hbhw.jippy.domain.chat.dto.request.ChatMessageRequest;
import com.hbhw.jippy.domain.chat.dto.request.CreateChatRequest;
import com.hbhw.jippy.domain.chat.dto.response.ChatListResponse;
import com.hbhw.jippy.domain.chat.dto.response.ChatMessageResponse;
import com.hbhw.jippy.domain.chat.entity.StoreChat;
import com.hbhw.jippy.domain.chat.service.ChatService;
import com.hbhw.jippy.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "ChatController", description = "채팅 관련 API")
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @Operation(summary = "채팅방 목록 조회", description = "사용자가 가입된 채팅방 목록을 가져옵니다.")
    @GetMapping("/{userId}")
    public ApiResponse<List<ChatListResponse>> getList(@PathVariable Integer userId) {
        return ApiResponse.success(chatService.getChatList(userId));
    }

    @Operation(summary = "채팅 메시지 조회", description = "특정 채팅방의 메시지 목록을 가져옵니다.")
    @GetMapping("/{userId}/select/{storeId}")
    public ApiResponse<List<ChatMessageResponse>> getMessages(
            @PathVariable Integer userId,
            @PathVariable Integer storeId,
            @RequestParam(required = false, defaultValue = "20") int limit,
            @RequestParam(required = false) String before
    ) {
        List<ChatMessageResponse> messages = chatService.getMessages(storeId, limit, before);
        return ApiResponse.success(messages);
    }

    @Operation(summary = "채팅방 생성", description = "새로운 채팅방을 생성합니다.")
    @PostMapping("/{storeId}")
    public ApiResponse<StoreChat> createChat(@RequestBody CreateChatRequest request) {
        return ApiResponse.success(chatService.createChat(request));
    }

    /**
     * WebSocket을 통해 메시지를 주고받음.
     */
    @MessageMapping("/chat/{storeId}/send")
    public void sendMessage(@DestinationVariable Integer storeId, @Payload ChatMessageRequest chatMessage) {
        ChatMessageResponse chatMessageResponse = chatService.saveMessage(storeId, chatMessage);
        messagingTemplate.convertAndSend("/topic/chat/" + storeId, chatMessageResponse);
    }
}
