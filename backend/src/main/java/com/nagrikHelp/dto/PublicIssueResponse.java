package com.nagrikHelp.dto;

import com.nagrikHelp.model.Issue;
import com.nagrikHelp.model.IssueCategory;
import com.nagrikHelp.model.IssueStatus;
import lombok.Data;

@Data
public class PublicIssueResponse {
    private String title;
    private String description;
    private IssueCategory category;
    private String imageBase64;
    private String location;
    private IssueStatus status;
    private long createdAt;
    private long upvoteCount;

    public static PublicIssueResponse from(Issue i, long upVotes) {
        PublicIssueResponse r = new PublicIssueResponse();
        r.setTitle(i.getTitle());
        r.setDescription(i.getDescription());
        r.setCategory(i.getCategory());
        r.setImageBase64(i.getImageBase64());
        r.setLocation(i.getLocation());
        r.setStatus(i.getStatus());
        r.setCreatedAt(i.getCreatedAt());
        r.setUpvoteCount(upVotes);
        return r;
    }
}