package com.hbhw.jippy.domain.payment.repository;

import com.hbhw.jippy.domain.payment.entity.PaymentHistory;
import jakarta.transaction.Transactional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentHistoryRepository extends MongoRepository<PaymentHistory, Integer> {

    List<PaymentHistory> findByStoreId(Integer storeId);

    Optional<PaymentHistory> findByUUID(String UUID);

}
