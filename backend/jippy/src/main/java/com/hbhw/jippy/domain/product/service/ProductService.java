package com.hbhw.jippy.domain.product.service;

import com.hbhw.jippy.domain.product.dto.request.CreateProductRequest;
import com.hbhw.jippy.domain.product.dto.request.ProductUpdateRequest;
import com.hbhw.jippy.domain.product.dto.response.ProductDetailResponse;
import com.hbhw.jippy.domain.product.dto.response.ProductListResponse;
import com.hbhw.jippy.domain.product.entity.Product;
import com.hbhw.jippy.domain.product.mapper.ProductMapper;
import com.hbhw.jippy.domain.product.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * 상품 등록
     */
    public void createProduct(CreateProductRequest createProductRequest) {
        Product product = Product.builder()
                .storeId(createProductRequest.getStoreId())
                .productCategoryId(createProductRequest.getProductCategoryId())
                .name(createProductRequest.getName())
                .storeId(createProductRequest.getStoreId())
                .price(createProductRequest.getPrice())
                .productStatus(createProductRequest.getProductStatus())
                .image(createProductRequest.getImage())
                .productType(createProductRequest.getProductType())
                .size(createProductRequest.getSize())
                .build();

        productRepository.save(product);
    }

    /**
     * 매장별 상품 목록 조회
     */
    public List<ProductListResponse> getListAllProduct(Integer storeId) {
        List<Product> productList = productRepository.findByStoreId(storeId);
        if (productList == null || productList.isEmpty()) {
            throw new NoSuchElementException();
        }

        return productList.stream()
                .map(ProductMapper::convertProductListResponse)
                .toList();
    }

    /**
     * 상품 상세 조회
     */
    public ProductDetailResponse getDetailProduct(Integer storeId, Long productId) {
        Product productEntity = getProduct(storeId, productId);

        return ProductDetailResponse.builder()
                .id(productEntity.getId())
                .name(productEntity.getName())
                .productStatus(productEntity.getProductStatus())
                .productCategoryId(productEntity.getProductCategoryId())
                .image(productEntity.getImage())
                .price(productEntity.getPrice())
                .productType(productEntity.getProductType())
                .size(productEntity.getSize())
                .build();
    }

    /**
     * 매장별 상품 수정
     */
    @Transactional
    public void modifyProduct(Integer storeId, Long productId, ProductUpdateRequest productUpdateRequest) {
        Product productEntity = getProduct(storeId, productId);

        productEntity.setProductCategoryId(productUpdateRequest.getProductCategoryId());
        productEntity.setProductStatus(productUpdateRequest.getProductStatus());
        productEntity.setImage(productUpdateRequest.getImage());
        productEntity.setName(productUpdateRequest.getName());
        productEntity.setPrice(productUpdateRequest.getPrice());
        productEntity.setProductType(productUpdateRequest.getProductType());
        productEntity.setSize(productUpdateRequest.getSize());
    }

    /**
     * 매장 상품 삭제
     */
    public void deleteProduct(Integer storeId, Long productId) {
        Product productEntity = getProduct(storeId, productId);
        productRepository.deleteByIdAndStoreId(storeId, productId);
    }

    /**
     * 매장번호, 상품번호로 상품 조회하기
     */
    public Product getProduct(Integer storeId, Long productId) {
        Optional<Product> product = productRepository.findByIdAndStoreId(productId, storeId);
        return product.orElseThrow(() -> new NoSuchElementException("존재하지 않는 상품입니다."));
    }


}
