package com.hbhw.jippy.domain.store_user.service.calendar;

import com.hbhw.jippy.domain.store_user.dto.request.calendar.CreateScheduleRequest;
import com.hbhw.jippy.domain.store_user.entity.StoreUserStaff;
import com.hbhw.jippy.domain.store_user.entity.calendar.Calendar;
import com.hbhw.jippy.domain.store_user.repository.StoreStaffRepository;
import com.hbhw.jippy.domain.store_user.repository.calendar.CalendarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class CalendarService {
    private final StoreStaffRepository storeStaffRepository;
    private final CalendarRepository calendarRepository;

    @Transactional
    public void createSchedule(Integer storeId, Integer staffId, CreateScheduleRequest request) {
        StoreUserStaff staff = storeStaffRepository.findByStoreIdAndUserStaffId(storeId, staffId)
                .orElseThrow(() -> new NoSuchElementException("매장의 직원 정보를 찾을 수 없습니다."));

        Calendar calendar = Calendar.builder()
                .storeUserStaff(staff)
                .dayOfWeek(request.getDayOfWeek())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        calendarRepository.save(calendar);
    }
}
