package com.placementprep.service;

import com.placementprep.dto.ChatMessageDTO;
import com.placementprep.model.ChatMessage;
import com.placementprep.model.User;
import com.placementprep.repository.ChatMessageRepository;
import com.placementprep.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public ChatMessageDTO sendMessage(Long senderId, Long receiverId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        
        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setMessageType("TEXT");
        
        ChatMessage saved = chatMessageRepository.save(message);
        return convertToDTO(saved);
    }
    
    @Transactional(readOnly = true)
    public List<ChatMessageDTO> getConversation(Long userId1, Long userId2) {
        return chatMessageRepository.findConversation(userId1, userId2)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ChatMessageDTO> getUnreadMessages(Long userId) {
        return chatMessageRepository.findUnreadMessages(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void markAsRead(Long messageId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setRead(true);
        chatMessageRepository.save(message);
    }
    
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return chatMessageRepository.countByReceiverIdAndReadFalse(userId);
    }
    
    @Transactional(readOnly = true)
    public List<Long> getConversationPartners(Long userId) {
        return chatMessageRepository.findConversationPartners(userId);
    }
    
    private ChatMessageDTO convertToDTO(ChatMessage message) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getFullName());
        dto.setReceiverId(message.getReceiver().getId());
        dto.setReceiverName(message.getReceiver().getFullName());
        dto.setContent(message.getContent());
        dto.setMessageType(message.getMessageType());
        dto.setRead(message.isRead());
        dto.setCreatedAt(message.getCreatedAt());
        return dto;
    }
}
