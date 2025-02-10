package com.hbhw.jippy.domain.payment.service;

import com.hbhw.jippy.domain.cash.service.CashService;
import com.hbhw.jippy.domain.payment.dto.request.ConfirmCashPaymentRequest;
import com.hbhw.jippy.domain.payment.dto.request.PaymentProductInfoRequest;
import com.hbhw.jippy.domain.payment.entity.BuyProduct;
import com.hbhw.jippy.domain.payment.entity.PaymentHistory;
import com.hbhw.jippy.domain.payment.enums.PaymentStatus;
import com.hbhw.jippy.domain.payment.enums.PaymentType;
import com.hbhw.jippy.domain.product.entity.Product;
import com.hbhw.jippy.domain.product.service.ProductService;
import com.hbhw.jippy.domain.stock.service.StockService;
import com.hbhw.jippy.utils.DateTimeUtils;
import com.hbhw.jippy.utils.UUIDProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final CashService cashService;
    private final ProductService productService;
    private final StockService stockService;
    private final PaymentHistoryService paymentHistoryService;
    private final UUIDProvider uuidProvider;


    @Transactional
    public void CashPaymentConfirm(ConfirmCashPaymentRequest confirmCashPaymentRequest) {

        Integer storeId = confirmCashPaymentRequest.getStoreId();
        cashService.updatePaymentCash(storeId, confirmCashPaymentRequest.getCashRequest());

        List<BuyProduct> buyProductList = new ArrayList<>();

        for (PaymentProductInfoRequest info : confirmCashPaymentRequest.getProductList()) {
            Product productEntity = productService.getProduct(storeId, info.getProductId());
            BuyProduct buyProduct = BuyProduct.builder()
                    .productId(productEntity.getId())
                    .price(productEntity.getPrice())
                    .productName(productEntity.getName())
                    .productCategoryId(productEntity.getProductCategory().getId())
                    .productQuantity(info.getQuantity())
                    .build();
            buyProductList.add(buyProduct);
        }

        PaymentHistory paymentHistoryEntity = PaymentHistory.builder()
                .paymentType(PaymentType.CASH.getDescription())
                .paymentStatus(PaymentStatus.PURCHASE.getDescription())
                .UUID(uuidProvider.generateUUID())
                .createdAt(DateTimeUtils.nowString())
                .totalCost(confirmCashPaymentRequest.getTotalCost())
                .storeId(confirmCashPaymentRequest.getStoreId())
                .buyProductHistories(buyProductList)
                .build();



        paymentHistoryService.savePaymentHistory(paymentHistoryEntity);
    }


}
