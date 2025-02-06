package com.hbhw.jippy.domain.product.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.hbhw.jippy.domain.product.enums.ProductSize;
import com.hbhw.jippy.domain.product.enums.ProductType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
public class ProductDetailResponse {
    private Long id;
    private Integer productCategoryId;
    private Integer storeId;
    private String name;
    private Integer price;
    private boolean status;
    private String image;
    private ProductType productType;
    private ProductSize productSize;
}
