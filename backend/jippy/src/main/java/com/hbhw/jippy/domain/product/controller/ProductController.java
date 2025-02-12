package com.hbhw.jippy.domain.product.controller;

import com.hbhw.jippy.domain.product.dto.request.CreateProductRequest;
import com.hbhw.jippy.domain.product.dto.request.ProductUpdateRequest;
import com.hbhw.jippy.domain.product.dto.response.ProductDetailResponse;
import com.hbhw.jippy.domain.product.dto.response.ProductListResponse;
import com.hbhw.jippy.domain.product.service.ProductService;
import com.hbhw.jippy.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/product")
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "매장 별 상품 등록", description = "상품을 등록합니다")
    @PostMapping("{storeId}/create")
    public ApiResponse<?> createProduct(@PathVariable("storeId") Integer storeId, @RequestBody CreateProductRequest createProductRequest) {
        createProductRequest.setStoreId(storeId);
        productService.createProduct(createProductRequest);
        return ApiResponse.success(HttpStatus.OK);
    }

    @Operation(summary = "매장 별 상품 전체조회", description = "상품 목록을 전체조회합니다")
    @GetMapping("{storeId}/select")
    public ApiResponse<List<ProductListResponse>> selectAllProduct(@PathVariable("storeId") Integer storeId) {
        List<ProductListResponse> productList = productService.getListAllProduct(storeId);
        return ApiResponse.success(productList);
    }

    @Operation(summary = "매장 별 상품 상세조회", description = "상품 상세조회합니다")
    @GetMapping("{storeId}/select/{productId}")
    public ApiResponse<ProductDetailResponse> detailProduct(@PathVariable("storeId") Integer storeId, @PathVariable("productId") Long productId) {
        ProductDetailResponse detailProduct = productService.getDetailProduct(storeId, productId);
        return ApiResponse.success(detailProduct);
    }

    @Operation(summary = "매장 별 상품 정보수정", description = "상품 정보를 수정합니다")
    @PutMapping("{storeId}/update/{productId}")
    public ApiResponse<?> updateProduct(@RequestBody ProductUpdateRequest productUpdateRequest, @PathVariable("storeId") Integer storeId, @PathVariable("productId") Long productId) {
        productService.modifyProduct(storeId, productId, productUpdateRequest);
        return ApiResponse.success(HttpStatus.OK);
    }

    @Operation(summary = "매장 별 상품 삭제", description = "상품을 삭제합니다")
    @DeleteMapping("{storeId}/delete/{productId}")
    public ApiResponse<?> deleteProduct(@PathVariable("storeId") Integer storeId, @PathVariable("productId") Long productId) {
        productService.deleteProduct(storeId, productId);
        return ApiResponse.success(HttpStatus.OK);
    }

    @Operation(summary = "매장 별 기간내 상품 순위", description = "상품의 순위를 조회합니다")
    @GetMapping("/{storeId}/select/rank")
    public ApiResponse<?> rankListProduct(@RequestParam("startDate") String startDate, @RequestParam("startDate") String endDate) {
        // 주문목록 구현 후 개발 진행
        return ApiResponse.success(HttpStatus.OK);
    }
}
