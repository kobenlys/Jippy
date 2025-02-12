package com.hbhw.jippy.domain.payment.repository;

import com.hbhw.jippy.domain.payment.dto.response.SalesByDayResponse;
import com.hbhw.jippy.domain.payment.dto.response.SalesResponse;
import com.hbhw.jippy.domain.payment.entity.PaymentHistory;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentHistoryRepository extends MongoRepository<PaymentHistory, Integer> {

    List<PaymentHistory> findByStoreId(Integer storeId, Sort sort);

    List<PaymentHistory> findByStoreIdAndPaymentStatus(Integer storeId, String paymentStatus, Sort sort);

    Optional<PaymentHistory> findByUUID(String UUID);

    @Aggregation(pipeline = {
            "{ $match: { store_id: ?0, updated_at: { $gte: ?1, $lt: ?2 } } }",
            "{ $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: { $toDate: '$updated_at' } } }," +
                    " totalSales: { $sum: { $convert: { input: '$total_cost', to: 'double', onError: 0, onNull: 0 } } } } }",
            "{ $project: { date: '$_id', totalSales: '$totalSales', _id: 0 } }",
            "{ $sort: { date: 1 } }"
    })
    Optional<List<SalesResponse>> getDailySales(Integer storeId, String startDate, String endDate);

    // 주별 매출 조회
    @Aggregation(pipeline = {
            "{ $match: { store_id: ?0, updated_at: { $gte: ?1, $lt: ?2 } } }",
            "{ $group: { _id: { $dateToString: { format: '%Y-%U', date: { $toDate: '$updated_at' } } }," +
                    " totalSales: { $sum: { $convert: { input: '$total_cost', to: 'double', onError: 0, onNull: 0 } } } } }",
            "{ $project: { date: '$_id', totalSales: '$totalSales', _id: 0 } }",
            "{ $sort: { date: 1 } }"
    })
    Optional<List<SalesResponse>> getWeeklySales(Integer storeId, String startDate, String endDate);


    // 월별 매출 조회
    @Aggregation(pipeline = {
            "{ $match: { store_id: ?0, updated_at: { $gte: ?1, $lt: ?2 } } }",
            "{ $group: { _id: { $dateToString: { format: '%Y-%m', date: { $toDate: '$updated_at' } } }," +
                    " totalSales: { $sum: { $convert: { input: '$total_cost', to: 'double', onError: 0, onNull: 0 } } } } }",
            "{ $project: { date: '$_id', totalSales: '$totalSales', _id: 0 } }",
            "{ $sort: { date: 1 } }"
    })
    Optional<List<SalesResponse>> getMonthlySales(Integer storeId, String startDate, String endDate);

}
