package com.hbhw.jippy.domain.product.entity;

import com.hbhw.jippy.domain.product.domain.ProductStatus;
import com.hbhw.jippy.domain.product.domain.ProductType;
import com.hbhw.jippy.utils.converter.ProductStatusConverter;
import com.hbhw.jippy.utils.converter.ProductTypeConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_category_id")
    private Integer productCategoryId;

    @Column(name = "store_id")
    private Integer storeId;

    @Column
    private String name;

    @Column
    private Integer price;

    @Column(name = "status")
    @Convert(converter = ProductStatusConverter.class)
    private ProductStatus productStatus;

    @Column
    private String image;

    @Column(name = "type")
    @Convert(converter = ProductTypeConverter.class)
    private ProductType productType;

    @Column
    private String size;
}
