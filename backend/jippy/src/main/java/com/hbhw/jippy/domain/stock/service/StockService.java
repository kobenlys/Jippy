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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

    @Transactional
    public StockResponse addInventory(StockRequest request) {
        Stock existingStock = stockRepository.findByStoreId(request.getStoreId())
            .orElse(null);

        if (existingStock != null) {
            updateExistingStock(existingStock, request);
            Stock updatedStock = stockRepository.save(existingStock);
            return mapEntityToResponse(updatedStock);
        }

        request.getInventory().forEach(item -> {
            int totalValue = calculateTotalValue(item.getStock());
            item.setStockTotalValue(totalValue);
        });

        Stock stock = stockRepository.save(mapRequestToEntity(request));
        return mapEntityToResponse(stock);
    }

    private void updateExistingStock(Stock existingStock, StockRequest request) {
        request.getInventory().forEach(newItem -> {
            existingStock.getInventory().stream()
                .filter(item -> item.getStockName().equals(newItem.getStockName()))
                .findFirst()
                .ifPresentOrElse(
                    item -> updateInventoryItem(item, newItem),
                    () -> addNewInventoryItem(existingStock, newItem)
                );
        });
    }

    private void updateInventoryItem(InventoryItem existingItem, InventoryItemRequest newItem) {
        existingItem.setStockTotalValue(calculateTotalValue(newItem.getStock()));
        existingItem.setUpdatedAt(newItem.getUpdatedAt());
        existingItem.getStock().addAll(mapToStockDetails(newItem.getStock()));
    }

    private void addNewInventoryItem(Stock stock, InventoryItemRequest newItem) {
        newItem.setStockTotalValue(calculateTotalValue(newItem.getStock()));
        stock.getInventory().add(mapToInventoryItem(newItem));
    }

    private List<StockDetail> mapToStockDetails(List<StockDetailRequest> requests) {
        return requests.stream()
            .map(this::mapToStockDetail)
            .collect(Collectors.toList());
    }

    public int calculateTotalValue(List<StockDetailRequest> stockDetails) {
        if (stockDetails == null || stockDetails.isEmpty()) {
            return 0;
        }
        String baseUnit = convertToBaseUnit(stockDetails.get(0).getStockUnit());

        return stockDetails.stream()
            .filter(detail -> convertToBaseUnit(detail.getStockUnit()).equals(baseUnit))
            .mapToInt(detail -> {
                int unitSize = detail.getStockUnitSize();
                int conversionFactor = UNIT_CONVERSION.getOrDefault(detail.getStockUnit(), 1);
                return unitSize * conversionFactor * detail.getStockCount();
            })
            .sum();
    }

    private String convertToBaseUnit(String unit) {
        if(!UNIT_CONVERSION.containsKey(unit)) {
            throw new IllegalArgumentException("지원하지 않는 단위입니다 틀린 단위 : " + unit);
        }

        return unit.toLowerCase().startsWith("k") ? unit.substring(1) :
            unit.equals("l") ? "ml" : unit;
    }

    private Stock mapRequestToEntity(StockRequest request) {
        return Stock.builder()
            .storeId(request.getStoreId())
            .inventory(request.getInventory().stream()
                .map(this::mapToInventoryItem)
                .collect(Collectors.toList()))
            .build();
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
}
