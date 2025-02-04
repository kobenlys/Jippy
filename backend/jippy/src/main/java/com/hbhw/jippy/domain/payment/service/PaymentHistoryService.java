package com.hbhw.jippy.domain.payment.service;

import com.hbhw.jippy.domain.payment.dto.request.PaymentUUIDRequest;
import com.hbhw.jippy.domain.payment.dto.response.PaymentHistoryListResponse;
import com.hbhw.jippy.domain.payment.entity.PaymentHistory;
import com.hbhw.jippy.domain.payment.mapper.PaymentMapper;
import com.hbhw.jippy.domain.payment.repository.PaymentHistoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class PaymentHistoryService {

    private final PaymentHistoryRepository paymentHistoryRepository;

    public void savePaymentHistory(PaymentHistory paymentHistory){
        paymentHistoryRepository.save(paymentHistory);
    }

    public List<PaymentHistoryListResponse> getPaymentHistoryList(Integer storeId){
        List<PaymentHistory> paymentHistoryEntity = paymentHistoryRepository.findByStoreId(storeId);

        return paymentHistoryEntity.stream()
                .map(PaymentMapper::convertPaymentHistoryListResponse)
                .toList();
    }

    public void deletePaymentHistory(PaymentUUIDRequest paymentUUIDRequest) {
        PaymentHistory paymentHistoryEntity = getPaymentHistory(paymentUUIDRequest.getUUID());
        paymentHistoryRepository.delete(paymentHistoryEntity);
    }

    public PaymentHistory getPaymentHistory(String UUID) {
        return paymentHistoryRepository.findByUUID(UUID)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 결제기록 입니다."));
    }


}
