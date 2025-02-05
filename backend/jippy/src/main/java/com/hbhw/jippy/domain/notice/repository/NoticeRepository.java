package com.hbhw.jippy.domain.notice.repository;

import com.hbhw.jippy.domain.notice.entity.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    @Query("SELECT n FROM Notice n WHERE n.storeId.id = :storeId")
    Page<Notice> findAllByStoreId_Id(Integer storeId, Pageable pageable);
}
