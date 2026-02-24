package com.placementprep.repository;

import com.placementprep.model.CodingProblem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodingProblemRepository extends JpaRepository<CodingProblem, Long> {
    
    Page<CodingProblem> findByDifficultyOrderByIdAsc(String difficulty, Pageable pageable);
    
    Page<CodingProblem> findByCategoryOrderByIdAsc(String category, Pageable pageable);
    
    @Query("SELECT cp FROM CodingProblem cp WHERE " +
           "cp.title LIKE %:keyword% OR cp.description LIKE %:keyword% OR cp.tags LIKE %:keyword%")
    Page<CodingProblem> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT cp.category, COUNT(cp) FROM CodingProblem cp GROUP BY cp.category")
    List<Object[]> getCategoryCounts();
    
    @Query("SELECT cp.difficulty, COUNT(cp) FROM CodingProblem cp GROUP BY cp.difficulty")
    List<Object[]> getDifficultyCounts();
    
    List<CodingProblem> findTop10ByOrderByIdAsc();
}
