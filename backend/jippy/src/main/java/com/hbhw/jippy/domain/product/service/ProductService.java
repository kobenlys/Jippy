package com.hbhw.jippy.domain.product.service;

import com.hbhw.jippy.domain.product.dto.request.CreateProductRequest;
import com.hbhw.jippy.domain.product.dto.request.ProductUpdateRequest;
import com.hbhw.jippy.domain.product.dto.response.ProductDetailResponse;
import com.hbhw.jippy.domain.product.dto.response.ProductListResponse;
import com.hbhw.jippy.domain.product.entity.Product;
import com.hbhw.jippy.domain.product.entity.ProductCategory;
import com.hbhw.jippy.domain.product.mapper.ProductMapper;
import com.hbhw.jippy.domain.product.repository.ProductRepository;
import com.hbhw.jippy.domain.store.entity.Store;
import com.hbhw.jippy.domain.store.service.StoreService;
import com.hbhw.jippy.global.code.CommonErrorCode;
import com.hbhw.jippy.global.error.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final StoreService storeService;
    private final ProductCategoryService productCategoryService;

    /**
     * 상품 등록
     */
    public void createProduct(CreateProductRequest createProductRequest) {
        Store storeEntity = storeService.getStoreEntity(createProductRequest.getStoreId());
        ProductCategory productCategoryEntity = productCategoryService
                .getProductCategoryEntity(createProductRequest.getStoreId(), createProductRequest.getProductCategoryId());

        Product product = Product.builder()
                .store(storeEntity)
                .productCategory(productCategoryEntity)
                .name(createProductRequest.getName())
                .price(createProductRequest.getPrice())
                .status(createProductRequest.isStatus())
                .image(createProductRequest.getImage())
                .productType(createProductRequest.getProductType())
                .productSize(createProductRequest.getProductSize())
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
                .productId(productEntity.getId())
                .storeId(storeId)
                .name(productEntity.getName())
                .status(productEntity.isStatus())
                .productCategoryId(productEntity.getProductCategory().getId())
                .image(productEntity.getImage())
                .price(productEntity.getPrice())
                .productType(productEntity.getProductType())
                .productSize(productEntity.getProductSize())
                .build();
    }

    /**
     * 매장별 상품 수정
     */
    @Transactional
    public void modifyProduct(Integer storeId, Long productId, ProductUpdateRequest productUpdateRequest) {
        Product productEntity = getProduct(storeId, productId);

        productEntity.getProductCategory().setId(productUpdateRequest.getProductCategoryId());
        productEntity.setStatus(productUpdateRequest.isStatus());
        productEntity.setImage(productUpdateRequest.getImage());
        productEntity.setName(productUpdateRequest.getName());
        productEntity.setPrice(productUpdateRequest.getPrice());
        productEntity.setProductType(productUpdateRequest.getProductType());
        productEntity.setProductSize(productUpdateRequest.getProductSize());
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
    @Transactional(readOnly = true)
    public Product getProduct(Integer storeId, Long productId) {
        Optional<Product> product = productRepository.findByIdAndStoreId(productId, storeId);
        return product.orElseThrow(() -> new BusinessException(CommonErrorCode.NOT_FOUND, "상품이 존재하지 않습니다."));
    }
}
