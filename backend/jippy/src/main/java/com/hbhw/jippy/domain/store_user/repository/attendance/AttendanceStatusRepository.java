package com.hbhw.jippy.domain.store_user.repository.attendance;

import com.hbhw.jippy.domain.store_user.entity.attendance.AttendanceStatus;
import org.springframework.data.repository.CrudRepository;

public interface AttendanceStatusRepository extends CrudRepository<AttendanceStatus, String> {
}
