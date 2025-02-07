package com.hbhw.jippy.domain.storeuser.service.attendance;

import com.hbhw.jippy.domain.store.entity.Store;
import com.hbhw.jippy.domain.store.repository.StoreRepository;
import com.hbhw.jippy.domain.storeuser.dto.request.attendance.TempChangeRequest;
import com.hbhw.jippy.domain.storeuser.dto.response.attendance.CheckInResponse;
import com.hbhw.jippy.domain.storeuser.dto.response.attendance.CheckOutResponse;
import com.hbhw.jippy.domain.storeuser.dto.response.attendance.TempChangeResponse;
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
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
    private final RedisTemplate<String, String> redisTemplate;

    private static final String TEMP_SCHEDULE_PREFIX = "temp:schedule:";

    @Transactional
    public CheckInResponse checkIn(Integer storeId, Integer userStaffId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 매장입니다."));

        StoreUserStaff staff = storeStaffRepository.findByUserStaffId(userStaffId)
                .orElseThrow(() -> new NoSuchElementException("매장 직원 정보를 찾을 수 없습니다."));

        String startTime = DateTimeUtils.nowString();
        validateCheckInTime(staff, DateTimeUtils.parseDateTime(startTime));

        Boolean isLate = checkIfLate(staff, DateTimeUtils.parseDateTime(startTime));

        EmploymentStatus status = EmploymentStatus.builder()
                .store(store)
                .storeUserStaff(staff)
                .startDate(startTime)
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
                .id(staff.getId())
                .staffName(staff.getUserStaff().getName())
                .build();

        AttendanceStatus savedStatus = attendanceStatusRepository.save(attendanceStatus);
        log.info("출근 상태 저장 완료 => id: {}, staffName: {}", savedStatus.getId(), savedStatus.getStaffName());

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
        validateCheckOutTime(staff, DateTimeUtils.parseDateTime(endTime));

        Boolean isEarlyLeave = checkIfEarlyLeave(staff, DateTimeUtils.parseDateTime(endTime));
        Integer totalWorkTime = calculateTotalWorkTime(
                DateTimeUtils.parseDateTime(status.getStartDate()),
                DateTimeUtils.parseDateTime(endTime)
        );

        status.setEndDate(endTime);
        status.setIsEarlyLeave(isEarlyLeave);
        status.setTotalWorkTime(totalWorkTime);

        attendanceStatusRepository.deleteById(staff.getId());

        return CheckOutResponse.of(status);
    }

    @Transactional
    public TempChangeResponse changeTempSchedule(Integer storeId, Integer storeUserStaffId, TempChangeRequest request) {
        StoreUserStaff staff = storeStaffRepository.findById(storeUserStaffId)
                .orElseThrow(() -> new NoSuchElementException("매장 직원 정보를 찾을 수 없습니다."));

        if (!staff.getStore().getId().equals(storeId)) {
            throw new NoSuchElementException("매장을 찾을 수 없습니다.");
        }

        /**
         * Redis에 임시 스케줄 저장
         */
        String key = TEMP_SCHEDULE_PREFIX + storeUserStaffId + ":" + request.getNewDate();
        String value = request.getNewStartTime() + "|" + request.getNewEndTime();
        Duration ttl = Duration.between(LocalDateTime.now(), LocalDate.parse(request.getNewDate()).plusDays(1).atStartOfDay());

        redisTemplate.opsForValue().set(key, value, ttl);

        return TempChangeResponse.builder()
                .storeUserStaffId(storeUserStaffId)
                .newDate(request.getNewDate())
                .newStartTime(request.getNewStartTime())
                .newEndTime(request.getNewEndTime())
                .build();
    }

    /**
     * 지각 확인 메서드
     */
    private Boolean checkIfLate(StoreUserStaff staff, LocalDateTime currentTime) {
        Calendar schedule = getSchedule(staff, currentTime);
        String currentTimeStr = String.format("%02d:%02d", currentTime.getHour(), currentTime.getMinute());

        return currentTimeStr.compareTo(schedule.getStartTime()) > 0;
    }

    /**
     * 조퇴 확인 메서드
     */
    private Boolean checkIfEarlyLeave(StoreUserStaff staff, LocalDateTime currentTime) {
        Calendar schedule = getSchedule(staff, currentTime);
        String currentTimeStr = String.format("%02d:%02d", currentTime.getHour(), currentTime.getMinute());

        return currentTimeStr.compareTo(schedule.getEndTime()) < 0;
    }

    /**
     * 총 근무 시간 계산 메서드
     */
    private Integer calculateTotalWorkTime(LocalDateTime startTime, LocalDateTime endTime) {
        return (int) Duration.between(startTime, endTime).toMinutes();
    }

    /**
     * 해당 요일의 근무 스케줄 찾는 메서드
     */
    private Calendar getSchedule(StoreUserStaff staff, LocalDateTime currentTime) {
        Integer dayValue = currentTime.getDayOfWeek().getValue();
        DayOfWeek dayOfWeek = DayOfWeek.ofLegacyCode(dayValue);

        // 임시 스케줄 먼저 조회
        String key = TEMP_SCHEDULE_PREFIX + staff.getId() + ":" + currentTime.toLocalDate();
        String tempSchedule = redisTemplate.opsForValue().get(key);

        if (tempSchedule != null) {
            String[] times = tempSchedule.split("[|]");
            return Calendar.builder()
                    .storeUserStaff(staff)
                    .dayOfWeek(dayOfWeek)
                    .startTime(times[0])
                    .endTime(times[1])
                    .build();
        }

        // 기존 스케줄 반환
        return calendarRepository.findByStoreUserStaffAndDayOfWeek(staff, dayOfWeek)
                .orElseThrow(() -> new NoSuchElementException("해당 요일의 스케줄을 찾을 수 없습니다."));
    }

    /**
     * 출근 가능 시간 검증 메서드
     * => 출근 10분 전부터 퇴근 이전까지 가능
     */
    private void validateCheckInTime(StoreUserStaff staff, LocalDateTime currentTime) {
        Calendar schedule = getSchedule(staff, currentTime);

        LocalTime currentTimeOfDay = currentTime.toLocalTime();
        LocalTime startTime = DateTimeUtils.parseTime(schedule.getStartTime());
        LocalTime endTime = DateTimeUtils.parseTime(schedule.getEndTime());
        LocalTime availableTime = startTime.minusMinutes(10);

        if (currentTimeOfDay.isBefore(availableTime) || currentTimeOfDay.isAfter(endTime)) {
            throw new IllegalArgumentException("출근 가능 시간이 아닙니다.");
        }
    }

    /**
     * 퇴근 가능 시간 검증 메서드
     * => 출근 이후부터 퇴근 10분 후까지 가능
     */
    private void validateCheckOutTime(StoreUserStaff staff, LocalDateTime currentTime) {
        Calendar schedule = getSchedule(staff, currentTime);

        LocalTime currentTimeOfDay = currentTime.toLocalTime();
        LocalTime startTime = DateTimeUtils.parseTime(schedule.getStartTime());
        LocalTime endTime = DateTimeUtils.parseTime(schedule.getEndTime());
        LocalTime availableTime = endTime.plusMinutes(10);

        if (currentTimeOfDay.isBefore(startTime) || currentTimeOfDay.isAfter(availableTime)) {
            throw new IllegalArgumentException("퇴근 가능 시간이 아닙니다.");
        }
    }
}
