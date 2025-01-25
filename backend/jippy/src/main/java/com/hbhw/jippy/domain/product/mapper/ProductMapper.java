package com.hbhw.jippy.domain.product.mapper;

import com.hbhw.jippy.domain.product.dto.response.ProductListResponse;
import com.hbhw.jippy.domain.product.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    /**
     * 상품 엔티티를 응답객체로 매핑하는 메서드
     */
    public static ProductListResponse convertProductListResponse(Product product) {
        return ProductListResponse.builder()
                .id(product.getId())
                .productCategoryId(product.getProductCategoryId())
                .name(product.getName())
                .price(product.getPrice())
                .productStatus(product.getProductStatus())
                .image(product.getImage())
                .build();
    }

}
