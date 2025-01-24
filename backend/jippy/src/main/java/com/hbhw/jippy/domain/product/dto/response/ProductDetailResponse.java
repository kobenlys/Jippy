package com.hbhw.jippy.domain.product.dto.response;

import com.hbhw.jippy.domain.product.domain.ProductStatus;
import com.hbhw.jippy.domain.product.domain.ProductType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class ProductDetailResponse {
    private Long id;
    private Integer productCategoryId;
    private Integer storeId;
    private String name;
    private Integer price;
    private ProductStatus productStatus;
    private String image;
    private ProductType productType;
    private String size;
}
