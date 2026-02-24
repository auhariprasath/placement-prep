package com.placementprep.controller;

import com.placementprep.dto.BlogCommentDTO;
import com.placementprep.dto.BlogPostDTO;
import com.placementprep.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blog")
public class BlogController {
    
    @Autowired
    private BlogService blogService;
    
    @PostMapping("/posts")
    public ResponseEntity<BlogPostDTO> createPost(@RequestBody BlogPostDTO postDTO, @RequestParam Long userId) {
        BlogPostDTO created = blogService.createPost(userId, postDTO);
        return ResponseEntity.ok(created);
    }
    
    @GetMapping("/posts")
    public ResponseEntity<Page<BlogPostDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(blogService.getAllPosts(pageable));
    }
    
    @GetMapping("/posts/{postId}")
    public ResponseEntity<BlogPostDTO> getPostById(@PathVariable Long postId) {
        return ResponseEntity.ok(blogService.getPostById(postId));
    }
    
    @GetMapping("/posts/category/{category}")
    public ResponseEntity<Page<BlogPostDTO>> getPostsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(blogService.getPostsByCategory(category, pageable));
    }
    
    @GetMapping("/posts/company/{company}")
    public ResponseEntity<Page<BlogPostDTO>> getPostsByCompany(
            @PathVariable String company,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(blogService.getPostsByCompany(company, pageable));
    }
    
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<BlogCommentDTO> addComment(
            @PathVariable Long postId,
            @RequestParam Long userId,
            @RequestBody BlogCommentDTO commentDTO) {
        return ResponseEntity.ok(blogService.addComment(postId, userId, commentDTO));
    }
    
    @GetMapping("/posts/search")
    public ResponseEntity<Page<BlogPostDTO>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(blogService.searchPosts(keyword, pageable));
    }
    
    @GetMapping("/posts/popular")
    public ResponseEntity<List<BlogPostDTO>> getPopularPosts() {
        return ResponseEntity.ok(blogService.getPopularPosts());
    }
    
    @GetMapping("/posts/recent")
    public ResponseEntity<List<BlogPostDTO>> getRecentPosts() {
        return ResponseEntity.ok(blogService.getRecentPosts());
    }
    
    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<Void> likePost(@PathVariable Long postId) {
        blogService.likePost(postId);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/posts/{postId}")
    public ResponseEntity<BlogPostDTO> updatePost(
            @PathVariable Long postId,
            @RequestBody BlogPostDTO postDTO) {
        return ResponseEntity.ok(blogService.updatePost(postId, postDTO));
    }
    
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        blogService.deletePost(postId);
        return ResponseEntity.ok().build();
    }
}
