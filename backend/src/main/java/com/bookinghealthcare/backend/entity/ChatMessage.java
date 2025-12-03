package com.bookinghealthcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long doctorId;
    private Long userId;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    private SenderType fromRole;  // USER / DOCTOR

    private LocalDateTime createdAt;
}
