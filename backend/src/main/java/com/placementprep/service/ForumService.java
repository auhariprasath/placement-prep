package com.placementprep.service;

import com.placementprep.dto.ForumCommentDTO;
import com.placementprep.dto.ForumPostDTO;
import com.placementprep.model.ForumComment;
import com.placementprep.model.ForumPost;
import com.placementprep.model.User;
import com.placementprep.repository.ForumCommentRepository;
import com.placementprep.repository.ForumPostRepository;
import com.placementprep.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ForumService {
    
    @Autowired
    private ForumPostRepository forumPostRepository;
    
    @Autowired
    private ForumCommentRepository forumCommentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public ForumPostDTO createPost(Long userId, ForumPostDTO postDTO) {
        User user = userRepository.findById(userId)
                .orElseGet(() -> {
                    List<User> users = userRepository.findAll();
                    if (users.isEmpty()) {
                        User defaultUser = new User();
                        defaultUser.setFullName("Community Member");
                        defaultUser.setEmail("community@placementprep.com");
                        defaultUser.setPassword("default_pass");
                        return userRepository.save(defaultUser);
                    }
                    return users.get(0);
                });
        
        ForumPost post = new ForumPost();
        post.setUser(user);
        post.setTitle(postDTO.getTitle());
        post.setContent(postDTO.getContent());
        post.setCategory(postDTO.getCategory());
        post.setTags(postDTO.getTags());
        post.setAuthorName(postDTO.getAuthorName());
        post.setCompany(postDTO.getCompany());
        
        ForumPost saved = forumPostRepository.save(post);
        return convertToPostDTO(saved);
    }
    
    @Transactional(readOnly = true)
    public Page<ForumPostDTO> getAllPosts(Pageable pageable) {
        return forumPostRepository.findAll(pageable)
                .map(this::convertToPostDTO);
    }
    
    @Transactional(readOnly = true)
    public Page<ForumPostDTO> getPostsByCategory(String category, Pageable pageable) {
        return forumPostRepository.findByCategoryOrderByCreatedAtDesc(category, pageable)
                .map(this::convertToPostDTO);
    }
    
    @Transactional(readOnly = true)
    public ForumPostDTO getPostById(Long postId) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setViews(post.getViews() + 1);
        forumPostRepository.save(post);
        return convertToPostDTOWithComments(post);
    }
    
    @Transactional
    public ForumCommentDTO addComment(Long postId, Long userId, ForumCommentDTO commentDTO) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        User user = userRepository.findById(userId)
                .orElseGet(() -> {
                    List<User> users = userRepository.findAll();
                    if (users.isEmpty()) return null;
                    return users.get(0);
                });
        
        if (user == null) throw new RuntimeException("User not found and no default user available");
        
        ForumComment comment = new ForumComment();
        comment.setForumPost(post);
        comment.setUser(user);
        comment.setContent(commentDTO.getContent());
        
        if (commentDTO.getParentCommentId() != null) {
            ForumComment parent = forumCommentRepository.findById(commentDTO.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParentComment(parent);
        }
        
        ForumComment saved = forumCommentRepository.save(comment);
        return convertToCommentDTO(saved);
    }
    
    @Transactional(readOnly = true)
    public Page<ForumPostDTO> searchPosts(String keyword, Pageable pageable) {
        return forumPostRepository.searchByKeyword(keyword, pageable)
                .map(this::convertToPostDTO);
    }
    
    @Transactional(readOnly = true)
    public List<ForumPostDTO> getRecentPosts() {
        return forumPostRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToPostDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ForumPostDTO> getPopularPosts() {
        return forumPostRepository.findTop10ByOrderByViewsDesc()
                .stream()
                .map(this::convertToPostDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void upvotePost(Long postId) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setUpvotes(post.getUpvotes() + 1);
        forumPostRepository.save(post);
    }
    
    @Transactional
    public void markAsResolved(Long postId) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setResolved(true);
        forumPostRepository.save(post);
    }
    
    @Transactional
    public void acceptAnswer(Long commentId) {
        ForumComment comment = forumCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setAcceptedAnswer(true);
        forumCommentRepository.save(comment);
        
        ForumPost post = comment.getForumPost();
        post.setResolved(true);
        forumPostRepository.save(post);
    }
    
    private ForumPostDTO convertToPostDTO(ForumPost post) {
        ForumPostDTO dto = new ForumPostDTO();
        dto.setId(post.getId());
        dto.setUserId(post.getUser().getId());
        dto.setUserName(post.getUser().getFullName());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setCategory(post.getCategory());
        dto.setTags(post.getTags());
        dto.setViews(post.getViews());
        dto.setUpvotes(post.getUpvotes());
        dto.setAuthorName(post.getAuthorName());
        dto.setCompany(post.getCompany());
        dto.setResolved(post.isResolved());
        dto.setCommentCount((int) forumCommentRepository.countByForumPostId(post.getId()));
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        return dto;
    }
    
    private ForumPostDTO convertToPostDTOWithComments(ForumPost post) {
        ForumPostDTO dto = convertToPostDTO(post);
        List<ForumComment> comments = forumCommentRepository.findByForumPostIdAndParentCommentIsNullOrderByCreatedAtAsc(post.getId());
        dto.setComments(comments.stream()
                .map(this::convertToCommentDTOWithReplies)
                .collect(Collectors.toList()));
        return dto;
    }
    
    private ForumCommentDTO convertToCommentDTO(ForumComment comment) {
        ForumCommentDTO dto = new ForumCommentDTO();
        dto.setId(comment.getId());
        dto.setPostId(comment.getForumPost().getId());
        dto.setUserId(comment.getUser().getId());
        dto.setUserName(comment.getUser().getFullName());
        dto.setContent(comment.getContent());
        dto.setAcceptedAnswer(comment.isAcceptedAnswer());
        dto.setUpvotes(comment.getUpvotes());
        dto.setParentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null);
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
    
    private ForumCommentDTO convertToCommentDTOWithReplies(ForumComment comment) {
        ForumCommentDTO dto = convertToCommentDTO(comment);
        List<ForumComment> replies = forumCommentRepository.findByParentCommentIdOrderByCreatedAtAsc(comment.getId());
        dto.setReplies(replies.stream()
                .map(this::convertToCommentDTO)
                .collect(Collectors.toList()));
        return dto;
    }
}
