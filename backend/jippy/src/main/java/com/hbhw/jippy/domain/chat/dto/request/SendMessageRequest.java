package com.hbhw.jippy.domain.chat.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendMessageRequest {
    private String receiverId;
    private String messageContent;
    private String messageType;
}
