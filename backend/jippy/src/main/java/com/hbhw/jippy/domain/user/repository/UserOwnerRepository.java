package com.hbhw.jippy.domain.user.repository;

import com.hbhw.jippy.domain.user.entity.UserOwner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserOwnerRepository extends JpaRepository<UserOwner, Integer> {
    boolean existsByEmail(String email);
}
