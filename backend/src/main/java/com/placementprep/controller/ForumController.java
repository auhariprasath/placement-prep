package com.placementprep.controller;

import com.placementprep.dto.ForumCommentDTO;
import com.placementprep.dto.ForumPostDTO;
import com.placementprep.service.ForumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forum")
public class ForumController {
    
    @Autowired
    private ForumService forumService;
    
    @PostMapping("/posts")
    public ResponseEntity<ForumPostDTO> createPost(@RequestBody ForumPostDTO postDTO, @RequestParam Long userId) {
        ForumPostDTO created = forumService.createPost(userId, postDTO);
        return ResponseEntity.ok(created);
    }
    
    @GetMapping("/posts")
    public ResponseEntity<Page<ForumPostDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(forumService.getAllPosts(pageable));
    }
    
    @GetMapping("/posts/{postId}")
    public ResponseEntity<ForumPostDTO> getPostById(@PathVariable Long postId) {
        return ResponseEntity.ok(forumService.getPostById(postId));
    }
    
    @GetMapping("/posts/category/{category}")
    public ResponseEntity<Page<ForumPostDTO>> getPostsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(forumService.getPostsByCategory(category, pageable));
    }
    
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<ForumCommentDTO> addComment(
            @PathVariable Long postId,
            @RequestParam Long userId,
            @RequestBody ForumCommentDTO commentDTO) {
        return ResponseEntity.ok(forumService.addComment(postId, userId, commentDTO));
    }
    
    @GetMapping("/posts/search")
    public ResponseEntity<Page<ForumPostDTO>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(forumService.searchPosts(keyword, pageable));
    }
    
    @GetMapping("/posts/recent")
    public ResponseEntity<List<ForumPostDTO>> getRecentPosts() {
        return ResponseEntity.ok(forumService.getRecentPosts());
    }
    
    @GetMapping("/posts/popular")
    public ResponseEntity<List<ForumPostDTO>> getPopularPosts() {
        return ResponseEntity.ok(forumService.getPopularPosts());
    }
    
    @PostMapping("/posts/{postId}/upvote")
    public ResponseEntity<Void> upvotePost(@PathVariable Long postId) {
        forumService.upvotePost(postId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/posts/{postId}/resolve")
    public ResponseEntity<Void> markAsResolved(@PathVariable Long postId) {
        forumService.markAsResolved(postId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/comments/{commentId}/accept")
    public ResponseEntity<Void> acceptAnswer(@PathVariable Long commentId) {
        forumService.acceptAnswer(commentId);
        return ResponseEntity.ok().build();
    }
}
