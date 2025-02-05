package com.hbhw.jippy.domain.notice.service;

import com.hbhw.jippy.domain.notice.dto.request.NoticeRequest;
import com.hbhw.jippy.domain.notice.dto.response.NoticeResponse;
import com.hbhw.jippy.domain.notice.entity.Notice;
import com.hbhw.jippy.domain.notice.repository.NoticeRepository;
import com.hbhw.jippy.domain.store.entity.Store;
import com.hbhw.jippy.utils.DateTimeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    @Transactional
    public NoticeResponse createNotice(Integer storeId, NoticeRequest request) {

        Notice notice = Notice.builder()
                .storeId(Store.builder().id(storeId).build())
                .title(request.getTitle())
                .content(request.getContent())
                .createdAt(DateTimeUtils.nowString())
                .author(request.getAuthor())
                .build();

        Notice savedNotice = noticeRepository.save(notice);
        return convertToResponse(savedNotice);
    }

    private NoticeResponse convertToResponse(Notice notice) {
        return NoticeResponse.builder()
                .id(notice.getId())
                .storeId(notice.getStoreId().getId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .createdAt(DateTimeUtils.nowString())
                .author(notice.getAuthor())
                .build();
    }
}
