package com.hbhw.jippy.domain.product.service;

import com.hbhw.jippy.domain.product.dto.request.CreateCategoryRequest;
import com.hbhw.jippy.domain.product.dto.response.CategoryListResponse;
import com.hbhw.jippy.domain.product.entity.ProductCategory;
import com.hbhw.jippy.domain.product.mapper.ProductMapper;
import com.hbhw.jippy.domain.product.repository.ProductCategoryRepository;
import com.hbhw.jippy.domain.store.entity.Store;
import com.hbhw.jippy.domain.user.entity.UserOwner;
import com.hbhw.jippy.domain.user.enums.StaffType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ProductCategoryService {

    private final ProductCategoryRepository productCategoryRepository;

    /***
     *  카테고리 추가
     */
    public void addCategory(String categoryName, Integer storeId) {
        // 쿼리로 체크할 예정
        Store storeDump = new Store(storeId, new UserOwner("dwa", "dwa", "Dwa", "dwa", StaffType.STAFF), "dwa", "daw", "dwa", 2, "dwa");

        ProductCategory productCategoryEntity = ProductCategory.builder()
                .productCategoryName(categoryName)
                .store(storeDump)
                .build();

        productCategoryRepository.save(productCategoryEntity);
    }

    /***
     *  카테고리 목록 조회
     */
    public List<CategoryListResponse> findAllCategory(Integer storeId) {
        List<ProductCategory> productCategories = productCategoryRepository.findByStoreId(storeId);

        return productCategories.stream()
                .map(ProductMapper::convertCategoryListResponse)
                .toList();
    }

    /***
     *  카테고리 이름 변경
     */
    @Transactional
    public void updateCategoryName(Integer storeId, Integer categoryId, CreateCategoryRequest createCategoryRequest) {
        ProductCategory productCategoryEntity = getProductCategoryEntity(storeId, categoryId);
        productCategoryEntity.setProductCategoryName(createCategoryRequest.getCategoryName());
    }

    /***
     *  카테고리 삭제
     */
    public void deleteCategoryName(Integer storeId, Integer categoryId) {
        ProductCategory productCategoryEntity = getProductCategoryEntity(storeId, categoryId);
        productCategoryRepository.delete(productCategoryEntity);
    }

    /***
     *  특정한 카테고리 조회
     */
    public ProductCategory getProductCategoryEntity(Integer storeId, Integer categoryId) {
        return productCategoryRepository.findByStoreIdAndId(storeId, categoryId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 카테고리 입니다"));
    }

}
