package com.hbhw.jippy.domain.payment.repository;

import com.hbhw.jippy.domain.payment.entity.PaymentHistory;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentHistoryRepository extends MongoRepository<PaymentHistory, Integer> {

    List<PaymentHistory> findByStoreId(Integer storeId, Sort sort);

    List<PaymentHistory> findByStoreIdAndPaymentStatus(Integer storeId, String paymentStatus, Sort sort);

    Optional<PaymentHistory> findByUUID(String UUID);
}
