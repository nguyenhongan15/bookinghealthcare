package com.bookinghealthcare.backend.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {

    boolean existsByUsername(String username);

    Optional<UserAccount> findByUsername(String username);

    Optional<UserAccount> findByPhone(String phone);
    Optional<UserAccount> findByEmail(String email);

}
   
