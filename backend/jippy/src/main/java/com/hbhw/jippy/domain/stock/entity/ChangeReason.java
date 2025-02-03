package com.hbhw.jippy.domain.stock.entity;

import lombok.Getter;

@Getter
public enum ChangeReason {
    PURCHASE("구매"),
    SALE("판매"),
    DISPOSAL("폐기");

    private final String description;

    ChangeReason(String description) {
        this.description = description;
    }
}
