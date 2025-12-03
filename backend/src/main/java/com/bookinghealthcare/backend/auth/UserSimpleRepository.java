package com.bookinghealthcare.backend.auth;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSimpleRepository extends JpaRepository<UserSimple, Long> {
}
