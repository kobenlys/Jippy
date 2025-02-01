package com.hbhw.jippy.domain.stock.service;

import com.hbhw.jippy.domain.stock.dto.request.*;
        import com.hbhw.jippy.domain.stock.dto.response.InventoryItemResponse;
import com.hbhw.jippy.domain.stock.dto.response.StockDetailResponse;
import com.hbhw.jippy.domain.stock.dto.response.StockResponse;
import com.hbhw.jippy.domain.stock.entity.InventoryItem;
import com.hbhw.jippy.domain.stock.entity.StockDetail;
import com.hbhw.jippy.domain.stock.repository.StockRepository;
import com.hbhw.jippy.domain.stock.entity.Stock;
import com.hbhw.jippy.utils.DateTimeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockService {

    private static final Map<String, String> UNIT_STANDARDIZATION = Map.of(
            "kg", "g",
            "l", "ml"
    );

    private static final Map<String, Integer> UNIT_CONVERSION = Map.of(
            "kg", 1000,
            "g", 1,
            "l", 1000,
            "ml", 1
    );

    private final StockRepository stockRepository;
    private final MongoTemplate mongoTemplate;

    private StockDetail convertToStandardUnit(StockDetailCreateUpdateRequest request) {
        String standardUnit = UNIT_STANDARDIZATION.getOrDefault(request.getStockUnit(), request.getStockUnit());

        if (request.getStockUnit().equals(standardUnit)) {
            return StockDetail.builder()
                    .stockCount(request.getStockCount())
                    .stockUnitSize(request.getStockUnitSize())
                    .stockUnit(standardUnit)
                    .build();
        }

        int conversionFactor = UNIT_CONVERSION.getOrDefault(request.getStockUnit(), 1);

        return StockDetail.builder()
                .stockCount(request.getStockCount())
                .stockUnitSize(request.getStockUnitSize() * conversionFactor)
                .stockUnit(standardUnit)
                .build();
    }

    private StockDetailDeleteRequest convertDeleteRequestToStandardUnit(StockDetailDeleteRequest request) {
        String standardUnit = UNIT_STANDARDIZATION.getOrDefault(request.getStockUnit(), request.getStockUnit());

        if (request.getStockUnit().equals(standardUnit)) {
            return request;
        }

        int conversionFactor = UNIT_CONVERSION.getOrDefault(request.getStockUnit(), 1);

        StockDetailDeleteRequest standardizedRequest = new StockDetailDeleteRequest();
        standardizedRequest.setStockUnit(standardUnit);
        standardizedRequest.setStockUnitSize(request.getStockUnitSize() * conversionFactor);

        return standardizedRequest;
    }

    @Transactional
    public StockResponse addInventory(Integer storeId, StockCreateUpdateRequest request) {
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

    private void updateInventoryItem(InventoryItem existingItem, InventoryItemCreateUpdateRequest newItem) {
        existingItem.setUpdatedAt(DateTimeUtils.nowString());
        mergeStockDetails(existingItem, newItem);
    }

    private void mergeStockDetails(InventoryItem existingItem, InventoryItemCreateUpdateRequest newItem) {
        newItem.getStock().forEach(newStock -> {
            StockDetail convertedNewStock = convertToStandardUnit(newStock);

            Optional<StockDetail> existingStock = existingItem.getStock().stream()
                    .filter(stock -> {
                        if (stock.getStockUnit().equals(convertedNewStock.getStockUnit())) {
                            return stock.getStockUnitSize().equals(convertedNewStock.getStockUnitSize());
                        } else {
                            String standardUnit = UNIT_STANDARDIZATION.getOrDefault(stock.getStockUnit(), stock.getStockUnit());
                            if (!standardUnit.equals(stock.getStockUnit())) {
                                int standardSize = stock.getStockUnitSize() * UNIT_CONVERSION.get(stock.getStockUnit());
                                return standardSize == convertedNewStock.getStockUnitSize() &&
                                        convertedNewStock.getStockUnit().equals(standardUnit);
                            }
                        }
                        return false;
                    })
                    .findFirst();

            if (existingStock.isPresent()) {
                existingStock.get().setStockCount(
                        existingStock.get().getStockCount() + convertedNewStock.getStockCount()
                );
            } else {
                existingItem.getStock().add(convertedNewStock);
            }
        });
    }

    private void addNewInventoryItem(Stock stock, InventoryItemCreateUpdateRequest newItem) {
        stock.getInventory().add(mapToInventoryItem(newItem));
    }

    private void recalculateTotalValues(Stock stock) {
        stock.getInventory().forEach(item -> {
            int totalValue = item.getStock().stream()
                    .mapToInt(detail -> detail.getStockUnitSize() * detail.getStockCount())
                    .sum();
            item.setStockTotalValue(totalValue);
        });
    }

    private InventoryItem mapToInventoryItem(InventoryItemCreateUpdateRequest request) {
        List<StockDetail> convertedStocks = request.getStock().stream()
                .map(this::convertToStandardUnit)
                .collect(Collectors.toList());

        Map<String, Map<Integer, StockDetail>> groupedStocks = new HashMap<>();

        convertedStocks.forEach(stock -> {
            groupedStocks
                    .computeIfAbsent(stock.getStockUnit(), k -> new HashMap<>())
                    .merge(stock.getStockUnitSize(),
                            stock,
                            (existing, newStock) -> {
                                existing.setStockCount(existing.getStockCount() + newStock.getStockCount());
                                return existing;
                            });
        });

        List<StockDetail> mergedStocks = groupedStocks.values().stream()
                .flatMap(sizeMap -> sizeMap.values().stream())
                .collect(Collectors.toList());

        return InventoryItem.builder()
                .stockName(request.getStockName())
                .stockTotalValue(0)
                .updatedAt(DateTimeUtils.nowString())
                .stock(mergedStocks)
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
        String displayUnit = detail.getStockUnit();
        int displaySize = detail.getStockUnitSize();

        if (detail.getStockUnit().equals("g") && detail.getStockUnitSize() >= 1000) {
            displayUnit = "kg";
            displaySize = detail.getStockUnitSize() / 1000;
        } else if (detail.getStockUnit().equals("ml") && detail.getStockUnitSize() >= 1000) {
            displayUnit = "l";
            displaySize = detail.getStockUnitSize() / 1000;
        }

        return StockDetailResponse.builder()
                .stockCount(detail.getStockCount())
                .stockUnitSize(displaySize)
                .stockUnit(displayUnit)
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

    @Transactional
    public StockResponse updateInventory(Integer storeId, String stockName, StockCreateUpdateRequest request) {
        Stock stock = stockRepository.findByStoreId(storeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 매장의 재고 정보를 찾을 수 없습니다"));

        InventoryItem sourceItem = stock.getInventory().stream()
                .filter(item -> item.getStockName().equals(stockName))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("해당 상품의 재고 정보를 찾을 수 없습니다"));

        if (request.getInventory() == null || request.getInventory().isEmpty()) {
            throw new IllegalArgumentException("수정할 재고 정보가 필요합니다");
        }

        InventoryItemCreateUpdateRequest updateRequest = request.getInventory().get(0);

        if (updateRequest.getStockName() != null && !updateRequest.getStockName().equals(stockName)) {
            InventoryItem targetItem = stock.getInventory().stream()
                    .filter(item -> item.getStockName().equals(updateRequest.getStockName()))
                    .findFirst()
                    .orElseGet(() -> {
                        InventoryItem newItem = InventoryItem.builder()
                                .stockName(updateRequest.getStockName())
                                .stockTotalValue(0)
                                .stock(new ArrayList<>())
                                .updatedAt(DateTimeUtils.nowString())
                                .build();
                        stock.getInventory().add(newItem);
                        return newItem;
                    });

            updateRequest.getStock().forEach(moveDetail -> {
                StockDetail convertedMoveDetail = convertToStandardUnit(moveDetail);

                Optional<StockDetail> sourceDetail = sourceItem.getStock().stream()
                        .filter(detail -> {
                            if (detail.getStockUnit().equals(convertedMoveDetail.getStockUnit())) {
                                return detail.getStockUnitSize().equals(convertedMoveDetail.getStockUnitSize());
                            } else {
                                String standardUnit = UNIT_STANDARDIZATION.getOrDefault(detail.getStockUnit(), detail.getStockUnit());
                                if (!standardUnit.equals(detail.getStockUnit())) {
                                    int standardSize = detail.getStockUnitSize() * UNIT_CONVERSION.get(detail.getStockUnit());
                                    return standardSize == convertedMoveDetail.getStockUnitSize() &&
                                            convertedMoveDetail.getStockUnit().equals(standardUnit);
                                }
                            }
                            return false;
                        })
                        .findFirst();

                if (!sourceDetail.isPresent()) {
                    throw new IllegalArgumentException(
                            String.format("해당 용량과 단위의 재고가 존재하지 않습니다 : %d%s",
                                    convertedMoveDetail.getStockUnitSize(),
                                    convertedMoveDetail.getStockUnit())
                    );
                }

                sourceItem.getStock().remove(sourceDetail.get());

                Optional<StockDetail> targetDetail = targetItem.getStock().stream()
                        .filter(detail -> {
                            if (detail.getStockUnit().equals(convertedMoveDetail.getStockUnit())) {
                                return detail.getStockUnitSize().equals(convertedMoveDetail.getStockUnitSize());
                            } else {
                                String standardUnit = UNIT_STANDARDIZATION.getOrDefault(detail.getStockUnit(), detail.getStockUnit());
                                if (!standardUnit.equals(detail.getStockUnit())) {
                                    int standardSize = detail.getStockUnitSize() * UNIT_CONVERSION.get(detail.getStockUnit());
                                    return standardSize == convertedMoveDetail.getStockUnitSize() &&
                                            convertedMoveDetail.getStockUnit().equals(standardUnit);
                                }
                            }
                            return false;
                        })
                        .findFirst();

                if (targetDetail.isPresent()) {
                    targetDetail.get().setStockCount(
                            targetDetail.get().getStockCount() + convertedMoveDetail.getStockCount()
                    );
                } else {
                    targetItem.getStock().add(convertedMoveDetail);
                }
            });

            sourceItem.setUpdatedAt(DateTimeUtils.nowString());
            targetItem.setUpdatedAt(DateTimeUtils.nowString());
        } else {
            updateRequest.getStock().forEach(newStock -> {
                StockDetail convertedNewStock = convertToStandardUnit(newStock);

                Optional<StockDetail> existingStock = sourceItem.getStock().stream()
                        .filter(detail -> {
                            if (detail.getStockUnit().equals(convertedNewStock.getStockUnit())) {
                                return detail.getStockUnitSize().equals(convertedNewStock.getStockUnitSize());
                            } else {
                                String standardUnit = UNIT_STANDARDIZATION.getOrDefault(detail.getStockUnit(), detail.getStockUnit());
                                if (!standardUnit.equals(detail.getStockUnit())) {
                                    int standardSize = detail.getStockUnitSize() * UNIT_CONVERSION.get(detail.getStockUnit());
                                    return standardSize == convertedNewStock.getStockUnitSize() &&
                                            convertedNewStock.getStockUnit().equals(standardUnit);
                                }
                            }
                            return false;
                        })
                        .findFirst();

                if (existingStock.isPresent()) {
                    existingStock.get().setStockCount(convertedNewStock.getStockCount());
                } else {
                    throw new IllegalArgumentException(
                            String.format("해당 용량과 단위의 재고가 존재하지 않습니다 : %d%s",
                                    convertedNewStock.getStockUnitSize(),
                                    convertedNewStock.getStockUnit())
                    );
                }
            });

            sourceItem.setUpdatedAt(DateTimeUtils.nowString());
        }

        if (sourceItem.getStock().isEmpty()) {
            stock.getInventory().remove(sourceItem);
        }

        recalculateTotalValues(stock);

        Query query = new Query(Criteria.where("store_id").is(storeId));
        Update update = new Update().set("inventory", stock.getInventory());
        mongoTemplate.upsert(query, update, Stock.class);

        return mapEntityToResponse(stock);
    }

    @Transactional
    public StockResponse deleteInventoryItem(Integer storeId, String stockName, StockDeleteRequest request) {
        if (request.getInventory() == null || request.getInventory().isEmpty()) {
            throw new IllegalArgumentException("삭제할 재고 정보가 필요합니다");
        }

        Stock stock = stockRepository.findByStoreId(storeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 매장의 재고 정보를 찾을 수 없습니다"));

        InventoryItem targetItem = stock.getInventory().stream()
                .filter(item -> item.getStockName().equals(stockName))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("해당 상품의 재고 정보를 찾을 수 없습니다"));

        request.getInventory().forEach(deleteRequest -> {
            deleteRequest.getStock().forEach(stockDetailDelete -> {
                StockDetailDeleteRequest standardizedDeleteRequest = convertDeleteRequestToStandardUnit(stockDetailDelete);

                boolean removed = targetItem.getStock().removeIf(stockDetail -> {
                    if (stockDetail.getStockUnit().equals(standardizedDeleteRequest.getStockUnit())) {
                        return stockDetail.getStockUnitSize().equals(standardizedDeleteRequest.getStockUnitSize());
                    } else {
                        String standardUnit = UNIT_STANDARDIZATION.getOrDefault(stockDetail.getStockUnit(), stockDetail.getStockUnit());
                        if (!standardUnit.equals(stockDetail.getStockUnit())) {
                            int standardSize = stockDetail.getStockUnitSize() * UNIT_CONVERSION.get(stockDetail.getStockUnit());
                            return standardSize == standardizedDeleteRequest.getStockUnitSize() &&
                                    standardizedDeleteRequest.getStockUnit().equals(standardUnit);
                        }
                    }
                    return false;
                });

                if (!removed) {
                    throw new IllegalArgumentException(
                            String.format("해당 용량의 재고를 찾을 수 없습니다: %d%s",
                                    standardizedDeleteRequest.getStockUnitSize(),
                                    standardizedDeleteRequest.getStockUnit())
                    );
                }
            });
            targetItem.setUpdatedAt(DateTimeUtils.nowString());
        });

        if (targetItem.getStock().isEmpty()) {
            stock.getInventory().remove(targetItem);
        }

        recalculateTotalValues(stock);

        Query query = new Query(Criteria.where("store_id").is(storeId));
        Update update = new Update().set("inventory", stock.getInventory());
        mongoTemplate.upsert(query, update, Stock.class);

        return mapEntityToResponse(stock);
    }
}