package com.hbhw.jippy.domain.payment.controller;


import com.hbhw.jippy.domain.payment.dto.request.PaymentUUIDRequest;
import com.hbhw.jippy.domain.payment.dto.response.PaymentHistoryListResponse;
import com.hbhw.jippy.domain.payment.entity.BuyProduct;
import com.hbhw.jippy.domain.payment.entity.PaymentHistory;
import com.hbhw.jippy.domain.payment.enums.PaymentStatus;
import com.hbhw.jippy.domain.payment.enums.PaymentType;
import com.hbhw.jippy.domain.payment.service.PaymentHistoryService;
import com.hbhw.jippy.domain.product.dto.request.CreateProductRequest;
import com.hbhw.jippy.global.response.ApiResponse;
import com.hbhw.jippy.utils.DateTimeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/payment-history")
public class PaymentHistoryController {

    private final PaymentHistoryService paymentHistoryService;

    /**
     * 결제 후 결제 내역 저장하는 테스트 API
     * 결제 도메인 완성 전까지 사용하시면 됩니다.
     */
    @GetMapping("/add")
    public ApiResponse<?> addTestPaymentHistory(@RequestParam("storeId") Integer storeId) {

        // 덤프 데이터 (삭제 예정)
        BuyProduct buyProduct1 = BuyProduct.builder()
                .productId(1)
                .productCategory(101)
                .productQuantity(2)
                .price(1000)
                .build();

        BuyProduct buyProduct2 = BuyProduct.builder()
                .productId(2)
                .productCategory(102)
                .productQuantity(1)
                .price(500)
                .build();

        List<BuyProduct> buyProductHistories = new ArrayList<>();
        buyProductHistories.add(buyProduct1);
        buyProductHistories.add(buyProduct2);

        PaymentHistory paymentHistory = PaymentHistory.builder()
                .UUID("payment-uuid-001")  // 예시 UUID
                .storeId(1)  // 예시 storeId
                .paymentStatus(PaymentStatus.PURCHASE)
                .paymentType(PaymentType.QRCODE)
                .createdAt(DateTimeUtils.nowString())
                .buyProductHistories(buyProductHistories)
                .totalCost(250000)
                .build();

        paymentHistoryService.savePaymentHistory(paymentHistory);
        return ApiResponse.success(HttpStatus.CREATED);
    }

    @GetMapping("/list")
    public ApiResponse<List<PaymentHistoryListResponse>> getAllPaymentHistory(@RequestParam("storeId") Integer storeId) {
        List<PaymentHistoryListResponse> paymentHistoryListResponses = paymentHistoryService.getPaymentHistoryList(storeId);
        return ApiResponse.success(HttpStatus.OK, paymentHistoryListResponses);
    }

    @PutMapping("/cancel")
    public ApiResponse<List<PaymentHistoryListResponse>> cancelPaymentHistory(@RequestBody PaymentUUIDRequest paymentUUIDRequest) {
        paymentHistoryService.deletePaymentHistory(paymentUUIDRequest);
        return ApiResponse.success(HttpStatus.OK);
    }

    @GetMapping("/detail")

//    @GetMapping("/success/list")
//
//    @GetMapping("/cancel/list")

}
