package com.hbhw.jippy.domain.product.controller;

import com.hbhw.jippy.domain.product.dto.request.CreateProductRequest;
import jakarta.persistence.AttributeOverrides;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/store")
public class ProductController {

    @PostMapping("{storeId}/create")
    public ResponseEntity<?> createProduct(@PathVariable("storeId") Integer storeId, @RequestBody CreateProductRequest createProductRequest){

    }


}
