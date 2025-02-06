package com.hbhw.jippy.domain.storeuser.service.attendance;

import com.hbhw.jippy.domain.store.entity.Store;
import com.hbhw.jippy.domain.store.repository.StoreRepository;
import com.hbhw.jippy.domain.storeuser.dto.response.attendance.CheckInResponse;
import com.hbhw.jippy.domain.storeuser.dto.response.attendance.CheckOutResponse;
import com.hbhw.jippy.domain.storeuser.entity.calendar.Calendar;
import com.hbhw.jippy.domain.storeuser.entity.staff.StoreUserStaff;
import com.hbhw.jippy.domain.storeuser.entity.attendance.AttendanceStatus;
import com.hbhw.jippy.domain.storeuser.entity.attendance.EmploymentStatus;
import com.hbhw.jippy.domain.storeuser.enums.DayOfWeek;
import com.hbhw.jippy.domain.storeuser.repository.calendar.CalendarRepository;
import com.hbhw.jippy.domain.storeuser.repository.staff.StoreStaffRepository;
import com.hbhw.jippy.domain.storeuser.repository.attendance.AttendanceStatusRepository;
import com.hbhw.jippy.domain.storeuser.repository.attendance.EmploymentStatusRepository;
import com.hbhw.jippy.utils.DateTimeUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttendanceService {
    private final StoreStaffRepository storeStaffRepository;
    private final EmploymentStatusRepository employmentStatusRepository;
    private final AttendanceStatusRepository attendanceStatusRepository;
    private final StoreRepository storeRepository;
    private final CalendarRepository calendarRepository;

    @Transactional
    public CheckInResponse checkIn(Integer storeId, Integer userStaffId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 매장입니다."));

        StoreUserStaff staff = storeStaffRepository.findByUserStaffId(userStaffId)
                .orElseThrow(() -> new NoSuchElementException("매장 직원 정보를 찾을 수 없습니다."));

        String currentTime = DateTimeUtils.nowString();

        Boolean isLate = checkIfLate(staff, DateTimeUtils.parseDateTime(currentTime));

        EmploymentStatus status = EmploymentStatus.builder()
                .store(store)
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

        AttendanceStatus savedStatus = attendanceStatusRepository.save(attendanceStatus);
        log.info("출근 상태 저장 완료 => id: {}, staffName: {}, timestamp: {}", String.valueOf(savedStatus.getId()), savedStatus.getStaffName(), savedStatus.getTimestamp());

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

        boolean exists = attendanceStatusRepository.existsById(id);
        log.info("출근 상태 삭제 완료 => 삭제 확인: {}", exists ? "아직 존재함" : "삭제됨");

        return CheckOutResponse.of(status);
    }

    /**
     * 지각 확인 메서드
     */
    private Boolean checkIfLate(StoreUserStaff staff, LocalDateTime currentTime) {
        Integer dayValue = currentTime.getDayOfWeek().getValue();
        DayOfWeek dayOfWeek = DayOfWeek.ofLegacyCode(dayValue);

        Calendar schedule = calendarRepository.findByStoreUserStaffAndDayOfWeek(staff, dayOfWeek)
                .orElseThrow(() -> new NoSuchElementException("해당 요일의 스케줄을 찾을 수 없습니다."));

        String currentTimeStr = String.format("%02d:%02d", currentTime.getHour(), currentTime.getMinute());

        return currentTimeStr.compareTo(schedule.getStartTime()) > 0;
    }

    /**
     * 조퇴 확인 메서드
     */
    private Boolean checkIfEarlyLeave(StoreUserStaff staff, LocalDateTime currentTime) {
        Integer dayValue = currentTime.getDayOfWeek().getValue();
        DayOfWeek dayOfWeek = DayOfWeek.ofLegacyCode(dayValue);

        Calendar schedule = calendarRepository.findByStoreUserStaffAndDayOfWeek(staff, dayOfWeek)
                .orElseThrow(() -> new NoSuchElementException("해당 요일의 스케줄을 찾을 수 없습니다."));

        String currentTimeStr = String.format("%02d:%02d", currentTime.getHour(), currentTime.getMinute());

        return currentTimeStr.compareTo(schedule.getEndTime()) < 0;
    }

    private Integer calculateTotalWorkTime(LocalDateTime startTime, LocalDateTime endTime) {
        return (int) Duration.between(startTime, endTime).toMinutes();
    }
}
