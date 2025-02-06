package com.hbhw.jippy.domain.product.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateSetMenuRequest {
    private Integer setMenuId;
    private Integer storeId;
    private String name;
    private Integer price;
    private String image;
}
