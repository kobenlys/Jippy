package com.hbhw.jippy.domain.product.service;

import com.hbhw.jippy.domain.product.dto.request.CreateSetMenuRequest;
import com.hbhw.jippy.domain.product.dto.request.SetMenuResponse;
import com.hbhw.jippy.domain.product.dto.request.UpdateSetMenuRequest;
import com.hbhw.jippy.domain.product.dto.response.ProductDetailResponse;
import com.hbhw.jippy.domain.product.entity.Product;
import com.hbhw.jippy.domain.product.entity.SetMenu;
import com.hbhw.jippy.domain.product.entity.SetMenuConfig;
import com.hbhw.jippy.domain.product.mapper.ProductMapper;
import com.hbhw.jippy.domain.product.repository.SetMenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RequiredArgsConstructor
@Service
public class SetMenuService {

    private final SetMenuRepository setMenuRepository;
    private final SetMenuConfigService setMenuConfigService;
    private final ProductService productService;

    @Transactional
    public void createSetMenu(CreateSetMenuRequest createSetMenuRequest) {

        SetMenu setMenuEntity = SetMenu.builder()
                .price(createSetMenuRequest.getPrice())
                .image(createSetMenuRequest.getImage())
                .name(createSetMenuRequest.getName())
                .build();

        setMenuRepository.save(setMenuEntity);

        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (Long productId : createSetMenuRequest.getProductList()) {
                executor.submit(() -> {
                    SetMenuConfig setMenuConfigEntity = SetMenuConfig.builder()
                            .setMenu(setMenuEntity)
                            .product(productService.getProduct(createSetMenuRequest.getStoreId(), productId))
                            .build();
                    setMenuConfigService.saveSetMenuConfig(setMenuConfigEntity);
                });
                // CompletableFuture 사용하기
            }
        }
    }

    public void deleteSetMenu(Integer setMenuId, Integer storeId) {
        SetMenu setMenuEntity = getSetMenu(setMenuId, storeId);
        setMenuRepository.delete(setMenuEntity);
    }

    // 내일 내부 productId 도 버추얼 스레드 사용해서 한번에 modify 되게 하기 + 엔티티 수정도 세트메뉴 컬럼수정
    @Transactional
    public void modifySetMenu(UpdateSetMenuRequest updateSetMenuRequest) {
        SetMenu setMenuEntity = getSetMenu(updateSetMenuRequest.getSetMenuId(), updateSetMenuRequest.getStoreId());
        setMenuEntity.setName(updateSetMenuRequest.getName());
        setMenuEntity.setImage(updateSetMenuRequest.getImage());
        setMenuEntity.setPrice(updateSetMenuRequest.getPrice());
    }

    public SetMenuResponse selectDetailSetMenu(Integer setMenuId, Integer storeId) {
        SetMenu setMenuEntity = getSetMenu(setMenuId, storeId);

        List<ProductDetailResponse> productDetailResponseList = setMenuEntity.getSetMenuConfigList().stream()
                .map(e -> ProductMapper.convertProductDetailResponse(e.getProduct()))
                .toList();

        return SetMenuResponse.builder()
                .productDetailResponseList(productDetailResponseList)
                .image(setMenuEntity.getImage())
                .name(setMenuEntity.getName())
                .price(setMenuEntity.getPrice())
                .build();
    }

    private SetMenu getSetMenu(Integer setMenuId, Integer storeId) {
        return setMenuRepository.findByIdAndStoreId(setMenuId, storeId)
                .orElseThrow(() -> new NoSuchElementException("세트 메뉴가 존재하지 않습니다"));
    }
}
