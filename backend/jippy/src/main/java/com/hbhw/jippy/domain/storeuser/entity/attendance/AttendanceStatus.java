package com.hbhw.jippy.domain.storeuser.entity.attendance;

import com.hbhw.jippy.utils.DateTimeUtils;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.redis.core.RedisHash;

/**
 * 실시간 출근 현황 확인용 Redis
 */
@Getter
@Builder
@AllArgsConstructor
@RedisHash("attendance")
public class AttendanceStatus {
    @Id
    private String id;
    private Integer storeUserStaffId;
    private String staffName;
    private String timestamp;

    public static String generateId(Integer storeUserStaffId) {
        return String.format("%d:%d:%s", storeUserStaffId, DateTimeUtils.todayString());
    }
}
