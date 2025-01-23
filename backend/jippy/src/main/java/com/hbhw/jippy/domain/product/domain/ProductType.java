package com.hbhw.jippy.domain.product.domain;

public enum ProductType {
    ICE(1),
    HOT(2),
    EXTRA(3);

    private Integer code;

    ProductType(Integer code) {
        this.code = code;
    }
}
