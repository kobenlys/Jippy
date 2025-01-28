package com.hbhw.jippy.domain.stock.controller;

import com.hbhw.jippy.domain.stock.dto.request.StockRequest;
import com.hbhw.jippy.domain.stock.dto.response.StockResponse;
import com.hbhw.jippy.domain.stock.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @PostMapping("/{storeId}/create")
    public ResponseEntity<StockResponse> addInventory(@PathVariable Integer storeId, @RequestBody StockRequest request) {
        return ResponseEntity.ok(stockService.addInventory(storeId, request));
    }

    @GetMapping("/{storeId}/select")
    public ResponseEntity<StockResponse> getInventory(@PathVariable Integer storeId) {
        return ResponseEntity.ok(stockService.getInventory(storeId));
    }
}
