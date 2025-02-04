package com.hbhw.jippy.domain.store_user.repository.attendance;

import com.hbhw.jippy.domain.store_user.entity.attendance.EmploymentStatus;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmploymentStatusRepository extends JpaRepository<EmploymentStatus, Long> {
    @Query("SELECT e FROM EmploymentStatus e " +
            "WHERE e.storeUserStaff.id = :storeUserStaffId " +
            "AND e.startDate LIKE :today% " +
            "AND e.endDate = '9999-12-31 23:59:59'")
    Optional<EmploymentStatus> findTodayAttendance(@Param("storeUserStaffId") Integer storeUserStaffId,
                                                   @Param("today") String today);
}
