package com.placementprep.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ForumPostDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String title;
    private String content;
    private String category;
    private String tags;
    private int views;
    private int upvotes;
    private String authorName;
    private String company;
    private boolean resolved;
    private int commentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ForumCommentDTO> comments;
}
