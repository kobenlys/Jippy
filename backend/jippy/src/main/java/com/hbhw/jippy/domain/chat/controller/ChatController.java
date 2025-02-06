package com.hbhw.jippy.domain.chat.controller;

import com.hbhw.jippy.domain.chat.dto.request.CreateChatRequest;
import com.hbhw.jippy.domain.chat.dto.response.ChatListResponse;
import com.hbhw.jippy.domain.chat.dto.response.MessageResponse;
import com.hbhw.jippy.domain.chat.entity.StoreChat;
import com.hbhw.jippy.domain.chat.service.ChatService;
import com.hbhw.jippy.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "ChatController", description = "채팅 관련 API")
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @Operation(summary = "채팅방 목록 조회", description = "사용자가 가입된 채팅방 목록을 가져옵니다.")
    @GetMapping("/{userId}")
    public ApiResponse<List<ChatListResponse>> getList(@PathVariable Integer userId) {
        return ApiResponse.success(chatService.getChatList(userId));
    }

    @Operation(summary = "채팅 메시지 조회", description = "특정 채팅방의 메시지 목록을 가져옵니다.")
    @GetMapping("/{userId}/select/{storeId}")
    public ApiResponse<List<MessageResponse>> getMessages(@PathVariable Integer storeId) {
        return ApiResponse.success(chatService.getMessages(storeId));
    }

    @Operation(summary = "채팅방 생성", description = "새로운 채팅방을 생성합니다.")
    @PostMapping("/{storeId}")
    public ApiResponse<StoreChat> createChat(@RequestBody CreateChatRequest request) {
        return ApiResponse.success(chatService.createChat(request));
    }

    @Operation(summary = "채팅방 나가기", description = "사용자가 특정 채팅방에서 나갑니다.")
    @PatchMapping("/{storeId}/delete/{receiverId}")
    public ApiResponse<Void> leaveChat(@PathVariable Integer storeId, @PathVariable String receiverId) {
        chatService.leaveChat(storeId, receiverId);
        return ApiResponse.success(HttpStatus.OK);
    }
}
