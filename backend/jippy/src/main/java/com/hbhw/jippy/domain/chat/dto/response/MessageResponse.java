package com.hbhw.jippy.domain.chat.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {
    private String receiverId;
    private String messageContent;
    private String timestamp;
    private String messageType;
}

