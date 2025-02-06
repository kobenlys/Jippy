package com.hbhw.jippy.domain.product.service;

import com.hbhw.jippy.domain.product.entity.SetMenuConfig;
import com.hbhw.jippy.domain.product.repository.SetMenuConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class SetMenuConfigService {

    private final SetMenuConfigRepository setMenuConfigRepository;

    @Transactional
    public void saveSetMenuConfig(SetMenuConfig setMenuConfig) {
        setMenuConfigRepository.save(setMenuConfig);
    }

}
