package com.placementprep.repository;

import com.placementprep.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    @Query("SELECT cm FROM ChatMessage cm WHERE " +
           "(cm.sender.id = :userId1 AND cm.receiver.id = :userId2) OR " +
           "(cm.sender.id = :userId2 AND cm.receiver.id = :userId1) " +
           "ORDER BY cm.createdAt ASC")
    List<ChatMessage> findConversation(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.receiver.id = :userId AND cm.read = false ORDER BY cm.createdAt DESC")
    List<ChatMessage> findUnreadMessages(@Param("userId") Long userId);
    
    @Query("SELECT DISTINCT CASE WHEN cm.sender.id = :userId THEN cm.receiver.id ELSE cm.sender.id END " +
           "FROM ChatMessage cm WHERE cm.sender.id = :userId OR cm.receiver.id = :userId")
    List<Long> findConversationPartners(@Param("userId") Long userId);
    
    long countByReceiverIdAndReadFalse(Long receiverId);
}
