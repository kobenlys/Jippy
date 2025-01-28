package com.hbhw.jippy.domain.product.dto.request;

import com.hbhw.jippy.domain.product.enums.ProductStatus;
import com.hbhw.jippy.domain.product.enums.ProductType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CreateProductRequest {
    private Integer productCategoryId;
    private Integer storeId;
    private String name;
    private Integer price;
    private ProductStatus productStatus;
    private String image;
    private ProductType productType;
    private String size;
}
