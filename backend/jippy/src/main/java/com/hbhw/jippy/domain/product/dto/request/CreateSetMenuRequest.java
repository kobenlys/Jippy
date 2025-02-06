package com.hbhw.jippy.domain.product.dto.request;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
public class CreateSetMenuRequest {
    private Integer storeId;
    private String name;
    private Integer price;
    private String image;
    private List<Long> productList;
}
