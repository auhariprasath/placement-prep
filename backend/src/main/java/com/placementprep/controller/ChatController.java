package com.placementprep.controller;

import com.placementprep.dto.ChatMessageDTO;
import com.placementprep.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    
    @Autowired
    private ChatService chatService;
    
    @PostMapping("/send")
    public ResponseEntity<ChatMessageDTO> sendMessage(
            @RequestParam Long senderId,
            @RequestParam Long receiverId,
            @RequestParam String content) {
        ChatMessageDTO message = chatService.sendMessage(senderId, receiverId, content);
        return ResponseEntity.ok(message);
    }
    
    @GetMapping("/conversation")
    public ResponseEntity<List<ChatMessageDTO>> getConversation(
            @RequestParam Long userId1,
            @RequestParam Long userId2) {
        return ResponseEntity.ok(chatService.getConversation(userId1, userId2));
    }
    
    @GetMapping("/unread")
    public ResponseEntity<List<ChatMessageDTO>> getUnreadMessages(@RequestParam Long userId) {
        return ResponseEntity.ok(chatService.getUnreadMessages(userId));
    }
    
    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount(@RequestParam Long userId) {
        return ResponseEntity.ok(chatService.getUnreadCount(userId));
    }
    
    @PostMapping("/read/{messageId}")
    public ResponseEntity<Void> markAsRead(@PathVariable Long messageId) {
        chatService.markAsRead(messageId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/partners")
    public ResponseEntity<List<Long>> getConversationPartners(@RequestParam Long userId) {
        return ResponseEntity.ok(chatService.getConversationPartners(userId));
    }
}
