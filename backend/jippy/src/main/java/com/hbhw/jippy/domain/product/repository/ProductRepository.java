package com.hbhw.jippy.domain.product.repository;

import com.hbhw.jippy.domain.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByStoreId(Integer storeId);


}
