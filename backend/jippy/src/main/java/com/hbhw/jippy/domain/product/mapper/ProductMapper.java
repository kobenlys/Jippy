package com.hbhw.jippy.domain.product.mapper;

import com.hbhw.jippy.domain.product.dto.response.CategoryListResponse;
import com.hbhw.jippy.domain.product.dto.response.ProductListResponse;
import com.hbhw.jippy.domain.product.entity.Product;
import com.hbhw.jippy.domain.product.entity.ProductCategory;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    /**
     * 상품 엔티티를 응답객체로 매핑하는 메서드
     */
    public static ProductListResponse convertProductListResponse(Product product) {
        return ProductListResponse.builder()
                .id(product.getId())
                .productCategoryId(product.getProductCategory().getId())
                .name(product.getName())
                .price(product.getPrice())
                .status(product.isStatus())
                .image(product.getImage())
                .build();
    }

    public static CategoryListResponse convertCategoryListResponse(ProductCategory productCategory){
        return CategoryListResponse.builder()
                .id(productCategory.getId())
                .categoryName(productCategory.getProductCategoryName())
                .build();
    }

}
