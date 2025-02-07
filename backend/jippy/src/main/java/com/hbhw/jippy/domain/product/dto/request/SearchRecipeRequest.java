package com.hbhw.jippy.domain.product.dto.request;

import lombok.Getter;

@Getter
public class SearchRecipeRequest {
    private Long productId;
    private Integer storeId;
}
