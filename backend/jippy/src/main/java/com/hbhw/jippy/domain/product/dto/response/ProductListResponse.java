package com.hbhw.jippy.domain.product.dto.response;

import com.hbhw.jippy.domain.product.domain.ProductStatus;
import lombok.Builder;

@Builder
public class ProductListResponse {
    private Long id;
    private Integer productCategoryId;
    private String name;
    private Integer price;
    private ProductStatus productStatus;
    private String image;
}
