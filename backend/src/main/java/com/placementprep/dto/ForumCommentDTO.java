package com.placementprep.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ForumCommentDTO {
    private Long id;
    private Long postId;
    private Long userId;
    private String userName;
    private String content;
    private boolean acceptedAnswer;
    private int upvotes;
    private Long parentCommentId;
    private LocalDateTime createdAt;
    private List<ForumCommentDTO> replies;
}
