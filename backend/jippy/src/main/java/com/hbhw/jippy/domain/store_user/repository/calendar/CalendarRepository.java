package com.hbhw.jippy.domain.store_user.repository.calendar;

import com.hbhw.jippy.domain.store_user.entity.calendar.Calendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Integer> {
    @Query("SELECT c FROM Calendar c " +
            "JOIN FETCH c.storeUserStaff sus " +
            "JOIN FETCH sus.userStaff " +
            "WHERE sus.storeId = :storeId")
    List<Calendar> findAllByStoreId(Integer storeId);

    @Query("SELECT c FROM Calendar c " +
            "JOIN FETCH c.storeUserStaff sus " +
            "JOIN FETCH sus.userStaff " +
            "WHERE sus.storeId = :storeId " +
            "AND sus.userStaff.id = :staffId")
    List<Calendar> findAllByStoreIdAndStaffId(Integer storeId, Integer staffId);
}
