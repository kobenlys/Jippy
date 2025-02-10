package com.hbhw.jippy.domain.payment.service;

import com.hbhw.jippy.domain.payment.dto.request.PaymentUUIDRequest;
import com.hbhw.jippy.domain.payment.dto.response.PaymentDetailResponse;
import com.hbhw.jippy.domain.payment.dto.response.PaymentHistoryListResponse;
import com.hbhw.jippy.domain.payment.entity.PaymentHistory;
import com.hbhw.jippy.domain.payment.enums.PaymentStatus;
import com.hbhw.jippy.domain.payment.enums.PaymentType;
import com.hbhw.jippy.domain.payment.mapper.PaymentMapper;
import com.hbhw.jippy.domain.payment.repository.PaymentHistoryCustomRepository;
import com.hbhw.jippy.domain.payment.repository.PaymentHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class PaymentHistoryService {

    private final PaymentHistoryRepository paymentHistoryRepository;
    private final PaymentHistoryCustomRepository paymentHistoryCustomRepository;

    /**
     * 결재내역 저장
     */
    public void savePaymentHistory(PaymentHistory paymentHistory) {



        paymentHistoryRepository.save(paymentHistory);
    }

    /**
     * 결제내역 전체 리스트 조회
     */
    public List<PaymentHistoryListResponse> getPaymentHistoryList(Integer storeId) {
        List<PaymentHistory> paymentHistoryEntity = paymentHistoryRepository
                .findByStoreId(storeId, Sort.by(Sort.Direction.DESC, "createdAt"));

        return paymentHistoryEntity.stream()
                .map(PaymentMapper::convertPaymentHistoryListResponse)
                .toList();
    }

    /**
     * 결제내역 상태 변경
     */
    public void changeStatusPaymentHistory(PaymentUUIDRequest paymentUUIDRequest) {
        PaymentHistory paymentHistoryEntity = getPaymentHistory(paymentUUIDRequest.getPaymentUUID());
        // 상태 변경 : 구매 -> 취소, 취소 -> 구매
        String changedStatus = paymentHistoryEntity.getPaymentStatus()
                .equals(PaymentStatus.PURCHASE.getDescription()) ?
                PaymentStatus.CANCEL.getDescription() : PaymentStatus.PURCHASE.getDescription();
        paymentHistoryCustomRepository.updateStatusHistory(paymentHistoryEntity.getUUID(), changedStatus);
    }

    /**
     * 결제내역 타입 변경
     */
    public void changeTypePaymentHistory(PaymentUUIDRequest paymentUUIDRequest) {
        PaymentHistory paymentHistoryEntity = getPaymentHistory(paymentUUIDRequest.getPaymentUUID());
        // 타입 변경 : QR -> CASH, CASH -> QR
        String changedType = paymentHistoryEntity.getPaymentType()
                .equals(PaymentType.QRCODE.getDescription()) ?
                PaymentType.CASH.getDescription() : PaymentType.QRCODE.getDescription();
        paymentHistoryCustomRepository.updateTypeHistory(paymentHistoryEntity.getUUID(), changedType);
    }

    /**
     * 결제내역 상세 조회
     */
    public PaymentDetailResponse selectDetailPaymentHistory(PaymentUUIDRequest paymentUUIDRequest) {
        PaymentHistory paymentHistoryEntity = getPaymentHistory(paymentUUIDRequest.getPaymentUUID());
        return PaymentDetailResponse.builder()
                .paymentType(paymentHistoryEntity.getPaymentType())
                .paymentStatus(paymentHistoryEntity.getPaymentStatus())
                .buyProduct(paymentHistoryEntity.getBuyProductHistories())
                .totalCost(paymentHistoryEntity.getTotalCost())
                .createdAt(paymentHistoryEntity.getCreatedAt())
                .UUID(paymentHistoryEntity.getUUID())
                .build();
    }

    /**
     * 결제내역 중 "구매" 상태만 목록 조회
     */
    public List<PaymentHistoryListResponse> getSuccessHistoryList(Integer storeId) {
        List<PaymentHistory> paymentHistoryEntity = getHistoryByPaymentStatus(storeId, PaymentStatus.PURCHASE.getDescription());
        return paymentHistoryEntity.stream()
                .map(PaymentMapper::convertPaymentHistoryListResponse)
                .toList();
    }

    /**
     * 결제내역 중 "취소" 상태만 목록 조회
     */
    public List<PaymentHistoryListResponse> getCancelHistoryList(Integer storeId) {
        List<PaymentHistory> paymentHistoryEntity = getHistoryByPaymentStatus(storeId, PaymentStatus.CANCEL.getDescription());

        return paymentHistoryEntity.stream()
                .map(PaymentMapper::convertPaymentHistoryListResponse)
                .toList();
    }

    /**
     * 결제내역을 상태, 최신 순으로 가져오는 메서드
     */
    public List<PaymentHistory> getHistoryByPaymentStatus(Integer storeId, String statusDesc) {
        return paymentHistoryRepository
                .findByStoreIdAndPaymentStatus(storeId, statusDesc, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    /**
     * UUID 결제내역을 가져오는 메서드
     */
    public PaymentHistory getPaymentHistory(String UUID) {
        return paymentHistoryRepository.findByUUID(UUID)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 결제기록 입니다."));
    }
}
