package com.placementprep.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userAvatar;
    private String title;
    private String content;
    private String excerpt;
    private String coverImage;
    private String category;
    private String tags;
    private String company;
    private String role;
    private String placementType;
    private int views;
    private int likes;
    private int commentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<BlogCommentDTO> comments;
}
