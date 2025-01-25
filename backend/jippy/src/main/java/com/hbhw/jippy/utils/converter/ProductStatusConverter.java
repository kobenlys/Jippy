package com.hbhw.jippy.utils.converter;

import com.hbhw.jippy.domain.product.enums.ProductStatus;
import jakarta.persistence.AttributeConverter;

import java.util.Objects;

public class ProductStatusConverter  implements AttributeConverter<ProductStatus, Integer> {

    @Override
    public Integer convertToDatabaseColumn(ProductStatus productStatus){
        if(!Objects.isNull(productStatus)){
            return productStatus.getCode();
        }
        throw new IllegalArgumentException();
    }

    @Override
    public ProductStatus convertToEntityAttribute(Integer code){
        if(!Objects.isNull(code)){
            return ProductStatus.ofLegacyCode(code);
        }
        throw new IllegalArgumentException();
    }
}
