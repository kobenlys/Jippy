package com.hbhw.jippy.domain.store_user.repository.calendar;

import com.hbhw.jippy.domain.store_user.entity.calendar.Calendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Integer> {
}
