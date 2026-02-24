package com.placementprep.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "blog_posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPost {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "excerpt", columnDefinition = "TEXT")
    private String excerpt;
    
    @Column(name = "cover_image")
    private String coverImage;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "tags")
    private String tags;
    
    @Column(name = "company")
    private String company;
    
    @Column(name = "role")
    private String role;
    
    @Column(name = "placement_type")
    private String placementType;
    
    @Column(name = "is_published")
    private boolean published = true;
    
    @Column(name = "views")
    private int views = 0;
    
    @Column(name = "likes")
    private int likes = 0;
    
    @OneToMany(mappedBy = "blogPost", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BlogComment> comments = new ArrayList<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
