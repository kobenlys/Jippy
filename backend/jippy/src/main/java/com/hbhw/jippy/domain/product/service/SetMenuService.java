package com.hbhw.jippy.domain.product.service;

import com.hbhw.jippy.domain.product.dto.request.CreateSetMenuRequest;
import com.hbhw.jippy.domain.product.dto.response.SetMenuResponse;
import com.hbhw.jippy.domain.product.dto.request.UpdateSetMenuRequest;
import com.hbhw.jippy.domain.product.dto.response.ProductDetailResponse;
import com.hbhw.jippy.domain.product.entity.SetMenu;
import com.hbhw.jippy.domain.product.entity.SetMenuConfig;
import com.hbhw.jippy.domain.product.mapper.ProductMapper;
import com.hbhw.jippy.domain.product.repository.SetMenuRepository;
import com.hbhw.jippy.domain.store.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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
    private final StoreService storeService;

    @Transactional
    public void createSetMenu(CreateSetMenuRequest createSetMenuRequest) {

        SetMenu setMenuEntity = SetMenu.builder()
                .price(createSetMenuRequest.getPrice())
                .store(storeService.getStoreEntity(createSetMenuRequest.getStoreId()))
                .image(createSetMenuRequest.getImage())
                .name(createSetMenuRequest.getName())
                .setMenuConfigList(new ArrayList<>())
                .build();

        setMenuRepository.save(setMenuEntity);

        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (Long productId : createSetMenuRequest.getProductList()) {
                executor.submit(() -> {
                    SetMenuConfig setMenuConfigEntity = SetMenuConfig.builder()
                            .setMenu(setMenuEntity)
                            .product(productService.getProduct(createSetMenuRequest.getStoreId(), productId))
                            .build();
                    setMenuEntity.getSetMenuConfigList().add(setMenuConfigEntity);
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

        List<SetMenuConfig> newSetMenuConfigList = updateSetMenuRequest.getProductIdList().stream()
                .map(product -> setMenuConfigService.getOrCreateSetMenuConfig(setMenuEntity, updateSetMenuRequest.getStoreId(), product))
                .toList();

       for (SetMenuConfig setMenuConfig : setMenuEntity.getSetMenuConfigList()) {
           setMenuConfigService.deleteSetMenuConfig(setMenuConfig);
       }

       setMenuEntity.getSetMenuConfigList().clear();
       setMenuEntity.getSetMenuConfigList().addAll(newSetMenuConfigList);
    }

    public List<SetMenuResponse> selectDetailSetMenuList(Integer storeId) {
        List<SetMenu> setMenuEntityList = setMenuRepository.findByStoreId(storeId);
        List<SetMenuResponse> setMenuResponseList = new ArrayList<>();

        for(SetMenu setMenu : setMenuEntityList){

            List<ProductDetailResponse> productDetailResponseList = setMenu.getSetMenuConfigList().stream()
                    .map(e -> ProductMapper.convertProductDetailResponse(e.getProduct()))
                    .toList();

            SetMenuResponse setMenuResponse = SetMenuResponse.builder()
                    .productDetailResponseList(productDetailResponseList)
                    .setMenuId(setMenu.getId())
                    .image(setMenu.getImage())
                    .name(setMenu.getName())
                    .price(setMenu.getPrice())
                    .build();
            System.out.println(setMenuResponse);
            setMenuResponseList.add(setMenuResponse);
        }
        return setMenuResponseList;
    }

    @Transactional(readOnly = true)
    private SetMenu getSetMenu(Integer setMenuId, Integer storeId) {
        return setMenuRepository.findByIdAndStoreId(setMenuId, storeId)
                .orElseThrow(() -> new NoSuchElementException("세트 메뉴가 존재하지 않습니다"));
    }
}
