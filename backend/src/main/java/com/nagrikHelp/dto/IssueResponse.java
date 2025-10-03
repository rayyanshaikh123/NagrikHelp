package com.nagrikHelp.dto;

import com.nagrikHelp.model.Issue;
import com.nagrikHelp.model.IssueStatus;
import com.nagrikHelp.model.IssueCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssueResponse {
    private String id;
    private String title;
    private String description;
    private String location;
    private String photoUrl;
    private IssueStatus status;
    private String createdBy;
    private String assignee;
    private long createdAt;
    private long updatedAt;
    private IssueCategory category;
    private String imageBase64;

    public static IssueResponse from(Issue i) {
        IssueResponse r = new IssueResponse();
        r.setId(i.getId());
        r.setTitle(i.getTitle());
        r.setDescription(i.getDescription());
        r.setLocation(i.getLocation());
        r.setPhotoUrl(i.getPhotoUrl());
        r.setStatus(i.getStatus());
        r.setCreatedBy(i.getCreatedBy());
        r.setAssignee(i.getAssignee());
        r.setCreatedAt(i.getCreatedAt());
        r.setUpdatedAt(i.getUpdatedAt());
        r.setCategory(i.getCategory());
        r.setImageBase64(i.getImageBase64());
        return r;
    }
}
