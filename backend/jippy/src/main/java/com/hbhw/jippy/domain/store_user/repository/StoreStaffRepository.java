package com.hbhw.jippy.domain.store_user.repository;

import com.hbhw.jippy.domain.store_user.entity.StoreUserStaff;
import com.hbhw.jippy.domain.user.entity.UserStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreStaffRepository extends JpaRepository<StoreUserStaff, Integer> {
    boolean existsByStoreIdAndUserStaff(Integer storeId, UserStaff userStaff);

    @Query("SELECT ss FROM StoreUserStaff ss JOIN FETCH ss.userStaff WHERE ss.storeId = :storeId")
    List<StoreUserStaff> findAllByStoreIdWithUserStaff(@PathVariable Integer storeId);

    Optional<StoreUserStaff> findByStoreIdAndUserStaffId(Integer storeId, Integer staffId);
}
