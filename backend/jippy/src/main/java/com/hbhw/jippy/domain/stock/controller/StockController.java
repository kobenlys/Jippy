package com.hbhw.jippy.domain.stock.controller;

import com.hbhw.jippy.domain.stock.dto.request.StockRequest;
import com.hbhw.jippy.domain.stock.dto.response.StockResponse;
import com.hbhw.jippy.domain.stock.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stock/{storeId}")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @PostMapping("/create")
    public ResponseEntity<StockResponse> addInventory(@PathVariable Integer storeId, @RequestBody StockRequest request) {
        return ResponseEntity.ok(stockService.addInventory(storeId, request));
    }

    @GetMapping("/select")
    public ResponseEntity<StockResponse> getInventory(@PathVariable Integer storeId) {
        return ResponseEntity.ok(stockService.getInventory(storeId));
    }

    @PutMapping("/update/{stockName}")
    public ResponseEntity<StockResponse> updateInventory(@PathVariable Integer storeId, @PathVariable String stockName, @RequestBody StockRequest request) {
        return ResponseEntity.ok(stockService.updateInventory(storeId, stockName, request));
    }

    @DeleteMapping("/delete/{stockName}")
    public ResponseEntity<StockResponse> deleteInventory(@PathVariable Integer storeId, @PathVariable String stockName, @RequestBody StockRequest request) {
        return ResponseEntity.ok(stockService.deleteInventoryItem(storeId, stockName, request));
    }
}
