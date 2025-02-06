package com.hbhw.jippy.domain.storeuser.repository.attendance;

import com.hbhw.jippy.domain.storeuser.entity.attendance.AttendanceStatus;
import org.springframework.data.repository.CrudRepository;

public interface AttendanceStatusRepository extends CrudRepository<AttendanceStatus, String> {
}
