package com.hbhw.jippy.domain.product.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ProductSoldCountResponse {
    private Long productId;
    private String productName;
    private Integer soldCount;
}
