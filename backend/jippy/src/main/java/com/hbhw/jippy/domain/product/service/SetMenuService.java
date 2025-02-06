package com.hbhw.jippy.domain.product.service;

import com.hbhw.jippy.domain.product.dto.request.CreateSetMenuRequest;
import com.hbhw.jippy.domain.product.entity.ProductCategory;
import com.hbhw.jippy.domain.product.entity.SetMenu;
import com.hbhw.jippy.domain.product.entity.SetMenuConfig;
import com.hbhw.jippy.domain.product.repository.ProductRepository;
import com.hbhw.jippy.domain.product.repository.SetMenuConfigRepository;
import com.hbhw.jippy.domain.product.repository.SetMenuRepository;
import com.hbhw.jippy.domain.store.repository.StoreRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RequiredArgsConstructor
@Service
public class SetMenuService {

    private final SetMenuRepository setMenuRepository;
    private final SetMenuConfigRepository setMenuConfigRepository;
    private final ProductService productService;

    @Transactional
    public void createSetMenu(CreateSetMenuRequest createSetMenuRequest) {

        SetMenu setMenuEntity = SetMenu.builder()
                .price(createSetMenuRequest.getPrice())
                .image(createSetMenuRequest.getImage())
                .name(createSetMenuRequest.getName())
                .build();

        setMenuRepository.save(setMenuEntity);

        try(ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()){
            for(Long productId : createSetMenuRequest.getProductList()){
                executor.submit(() ->{
                    SetMenuConfig setMenuConfigEntity = SetMenuConfig.builder()
                            .setMenu(setMenuEntity)
                            .product(productService.getProduct(createSetMenuRequest.getStoreId(), productId))
                            .build();
                    setMenuConfigRepository.save(setMenuConfigEntity); // 이거 트랜잭션 따로 관리하기.,
                });
                // CompletableFuture 사용하기
            }
        }

    }

}
