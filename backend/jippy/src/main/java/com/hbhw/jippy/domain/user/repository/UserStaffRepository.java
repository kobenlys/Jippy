package com.hbhw.jippy.domain.user.repository;

import com.hbhw.jippy.domain.user.entity.UserStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserStaffRepository extends JpaRepository<UserStaff, Integer> {
    boolean existsByEmail(String email);
}
