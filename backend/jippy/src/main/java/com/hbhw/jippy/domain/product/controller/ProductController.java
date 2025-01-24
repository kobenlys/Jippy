package com.hbhw.jippy.domain.product.controller;

import com.hbhw.jippy.domain.product.dto.request.CreateProductRequest;
import com.hbhw.jippy.domain.product.dto.request.ProductUpdateRequest;
import com.hbhw.jippy.domain.product.dto.response.ProductDetailResponse;
import com.hbhw.jippy.domain.product.dto.response.ProductListResponse;
import com.hbhw.jippy.domain.product.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/product")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("{storeId}/create")
    public ResponseEntity<?> createProduct(@PathVariable("storeId") Integer storeId, @RequestBody CreateProductRequest createProductRequest){
        createProductRequest.setStoreId(storeId);
        productService.createProduct(createProductRequest);
        return ResponseEntity.status(HttpStatus.OK).body(true);
    }

    @GetMapping("{storeId}/select")
    public ResponseEntity<?> selectAllProduct(@PathVariable("storeId") Integer storeId){
        List<ProductListResponse> productList = productService.getListAllProduct(storeId);
        return ResponseEntity.status(HttpStatus.OK).body(productList);
    }

    @GetMapping("{storeId}/select/{productId}")
    public ResponseEntity<?> detailProduct(@PathVariable("storeId") Integer storeId, @PathVariable("productId") Long productId){
        ProductDetailResponse detailProduct  = productService.getDetailProduct(storeId, productId);
        return ResponseEntity.status(HttpStatus.OK).body(detailProduct);
    }

    @PutMapping("{storeId}/update/{productId}")
    public ResponseEntity<?> updateProduct(@RequestBody ProductUpdateRequest productUpdateRequest, @PathVariable("storeId") Integer storeId, @PathVariable("productId") Long productId){
        productService.modifyProduct(storeId, productId, productUpdateRequest);
        return ResponseEntity.status(HttpStatus.OK).body(true);
    }

    @DeleteMapping("{storeId}/delete/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable("storeId") Integer storeId, @PathVariable("productId") Long productId){
        productService.deleteProduct(storeId, productId);
        return ResponseEntity.status(HttpStatus.OK).body(true);
    }

    @GetMapping("/{storeId}/select/rank")
    public ResponseEntity<?> rankListProduct(@RequestParam("startDate") String startDate, @RequestParam("startDate") String endDate){
        // 주문목록 구현 후 개발 진행
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}
