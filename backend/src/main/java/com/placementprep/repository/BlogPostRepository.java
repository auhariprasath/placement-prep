package com.placementprep.repository;

import com.placementprep.model.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    
    Page<BlogPost> findByPublishedTrueOrderByCreatedAtDesc(Pageable pageable);
    
    Page<BlogPost> findByCategoryAndPublishedTrueOrderByCreatedAtDesc(String category, Pageable pageable);
    
    Page<BlogPost> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    @Query("SELECT bp FROM BlogPost bp WHERE bp.published = true AND " +
           "(bp.title LIKE %:keyword% OR bp.content LIKE %:keyword% OR bp.tags LIKE %:keyword%) " +
           "ORDER BY bp.createdAt DESC")
    Page<BlogPost> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT bp FROM BlogPost bp WHERE bp.published = true AND bp.company = :company ORDER BY bp.createdAt DESC")
    Page<BlogPost> findByCompany(@Param("company") String company, Pageable pageable);
    
    @Query("SELECT bp FROM BlogPost bp WHERE bp.published = true AND bp.placementType = :type ORDER BY bp.createdAt DESC")
    Page<BlogPost> findByPlacementType(@Param("type") String type, Pageable pageable);
    
    List<BlogPost> findTop5ByPublishedTrueOrderByViewsDesc();
    
    List<BlogPost> findTop5ByPublishedTrueOrderByCreatedAtDesc();
    
    @Query("SELECT bp.category, COUNT(bp) FROM BlogPost bp WHERE bp.published = true GROUP BY bp.category")
    List<Object[]> getCategoryCounts();
    
    @Query("SELECT bp.company, COUNT(bp) FROM BlogPost bp WHERE bp.published = true AND bp.company IS NOT NULL GROUP BY bp.company")
    List<Object[]> getCompanyCounts();
}
