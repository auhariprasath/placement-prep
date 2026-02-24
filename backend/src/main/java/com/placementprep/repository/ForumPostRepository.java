package com.placementprep.repository;

import com.placementprep.model.ForumPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {
    
    Page<ForumPost> findByCategoryOrderByCreatedAtDesc(String category, Pageable pageable);
    
    Page<ForumPost> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    @Query("SELECT fp FROM ForumPost fp WHERE fp.title LIKE %:keyword% OR fp.content LIKE %:keyword% OR fp.authorName LIKE %:keyword% OR fp.company LIKE %:keyword% ORDER BY fp.createdAt DESC")
    Page<ForumPost> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT fp FROM ForumPost fp WHERE fp.resolved = false ORDER BY fp.createdAt DESC")
    Page<ForumPost> findUnresolvedPosts(Pageable pageable);
    
    @Query("SELECT fp.category, COUNT(fp) FROM ForumPost fp GROUP BY fp.category")
    List<Object[]> getCategoryCounts();
    
    List<ForumPost> findTop10ByOrderByCreatedAtDesc();
    
    List<ForumPost> findTop10ByOrderByViewsDesc();
}
