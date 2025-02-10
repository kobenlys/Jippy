package com.hbhw.jippy.domain.payment.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hbhw.jippy.domain.cash.service.CashService;
import com.hbhw.jippy.domain.payment.dto.request.ConfirmCashPaymentRequest;
import com.hbhw.jippy.domain.payment.dto.request.ConfirmPaymentRequest;
import com.hbhw.jippy.domain.payment.dto.request.ConfirmQrCodePaymentRequest;
import com.hbhw.jippy.domain.payment.dto.request.PaymentProductInfoRequest;
import com.hbhw.jippy.domain.payment.entity.BuyProduct;
import com.hbhw.jippy.domain.payment.entity.PaymentHistory;
import com.hbhw.jippy.domain.payment.enums.PaymentStatus;
import com.hbhw.jippy.domain.payment.enums.PaymentType;
import com.hbhw.jippy.domain.product.entity.Ingredient;
import com.hbhw.jippy.domain.product.entity.Product;
import com.hbhw.jippy.domain.product.entity.Recipe;
import com.hbhw.jippy.domain.product.service.ProductService;
import com.hbhw.jippy.domain.product.service.RecipeService;
import com.hbhw.jippy.domain.stock.entity.InventoryItem;
import com.hbhw.jippy.domain.stock.service.StockService;
import com.hbhw.jippy.domain.stock.service.StockStatusService;
import com.hbhw.jippy.global.code.CommonErrorCode;
import com.hbhw.jippy.global.error.BusinessException;
import com.hbhw.jippy.utils.DateTimeUtils;
import com.hbhw.jippy.utils.UUIDProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final CashService cashService;
    private final ProductService productService;
    private final PaymentHistoryService paymentHistoryService;
    private final UUIDProvider uuidProvider;
    private final StockStatusService stockStatusService;
    private final StockService stockService;
    private final RecipeService recipeService;
    private final ObjectMapper objectMapper;

    @Transactional
    public void cashPaymentConfirm(ConfirmCashPaymentRequest confirmCashPaymentRequest) {
        Integer storeId = confirmCashPaymentRequest.getStoreId();
        basePaymentConfirm(confirmCashPaymentRequest);
        cashService.updatePaymentCash(storeId, confirmCashPaymentRequest.getCashRequest());
    }

    @Transactional
    public void qrCodePaymentConfirm(ConfirmQrCodePaymentRequest confirmQrCodePaymentRequest){
        try{
            HttpResponse<String> response = tossPaymentConfirm(confirmQrCodePaymentRequest);
            basePaymentConfirm(confirmQrCodePaymentRequest);
        }catch (Exception e) {
            throw new BusinessException(CommonErrorCode.INTERNAL_SERVER_ERROR, "결제서버와 연결이 불가능합니다. 다시 시도해 주세요");
        }
    }

    @Transactional
    public void basePaymentConfirm(ConfirmPaymentRequest confirmPaymentRequest){
        List<BuyProduct> buyProductList = new ArrayList<>();

        for (PaymentProductInfoRequest info : confirmPaymentRequest.getProductList()) {
            Product productEntity = productService.getProduct(confirmPaymentRequest.getStoreId(), info.getProductId());
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
                .totalCost(confirmPaymentRequest.getTotalCost())
                .storeId(confirmPaymentRequest.getStoreId())
                .buyProductHistories(buyProductList)
                .build();

        List<InventoryItem> inventoryItemList = stockService.getInventoryItemList(confirmPaymentRequest.getStoreId());
        List<StockStatusService.StockUpdateInfo> stockUpdateInfoList = new ArrayList<>();

        for (PaymentProductInfoRequest product : confirmPaymentRequest.getProductList()) {
            Recipe recipeEntity = recipeService.getRecipe(product.getProductId());

            for (Ingredient ingredient : recipeEntity.getIngredient()) {
                InventoryItem beforeInventory = new InventoryItem();

                for (InventoryItem item : inventoryItemList) {
                    if (ingredient.getName().equals(item.getStockName())) {
                        beforeInventory = item;
                        break;
                    }
                }

                InventoryItem newInventoryItem = InventoryItem.builder()
                        .stock(beforeInventory.getStock())
                        .stockName(beforeInventory.getStockName())
                        .stockTotalValue(beforeInventory.getStockTotalValue())
                        .updatedAt(beforeInventory.getUpdatedAt())
                        .build();

                StockStatusService.StockUpdateInfo stockUpdateInfo = StockStatusService.StockUpdateInfo.builder()
                        .item(newInventoryItem)
                        .decreaseAmount(ingredient.getAmount() * product.getQuantity())
                        .build();

                stockUpdateInfoList.add(stockUpdateInfo);
            }
        }

        stockStatusService.updateBatchStockStatus(confirmPaymentRequest.getStoreId(), stockUpdateInfoList);
        paymentHistoryService.savePaymentHistory(paymentHistoryEntity);
    }

    public HttpResponse<String> tossPaymentConfirm(ConfirmQrCodePaymentRequest request) throws IOException, InterruptedException {
        JsonNode json = objectMapper.createObjectNode()
                .put("orderId", request.getOrderId())
                .put("paymentKey", request.getPaymentKey())
                .put("amount", request.getAmount().intValue());
        String requestBody = objectMapper.writeValueAsString(json);
        // 이거 숨길게여...
        String secreteKey = "test_sk_ex6BJGQOVDk9Mw4M99eO3W4w2zNb";
        String auth = Base64.getEncoder().encodeToString((secreteKey+":").getBytes());

        HttpRequest confirmRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://api.tosspayments.com/v1/payments/confirm"))
                .header("Authorization", "Basic "+ auth)
                .header("Content-Type", "application/json")
                .method("POST", HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        return HttpClient.newHttpClient().send(confirmRequest, HttpResponse.BodyHandlers.ofString());
    }
}
