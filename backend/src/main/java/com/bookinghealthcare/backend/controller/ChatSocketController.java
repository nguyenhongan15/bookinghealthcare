package com.bookinghealthcare.backend.controller;

import com.bookinghealthcare.backend.entity.ChatMessage;
import com.bookinghealthcare.backend.entity.SenderType;
import com.bookinghealthcare.backend.repository.ChatMessageRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class ChatSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatRepo;

    @MessageMapping("/chat.send")
    public void sendMessage(com.bookinghealthcare.backend.model.ChatMessage msg) {

        try {
            // Lưu DB
            ChatMessage entity = new ChatMessage();
            entity.setDoctorId(msg.getDoctorId().longValue());
            entity.setUserId(msg.getUserId());
            entity.setContent(msg.getContent());
            entity.setFromRole(SenderType.valueOf(msg.getFromRole()));
            entity.setCreatedAt(LocalDateTime.now());

            chatRepo.save(entity);

            // Publish realtime
            String room = "/topic/room." + msg.getDoctorId() + "." + msg.getUserId();
            messagingTemplate.convertAndSend(room, msg);

        } catch (Exception e) {
            System.out.println(" ERROR saving chat: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
