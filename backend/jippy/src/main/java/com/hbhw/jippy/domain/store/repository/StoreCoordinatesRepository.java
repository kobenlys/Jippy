package com.hbhw.jippy.domain.store.repository;

import com.hbhw.jippy.domain.store.entity.StoreCoordinates;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StoreCoordinatesRepository extends MongoRepository<StoreCoordinates, Integer> {
    StoreCoordinates findByStoreId(Integer storeId);
}
