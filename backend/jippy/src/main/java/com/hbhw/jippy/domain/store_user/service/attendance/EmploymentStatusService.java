package com.hbhw.jippy.domain.store_user.service.attendance;

import com.hbhw.jippy.domain.store_user.dto.request.attendance.CheckInRequest;
import com.hbhw.jippy.domain.store_user.dto.response.attendance.CheckInResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmploymentStatusService {
    @Transactional
    public void checkIn(CheckInRequest request, Integer storeUserStaffId) {
        //
    }
}
