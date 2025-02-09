package com.hbhw.jippy.domain.storeuser.repository.attendance;

import com.hbhw.jippy.domain.storeuser.entity.attendance.AttendanceStatus;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceStatusRepository extends CrudRepository<AttendanceStatus, Integer> {
}
