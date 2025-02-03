package com.hbhw.jippy.domain.store_user.dto.response.attendance;

import com.hbhw.jippy.domain.store_user.entity.attendance.EmploymentStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CheckOutResponse {
    private String checkOutTime;
    private Boolean isEarlyLeave;
    private Integer totalWorkTime;

    public static CheckOutResponse of(EmploymentStatus status) {
        return CheckOutResponse.builder()
                .checkOutTime(status.getEndDate())
                .isEarlyLeave(status.getIsEarlyLeave())
                .totalWorkTime(status.getTotalWorkTime())
                .build();
    }
}
