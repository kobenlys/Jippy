package com.hbhw.jippy.domain.stock.service;

import com.hbhw.jippy.domain.stock.dto.request.StockStatusRedis;
import com.hbhw.jippy.domain.stock.dto.response.LowStockInfoResponse;
import com.hbhw.jippy.domain.stock.dto.response.StockStatusResponse;
import com.hbhw.jippy.domain.stock.entity.InventoryItem;
import com.hbhw.jippy.domain.stock.entity.Stock;
import com.hbhw.jippy.domain.stock.repository.StockRepository;
import com.hbhw.jippy.domain.stock.repository.StockStatusRedisRepository;
import com.hbhw.jippy.global.code.CommonErrorCode;
import com.hbhw.jippy.global.error.BusinessException;
import com.hbhw.jippy.utils.DateTimeUtils;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockStatusService {
    private final StockRepository stockRepository;
    private final StockStatusRedisRepository stockStatusRedisRepository;

    @Data
    @Builder
    public static class StockUpdateInfo {
        private InventoryItem item;
        private int decreaseAmount;
    }

    private boolean checkIsDessert(InventoryItem item) {
        return !item.getStock().isEmpty() &&
                item.getStock().get(0).getStockUnit().equals("개") &&
                item.getStock().get(0).getStockUnitSize() == 0;
    }

    // 단일 재고 감소 처리
    @Transactional
    public void updateStockStatus(Integer storeId, InventoryItem item, int decreaseAmount) {
        StockStatusRedis status = stockStatusRedisRepository.getStatus(storeId, item.getStockName());
        String currentTime = DateTimeUtils.nowString();

        if (status == null) {
            status = StockStatusRedis.builder()
                    .initialStock(item.getStockTotalValue())
                    .soldStock(decreaseAmount)
                    .currentStock(item.getStockTotalValue() - decreaseAmount)
                    .soldPercentage(calculatePercentage(decreaseAmount, item.getStockTotalValue()))
                    .lastUpdated(currentTime)
                    .isDessert(checkIsDessert(item))
                    .isLowStock(false)
                    .build();
        } else {
            status.setSoldStock(status.getSoldStock() + decreaseAmount);
            status.setCurrentStock(item.getStockTotalValue() - status.getSoldStock());
            status.setSoldPercentage(calculatePercentage(status.getSoldStock(), status.getInitialStock()));
            status.setLastUpdated(currentTime);
        }

        checkLowStock(status);
        stockStatusRedisRepository.saveStatus(storeId, item.getStockName(), status);
    }

    // 여러 상품 처리
    @Transactional
    public void updateBatchStockStatus(Integer storeId, List<StockUpdateInfo> updates) {
        List<String> stockNames = updates.stream()
                .map(update -> update.getItem().getStockName())
                .collect(Collectors.toList());

        Map<String, StockStatusRedis> currentStatuses = stockStatusRedisRepository.getBatchStatus(storeId, stockNames);
        Map<String, StockStatusRedis> batchUpdates = new HashMap<>();
        String currentTime = DateTimeUtils.nowString();

        for (StockUpdateInfo update : updates) {
            StockStatusRedis currentStatus = currentStatuses.get(update.getItem().getStockName());

            if (currentStatus == null) {
                StockStatusRedis newStatus = StockStatusRedis.builder()
                        .initialStock(update.getItem().getStockTotalValue())
                        .soldStock(update.getDecreaseAmount())
                        .currentStock(update.getItem().getStockTotalValue() - update.getDecreaseAmount())
                        .soldPercentage(calculatePercentage(update.getDecreaseAmount(), update.getItem().getStockTotalValue()))
                        .lastUpdated(currentTime)
                        .isDessert(checkIsDessert(update.getItem()))
                        .isLowStock(false)
                        .build();
                checkLowStock(newStatus);
                batchUpdates.put(update.getItem().getStockName(), newStatus);
            } else {
                int newSoldStock = currentStatus.getSoldStock() + update.getDecreaseAmount();
                StockStatusRedis updatedStatus = StockStatusRedis.builder()
                        .initialStock(currentStatus.getInitialStock())
                        .soldStock(newSoldStock)
                        .currentStock(currentStatus.getInitialStock() - newSoldStock)
                        .soldPercentage(calculatePercentage(newSoldStock, currentStatus.getInitialStock()))
                        .lastUpdated(currentTime)
                        .isDessert(currentStatus.getIsDessert())
                        .isLowStock(currentStatus.getIsLowStock())
                        .build();
                checkLowStock(updatedStatus);
                batchUpdates.put(update.getItem().getStockName(), updatedStatus);
            }
        }
        if (!batchUpdates.isEmpty()) {
            stockStatusRedisRepository.saveBatchStatus(storeId, batchUpdates);
        }
    }

    private Integer calculatePercentage(Integer sold, Integer total) {
        return total == 0 ? 0 : (sold * 100) / total;
    }

    private void checkLowStock(StockStatusRedis status) {
        if (Boolean.TRUE.equals(status.getIsDessert())) {
            // 디저트 개수 체크
            status.setIsLowStock(status.getCurrentStock() < 3);
        } else {
            // 판매율 체크
            status.setIsLowStock(status.getSoldPercentage() >= 70);
        }
    }

    public StockStatusResponse getStockStatus(Integer storeId) {
        Stock stock = stockRepository.findByStoreId(storeId)
                .orElseThrow(() -> new BusinessException(CommonErrorCode.NOT_FOUND, "해당 매장의 재고 정보를 찾을 수 없습니다"));

        List<String> stockNames = stock.getInventory().stream()
                .map(InventoryItem::getStockName)
                .collect(Collectors.toList());

        Map<String, StockStatusRedis> statusMap = stockStatusRedisRepository.getBatchStatus(storeId, stockNames);
        List<LowStockInfoResponse> lowStockList = new ArrayList<>();

        for (InventoryItem item : stock.getInventory()) {
            StockStatusRedis status = statusMap.get(item.getStockName());

            if (status != null && Boolean.TRUE.equals(status.getIsLowStock())) {
                lowStockList.add(LowStockInfoResponse.builder()
                        .stockName(item.getStockName())
                        .soldPercentage(status.getSoldPercentage())
                        .remainingStock(status.getCurrentStock())
                        .build());
            }
        }

        return StockStatusResponse.builder()
                .storeId(storeId)
                .hasLowStock(!lowStockList.isEmpty())
                .lowStockList(lowStockList)
                .build();
    }
}
