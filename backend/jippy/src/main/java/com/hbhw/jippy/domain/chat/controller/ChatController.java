package com.hbhw.jippy.domain.chat.controller;

import com.hbhw.jippy.domain.chat.dto.request.CreateChatRequest;
import com.hbhw.jippy.domain.chat.dto.response.ChatListResponse;
import com.hbhw.jippy.domain.chat.dto.response.MessageResponse;
import com.hbhw.jippy.domain.chat.entity.StoreChat;
import com.hbhw.jippy.domain.chat.service.ChatService;
import com.hbhw.jippy.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    /*
        채팅창 목록 불러오기
        - 사용자 가입된 매장 리스트 불러오는 API 통해서 (여기서는 구현 X)

     */

    @GetMapping("/select/{storeId}")
    public ApiResponse<List<MessageResponse>> getMessages(@PathVariable Integer storeId) {
        return ApiResponse.success(chatService.getMessages(storeId));
    }

    @PostMapping("/{storeId}")
    public ApiResponse<StoreChat> createChat(@RequestBody CreateChatRequest request) {
        return ApiResponse.success(chatService.createChat(request));
    }

    @PatchMapping("/{storeId}/delete/{receiverId}")
    public ApiResponse<Void> leaveChat(@PathVariable Integer storeId, @PathVariable String receiverId) {
        chatService.leaveChat(storeId, receiverId);
        return ApiResponse.success(HttpStatus.OK);
    }
}

