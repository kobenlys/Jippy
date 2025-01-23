package com.hbhw.jippy.domain.product.domain;

public enum ProductStatus {
    ACTIVATE(1),
    DEACTIVATE(2);

    private Integer code;

    ProductStatus(Integer code) {
    this.code = code;
    }



}
