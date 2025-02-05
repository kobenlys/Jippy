package com.hbhw.jippy.domain.notice.repository;

import com.hbhw.jippy.domain.notice.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Integer> {

}
