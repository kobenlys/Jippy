package com.hbhw.jippy.domain.product.dto.request;

import com.hbhw.jippy.domain.product.enums.ProductSize;
import com.hbhw.jippy.domain.product.enums.ProductType;
import lombok.Getter;

@Getter
public class ProductUpdateRequest {
    private Integer productCategoryId;
    private String name;
    private Integer price;
    private boolean status;
    private ProductType productType;
    private ProductSize productSize;
}
