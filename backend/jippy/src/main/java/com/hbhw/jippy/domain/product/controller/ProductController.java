package com.hbhw.jippy.domain.product.controller;

import com.hbhw.jippy.domain.product.dto.request.CreateProductRequest;
import com.hbhw.jippy.domain.product.dto.response.ProductListResponse;
import com.hbhw.jippy.domain.product.service.ProductService;
import jakarta.persistence.AttributeOverrides;
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

    }

    @GetMapping
    public ResponseEntity<?> detailProduct(){

    }

}
