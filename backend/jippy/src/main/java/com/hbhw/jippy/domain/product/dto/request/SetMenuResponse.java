package com.hbhw.jippy.domain.product.dto.request;

import com.hbhw.jippy.domain.product.dto.response.ProductDetailResponse;
import lombok.Builder;

import java.util.List;

@Builder
public class SetMenuResponse {
    private String name;
    private Integer price;
    private String image;
    private List<ProductDetailResponse> productDetailResponseList;
}
