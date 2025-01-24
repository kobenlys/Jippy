package com.hbhw.jippy.domain.product.dto.request;

import com.hbhw.jippy.domain.product.domain.ProductStatus;
import com.hbhw.jippy.domain.product.domain.ProductType;
import lombok.Getter;
import lombok.ToString;

@Getter
public class ProductUpdateRequest {
    private Integer productCategoryId;
    private String name;
    private Integer price;
    private ProductStatus productStatus;
    private String image;
    private ProductType productType;
    private String size;
}
