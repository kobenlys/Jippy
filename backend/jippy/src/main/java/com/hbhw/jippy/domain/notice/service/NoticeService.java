package com.hbhw.jippy.domain.notice.service;

import com.hbhw.jippy.domain.notice.dto.request.NoticeRequest;
import com.hbhw.jippy.domain.notice.dto.response.NoticeResponse;
import com.hbhw.jippy.domain.notice.entity.Notice;
import com.hbhw.jippy.domain.notice.repository.NoticeRepository;
import com.hbhw.jippy.domain.store.entity.Store;
import com.hbhw.jippy.global.code.CommonErrorCode;
import com.hbhw.jippy.global.error.BusinessException;
import com.hbhw.jippy.utils.DateTimeUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
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
    @Transactional(readOnly = true)
    public NoticeResponse getNotice(Integer storeId, Long noticeId) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new BusinessException(CommonErrorCode.NOT_FOUND, "존재하지 않는 공지사항입니다"));

        if (!notice.getStoreId().getId().equals(storeId)) {
            throw new BusinessException(CommonErrorCode.BAD_REQUEST, "해당 매장의 공지사항이 아닙니다");
        }

        return convertToResponse(notice);
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
