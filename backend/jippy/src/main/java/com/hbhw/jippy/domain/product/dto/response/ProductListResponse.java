package com.hbhw.jippy.domain.product.dto.response;

import com.hbhw.jippy.domain.product.enums.ProductStatus;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ProductListResponse {
    private Long id;
    private Integer productCategoryId;
    private String name;
    private Integer price;
    private ProductStatus productStatus;
    private String image;
}
