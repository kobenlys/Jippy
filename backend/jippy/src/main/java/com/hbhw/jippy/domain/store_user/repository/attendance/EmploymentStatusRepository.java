package com.hbhw.jippy.domain.store_user.repository.attendance;

import com.hbhw.jippy.domain.store_user.entity.attendance.EmploymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmploymentStatusRepository extends JpaRepository<EmploymentStatus, Long> {
}
