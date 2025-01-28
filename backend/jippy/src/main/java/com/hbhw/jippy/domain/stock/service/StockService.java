package com.hbhw.jippy.domain.stock.service;

import com.hbhw.jippy.domain.stock.dto.request.InventoryItemRequest;
import com.hbhw.jippy.domain.stock.dto.request.StockDetailRequest;
import com.hbhw.jippy.domain.stock.dto.request.StockRequest;
import com.hbhw.jippy.domain.stock.dto.response.InventoryItemResponse;
import com.hbhw.jippy.domain.stock.dto.response.StockDetailResponse;
import com.hbhw.jippy.domain.stock.dto.response.StockResponse;
import com.hbhw.jippy.domain.stock.entity.InventoryItem;
import com.hbhw.jippy.domain.stock.entity.StockDetail;
import com.hbhw.jippy.domain.stock.repository.StockRepository;
import com.hbhw.jippy.domain.stock.entity.Stock;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockService {
    private static final Map<String, Integer> UNIT_CONVERSION = Map.of(
            "kg", 1000,
            "g", 1,
            "l", 1000,
            "ml", 1
    );

    private final StockRepository stockRepository;
    private final MongoTemplate mongoTemplate;

    @Transactional
    public StockResponse addInventory(Integer storeId, StockRequest request) {
        if (request.getInventory() == null || request.getInventory().isEmpty()) {
            throw new IllegalArgumentException("재고 정보가 필요합니다");
        }

        Stock stock = stockRepository.findByStoreId(storeId)
            .orElseGet(() -> Stock.builder()
                .storeId(storeId)
                .inventory(new ArrayList<>())
                .build());

        request.getInventory().forEach(newItem -> {
            Optional<InventoryItem> existingItem = stock.getInventory().stream()
                .filter(item -> item.getStockName().equals(newItem.getStockName()))
                .findFirst();

            if (existingItem.isPresent()) {
                updateInventoryItem(existingItem.get(), newItem);
            } else {
                addNewInventoryItem(stock, newItem);
            }
        });

        recalculateTotalValues(stock);

        Query query = new Query(Criteria.where("store_id").is(storeId));
        Update update = new Update().set("inventory", stock.getInventory());

        mongoTemplate.upsert(query, update, Stock.class);

        return mapEntityToResponse(stock);
    }

    private void updateInventoryItem(InventoryItem existingItem, InventoryItemRequest newItem) {
        existingItem.setUpdatedAt(newItem.getUpdatedAt());
        mergeStockDetails(existingItem, newItem);
    }

    private void mergeStockDetails(InventoryItem existingItem, InventoryItemRequest newItem) {
        newItem.getStock().forEach(newStock -> {
            Optional<StockDetail> existingStock = existingItem.getStock().stream()
                .filter(stock ->
                    stock.getStockUnitSize().equals(newStock.getStockUnitSize()) &&
                    stock.getStockUnit().equals(newStock.getStockUnit()))
                .findFirst();

            if (existingStock.isPresent()) {
                existingStock.get().setStockCount(
                    existingStock.get().getStockCount() + newStock.getStockCount()
                );
            } else {
                existingItem.getStock().add(mapToStockDetail(newStock));
            }
        });
    }

    private void addNewInventoryItem(Stock stock, InventoryItemRequest newItem) {
        stock.getInventory().add(mapToInventoryItem(newItem));
    }

    private void recalculateTotalValues(Stock stock) {
        stock.getInventory().forEach(item -> {
            int totalValue = item.getStock().stream()
                .mapToInt(detail -> {
                    String unit = detail.getStockUnit();
                    int unitSize = detail.getStockUnitSize();
                    int conversionFactor = UNIT_CONVERSION.getOrDefault(unit, 1);
                    boolean needsConversion = unit.equals("kg") || unit.equals("l");
                    return needsConversion ?
                            unitSize * conversionFactor * detail.getStockCount() :
                            unitSize * detail.getStockCount();
                })
                .sum();
            item.setStockTotalValue(totalValue);
        });
    }

    private InventoryItem mapToInventoryItem(InventoryItemRequest request) {
        return InventoryItem.builder()
            .stockName(request.getStockName())
            .stockTotalValue(request.getStockTotalValue())
            .updatedAt(request.getUpdatedAt())
            .stock(request.getStock().stream()
                .map(this::mapToStockDetail)
                .collect(Collectors.toList()))
            .build();
    }

    private StockDetail mapToStockDetail(StockDetailRequest request) {
        return StockDetail.builder()
            .stockCount(request.getStockCount())
            .stockUnitSize(request.getStockUnitSize())
            .stockUnit(request.getStockUnit())
            .build();
    }

    private StockResponse mapEntityToResponse(Stock entity) {
        return StockResponse.builder()
            .storeId(entity.getStoreId())
            .inventory(entity.getInventory().stream()
                .map(this::mapToInventoryItemResponse)
                .collect(Collectors.toList()))
            .build();
    }

    private InventoryItemResponse mapToInventoryItemResponse(InventoryItem item) {
        return InventoryItemResponse.builder()
            .stockName(item.getStockName())
            .stockTotalValue(item.getStockTotalValue())
            .updatedAt(item.getUpdatedAt())
            .stock(item.getStock().stream()
                .map(this::mapToStockDetailResponse)
                .collect(Collectors.toList()))
            .build();
    }

    private StockDetailResponse mapToStockDetailResponse(StockDetail detail) {
        return StockDetailResponse.builder()
            .stockCount(detail.getStockCount())
            .stockUnitSize(detail.getStockUnitSize())
            .stockUnit(detail.getStockUnit())
            .build();
    }

    public StockResponse getInventory(Integer storeId) {
        return stockRepository.findByStoreId(storeId)
            .map(this::mapEntityToResponse)
            .orElse(StockResponse.builder()
                .storeId(storeId)
                .inventory(new ArrayList<>())
                .build());
    }
}