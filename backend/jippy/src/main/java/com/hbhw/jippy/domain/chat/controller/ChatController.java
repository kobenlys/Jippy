package com.hbhw.jippy.domain.chat.controller;

import com.hbhw.jippy.domain.chat.dto.request.ChatMessageRequest;
import com.hbhw.jippy.domain.chat.dto.request.CreateChatRequest;
import com.hbhw.jippy.domain.chat.dto.response.ChatListResponse;
import com.hbhw.jippy.domain.chat.dto.response.ChatMessageResponse;
import com.hbhw.jippy.domain.chat.entity.StoreChat;
import com.hbhw.jippy.domain.chat.service.ChatService;
import com.hbhw.jippy.domain.storeuser.dto.response.staff.StaffResponse;
import com.hbhw.jippy.domain.storeuser.service.staff.StoreStaffService;
import com.hbhw.jippy.domain.user.entity.BaseUser;
import com.hbhw.jippy.global.fcm.FCMService;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Tag(name = "ChatController", description = "채팅 관련 API")
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    private final StoreStaffService storeStaffService;
    private final SimpMessagingTemplate messagingTemplate;
    private final FCMService fcmService;


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

    @Operation(summary = "가장 최근 메시지 조회", description = "채팅창 미리보기를 위핸 최근 메시지 조회")
    @GetMapping("/select/recent/{storeId}")
    public ApiResponse<ChatMessageResponse> getRecentMessage(@PathVariable Integer storeId) {
        ChatMessageResponse message = chatService.getMessages(storeId, 20, null).getLast();
        return ApiResponse.success(message);
    }

    @Operation(summary = "채팅창 인원수 조회", description = "특정 채팅방의 인원수를 가져옵니다.")
    @GetMapping("/count/{storeId}")
    public ApiResponse<Integer> getChatMemberCount(@PathVariable Integer storeId) {
        Integer memberCount = storeStaffService.getStaffList(storeId).size();
        return ApiResponse.success(memberCount);
    }

    @Operation(summary = "채팅방 생성", description = "새로운 채팅방을 생성합니다.")
    @PostMapping("/{storeId}")
    public void createChat(@RequestBody CreateChatRequest request) {
        chatService.createChat(request.getStoreId());
    }

    /**
     * WebSocket을 통해 메시지를 주고받음.
     * 메시지 저장 후 해당 채팅방에 참여 중인 직원과 사장님에게 FCM 알림 전송.
     */
    @MessageMapping("/chat/{storeId}/send")
    public void sendMessage(@DestinationVariable Integer storeId, @Payload ChatMessageRequest chatMessage) {
        // 1. 메시지 저장 및 WebSocket 구독자에게 전송
        ChatMessageResponse chatMessageResponse = chatService.saveMessage(storeId, chatMessage);
        messagingTemplate.convertAndSend("/topic/chat/" + storeId, chatMessageResponse);

        // 2. 해당 채팅방 멤버(직원 + 사장님)의 FCM 토큰을 조회
        List<String> fcmTokens = storeStaffService.getAllChatMemberFcmTokens(storeId);

        // 3. 발신자 토큰이 있다면, 이를 목록에서 제외 (예시: chatMessage.getSenderId()로 발신자를 식별할 수 있다고 가정)
        // 만약 발신자의 FCM 토큰을 별도로 조회할 수 있다면 아래와 같이 필터링합니다.
        // String senderToken = ...; // 발신자의 FCM 토큰
        // fcmTokens = fcmTokens.stream()
        //             .filter(token -> !token.equals(senderToken))
        //             .collect(Collectors.toList());

        // 또는 발신자 정보(senderName, senderId 등)를 데이터 payload에 포함하여,
        // 클라이언트에서 필터링하도록 할 수 있습니다.
        Map<String, String> data = new HashMap<>();
        data.put("senderName", chatMessage.getSenderId());  // 여기서는 senderId를 senderName으로 사용
        data.put("messageType", chatMessage.getMessageType());

        // 4. FCM 알림 전송 (대상은 그룹 채팅 멤버 중 보낸 사람을 제외한 경우)
        if (!fcmTokens.isEmpty()) {
            fcmService.sendGroupChatNotification(fcmTokens, "새 메시지 도착", chatMessage.getMessageContent(), data);
        }
    }

}
