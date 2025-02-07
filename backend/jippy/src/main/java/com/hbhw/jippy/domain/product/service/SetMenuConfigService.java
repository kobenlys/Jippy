package com.hbhw.jippy.domain.product.service;

import com.hbhw.jippy.domain.product.entity.Product;
import com.hbhw.jippy.domain.product.entity.SetMenu;
import com.hbhw.jippy.domain.product.entity.SetMenuConfig;
import com.hbhw.jippy.domain.product.repository.SetMenuConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RequiredArgsConstructor
@Service
public class SetMenuConfigService {

    private final SetMenuConfigRepository setMenuConfigRepository;
    private final ProductService productService;

    @Transactional
    public void saveSetMenuConfig(SetMenuConfig setMenuConfig) {
        setMenuConfigRepository.save(setMenuConfig);
    }

    @Transactional(readOnly = true)
    public Optional<SetMenuConfig> getSetMenuConfig(Integer setMenuId, Long productId){
        return setMenuConfigRepository.findBySetMenuIdAndProductId(setMenuId, productId);
    }

    public void deleteSetMenuConfig(SetMenuConfig setMenuConfig){
        setMenuConfigRepository.delete(setMenuConfig);
    }

    @Transactional(readOnly = true)
    public SetMenuConfig getOrCreateSetMenuConfig(SetMenu setMenu, Integer storeId, Long productId){
        return setMenuConfigRepository.findBySetMenuIdAndProductId(setMenu.getId(), productId)
                .orElseGet(() -> SetMenuConfig.builder()
                        .product(productService.getProduct(storeId, productId))
                        .setMenu(setMenu)
                        .build());
    }
}
