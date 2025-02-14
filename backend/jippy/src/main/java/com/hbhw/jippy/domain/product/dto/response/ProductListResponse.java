package com.hbhw.jippy.domain.product.dto.response;

import com.hbhw.jippy.domain.product.enums.ProductSize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class ProductListResponse {
    private Long id;
    private Integer productCategoryId;
    private String name;
    private Integer price;
    private boolean status;
    private String image;
}
