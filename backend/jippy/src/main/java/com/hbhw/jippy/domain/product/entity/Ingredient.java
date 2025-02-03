package com.hbhw.jippy.domain.product.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ingredient {
    private String ingredient;
    private String amount;
}
