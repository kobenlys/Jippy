package com.hbhw.jippy.domain.product.domain;

import lombok.Getter;

import java.util.Objects;

@Getter
public enum ProductStatus {
    ACTIVATE(1),
    DEACTIVATE(2);

    private Integer code;

    ProductStatus(Integer code) {
    this.code = code;
    }

    public static ProductStatus ofLegacyCode(Integer code){
        for(ProductStatus stat : ProductStatus.values()){
            if(Objects.equals(code, stat.getCode())){
                return stat;
            }
        }
        throw new IllegalArgumentException("Error!");
    }

}
