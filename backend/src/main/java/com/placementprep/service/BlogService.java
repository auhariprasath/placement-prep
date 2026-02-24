package com.placementprep.service;

import com.placementprep.dto.BlogCommentDTO;
import com.placementprep.dto.BlogPostDTO;
import com.placementprep.model.BlogComment;
import com.placementprep.model.BlogPost;
import com.placementprep.model.User;
import com.placementprep.repository.BlogCommentRepository;
import com.placementprep.repository.BlogPostRepository;
import com.placementprep.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogService {
    
    @Autowired
    private BlogPostRepository blogPostRepository;
    
    @Autowired
    private BlogCommentRepository blogCommentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public BlogPostDTO createPost(Long userId, BlogPostDTO postDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        BlogPost post = new BlogPost();
        post.setUser(user);
        post.setTitle(postDTO.getTitle());
        post.setContent(postDTO.getContent());
        post.setExcerpt(postDTO.getExcerpt());
        post.setCoverImage(postDTO.getCoverImage());
        post.setCategory(postDTO.getCategory());
        post.setTags(postDTO.getTags());
        post.setCompany(postDTO.getCompany());
        post.setRole(postDTO.getRole());
        post.setPlacementType(postDTO.getPlacementType());
        post.setPublished(true);
        
        BlogPost saved = blogPostRepository.save(post);
        return convertToPostDTO(saved);
    }
    
    @Transactional(readOnly = true)
    public Page<BlogPostDTO> getAllPosts(Pageable pageable) {
        return blogPostRepository.findByPublishedTrueOrderByCreatedAtDesc(pageable)
                .map(this::convertToPostDTO);
    }
    
    @Transactional(readOnly = true)
    public Page<BlogPostDTO> getPostsByCategory(String category, Pageable pageable) {
        return blogPostRepository.findByCategoryAndPublishedTrueOrderByCreatedAtDesc(category, pageable)
                .map(this::convertToPostDTO);
    }
    
    @Transactional(readOnly = true)
    public Page<BlogPostDTO> getPostsByCompany(String company, Pageable pageable) {
        return blogPostRepository.findByCompany(company, pageable)
                .map(this::convertToPostDTO);
    }
    
    @Transactional(readOnly = true)
    public BlogPostDTO getPostById(Long postId) {
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setViews(post.getViews() + 1);
        blogPostRepository.save(post);
        return convertToPostDTOWithComments(post);
    }
    
    @Transactional
    public BlogCommentDTO addComment(Long postId, Long userId, BlogCommentDTO commentDTO) {
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        BlogComment comment = new BlogComment();
        comment.setBlogPost(post);
        comment.setUser(user);
        comment.setContent(commentDTO.getContent());
        
        BlogComment saved = blogCommentRepository.save(comment);
        return convertToCommentDTO(saved);
    }
    
    @Transactional(readOnly = true)
    public Page<BlogPostDTO> searchPosts(String keyword, Pageable pageable) {
        return blogPostRepository.searchByKeyword(keyword, pageable)
                .map(this::convertToPostDTO);
    }
    
    @Transactional(readOnly = true)
    public List<BlogPostDTO> getPopularPosts() {
        return blogPostRepository.findTop5ByPublishedTrueOrderByViewsDesc()
                .stream()
                .map(this::convertToPostDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<BlogPostDTO> getRecentPosts() {
        return blogPostRepository.findTop5ByPublishedTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToPostDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void likePost(Long postId) {
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLikes(post.getLikes() + 1);
        blogPostRepository.save(post);
    }
    
    @Transactional
    public BlogPostDTO updatePost(Long postId, BlogPostDTO postDTO) {
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        post.setTitle(postDTO.getTitle());
        post.setContent(postDTO.getContent());
        post.setExcerpt(postDTO.getExcerpt());
        post.setCategory(postDTO.getCategory());
        post.setTags(postDTO.getTags());
        
        BlogPost saved = blogPostRepository.save(post);
        return convertToPostDTO(saved);
    }
    
    @Transactional
    public void deletePost(Long postId) {
        blogPostRepository.deleteById(postId);
    }
    
    private BlogPostDTO convertToPostDTO(BlogPost post) {
        BlogPostDTO dto = new BlogPostDTO();
        dto.setId(post.getId());
        dto.setUserId(post.getUser().getId());
        dto.setUserName(post.getUser().getFullName());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setExcerpt(post.getExcerpt());
        dto.setCoverImage(post.getCoverImage());
        dto.setCategory(post.getCategory());
        dto.setTags(post.getTags());
        dto.setCompany(post.getCompany());
        dto.setRole(post.getRole());
        dto.setPlacementType(post.getPlacementType());
        dto.setViews(post.getViews());
        dto.setLikes(post.getLikes());
        dto.setCommentCount((int) blogCommentRepository.countByBlogPostId(post.getId()));
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        return dto;
    }
    
    private BlogPostDTO convertToPostDTOWithComments(BlogPost post) {
        BlogPostDTO dto = convertToPostDTO(post);
        List<BlogComment> comments = blogCommentRepository.findByBlogPostIdOrderByCreatedAtDesc(post.getId());
        dto.setComments(comments.stream()
                .map(this::convertToCommentDTO)
                .collect(Collectors.toList()));
        return dto;
    }
    
    private BlogCommentDTO convertToCommentDTO(BlogComment comment) {
        BlogCommentDTO dto = new BlogCommentDTO();
        dto.setId(comment.getId());
        dto.setBlogPostId(comment.getBlogPost().getId());
        dto.setUserId(comment.getUser().getId());
        dto.setUserName(comment.getUser().getFullName());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
}
