package com.hbhw.jippy.domain.store_user.service.attendance;

import com.hbhw.jippy.domain.store.entity.Store;
import com.hbhw.jippy.domain.store_user.dto.request.attendance.CheckInRequest;
import com.hbhw.jippy.domain.store_user.dto.response.attendance.CheckInResponse;
import com.hbhw.jippy.domain.store_user.dto.response.attendance.CheckOutResponse;
import com.hbhw.jippy.domain.store_user.entity.StoreUserStaff;
import com.hbhw.jippy.domain.store_user.entity.attendance.AttendanceStatus;
import com.hbhw.jippy.domain.store_user.entity.attendance.EmploymentStatus;
import com.hbhw.jippy.domain.store_user.repository.StoreStaffRepository;
import com.hbhw.jippy.domain.store_user.repository.attendance.AttendanceStatusRepository;
import com.hbhw.jippy.domain.store_user.repository.attendance.EmploymentStatusRepository;
import com.hbhw.jippy.utils.DateTimeUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    private final StoreStaffRepository storeStaffRepository;
    private final EmploymentStatusRepository employmentStatusRepository;
    private final AttendanceStatusRepository attendanceStatusRepository;

    @Transactional
    public CheckInResponse checkIn(CheckInRequest request, Integer userStaffId) {
        /**
         * Store store = storeRepository.findById(request.getStoreId())
         *                 .orElseThrow(() -> new NoSuchElementException("존재하지 않는 매장입니다."));
         */

        StoreUserStaff staff = storeStaffRepository.findByUserStaffId(userStaffId)
                .orElseThrow(() -> new NoSuchElementException("매장 직원 정보를 찾을 수 없습니다."));

        String currentTime = DateTimeUtils.nowString();

        Boolean isLate = checkIfLate(staff, DateTimeUtils.parseDateTime(currentTime));

        EmploymentStatus status = EmploymentStatus.builder()
                .store(Store.builder().id(request.getStoreId()).build())
                .storeUserStaff(staff)
                .startDate(currentTime)
                .endDate("9999-12-31 23:59:59")  // 퇴근 전 임시값
                .totalWorkTime(0)                // 퇴근 전 임시값
                .isLate(isLate)
                .isEarlyLeave(false)             // 퇴근 전 기본값
                .build();

        employmentStatusRepository.save(status);

        /**
         * Redis에 실시간 출근 상태 저장
         */
        AttendanceStatus attendanceStatus = AttendanceStatus.builder()
                .id(AttendanceStatus.generateId(staff.getId()))
                .staffName(staff.getUserStaff().getName())
                .timestamp(currentTime)
                .build();

        attendanceStatusRepository.save(attendanceStatus);

        return CheckInResponse.of(status);
    }

    @Transactional
    public CheckOutResponse checkOut(Integer userStaffId) {
        StoreUserStaff staff = storeStaffRepository.findByUserStaffId(userStaffId)
                .orElseThrow(() -> new NoSuchElementException("매장 직원 정보를 찾을 수 없습니다."));

        String today = DateTimeUtils.todayString();

        EmploymentStatus status = employmentStatusRepository.findTodayAttendance(staff.getId(), today)
                .orElseThrow(() -> new NoSuchElementException("출근 기록이 없습니다."));

        String endTime = DateTimeUtils.nowString();

        Boolean isEarlyLeave = checkIfEarlyLeave(staff, DateTimeUtils.parseDateTime(endTime));
        Integer totalWorkTime = calculateTotalWorkTime(
                DateTimeUtils.parseDateTime(status.getStartDate()),
                DateTimeUtils.parseDateTime(endTime)
        );

        status.setEndDate(endTime);
        status.setIsEarlyLeave(isEarlyLeave);
        status.setTotalWorkTime(totalWorkTime);

        String id = AttendanceStatus.generateId(staff.getId());
        attendanceStatusRepository.deleteById(id);

        return CheckOutResponse.of(status);
    }

    private Boolean checkIfLate(StoreUserStaff staff, LocalDateTime currentTime) {
        /**
         * 실제 스케줄과 비교 로직
         */
        return false;
    }

    private Boolean checkIfEarlyLeave(StoreUserStaff staff, LocalDateTime currentTime) {
        /**
         * 실제 스케줄과 비교 로직
         */
        return false;
    }

    private Integer calculateTotalWorkTime(LocalDateTime startTime, LocalDateTime endTime) {
        return (int) Duration.between(startTime, endTime).toMinutes();
    }
}
