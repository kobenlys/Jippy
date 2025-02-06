package com.hbhw.jippy.domain.chat.repository;

import com.hbhw.jippy.domain.chat.entity.StoreChat;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ChatRepository extends MongoRepository<StoreChat, Integer> {
    Optional<StoreChat> findByStoreId(Integer storeId);

}
