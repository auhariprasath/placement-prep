package com.placementprep.repository;

import com.placementprep.model.ForumComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumCommentRepository extends JpaRepository<ForumComment, Long> {
    
    List<ForumComment> findByForumPostIdOrderByCreatedAtAsc(Long postId);
    
    List<ForumComment> findByForumPostIdAndParentCommentIsNullOrderByCreatedAtAsc(Long postId);
    
    List<ForumComment> findByParentCommentIdOrderByCreatedAtAsc(Long parentCommentId);
    
    List<ForumComment> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    long countByForumPostId(Long postId);
}
