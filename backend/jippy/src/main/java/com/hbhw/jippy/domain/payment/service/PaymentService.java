package com.hbhw.jippy.domain.payment.service;

import com.hbhw.jippy.domain.cash.service.CashService;
import com.hbhw.jippy.domain.payment.dto.request.ConfirmCashPaymentRequest;
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
    private final PaymentHistoryService paymentHistoryService;
    private final UUIDProvider uuidProvider;
    private final StockStatusService stockStatusService;
    private final StockService stockService;
    private final RecipeService recipeService;


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

        List<InventoryItem> inventoryItemList = stockService.getInventoryItemList(storeId);
        List<StockStatusService.StockUpdateInfo> stockUpdateInfoList = new ArrayList<>();

        for (PaymentProductInfoRequest product : confirmCashPaymentRequest.getProductList()) {
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

        // log
        for(StockStatusService.StockUpdateInfo nd : stockUpdateInfoList){
            System.out.println(nd);
        }

        stockStatusService.updateBatchStockStatus(storeId, stockUpdateInfoList);
        paymentHistoryService.savePaymentHistory(paymentHistoryEntity);
    }




}
