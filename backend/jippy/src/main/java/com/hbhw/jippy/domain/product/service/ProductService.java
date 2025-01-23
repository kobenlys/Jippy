package com.hbhw.jippy.domain.product.service;

import com.hbhw.jippy.domain.product.dto.request.CreateProductRequest;
import com.hbhw.jippy.domain.product.dto.response.ProductListResponse;
import com.hbhw.jippy.domain.product.entity.Product;
import com.hbhw.jippy.domain.product.mapper.ProductMapper;
import com.hbhw.jippy.domain.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    public void createProduct(CreateProductRequest createProductRequest) {
        Product product = Product.builder()
                .productCategoryId(createProductRequest.getProductCategoryId())
                .storeId(createProductRequest.getStoreId())
                .price(createProductRequest.getPrice())
                .productStatus(createProductRequest.getProductStatus())
                .image(createProductRequest.getImage())
                .productType(createProductRequest.getProductType())
                .size(createProductRequest.getSize())
                .build();

        productRepository.save(product);
    }

    public List<ProductListResponse> getListAllProduct(Integer storeId) {

        List<Product> productList = productRepository.findByStoreId(storeId);
        if (productList == null || productList.isEmpty()) {
            throw new NoSuchElementException();
        }

        return productList.stream()
                .map(ProductMapper::convertProductListResponse)
                .toList();
    }

}
