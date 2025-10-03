package com.nagrikHelp.dto;

import com.nagrikHelp.model.Issue;
import com.nagrikHelp.model.IssueStatus;
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

    public static IssueResponse from(Issue i) {
        return new IssueResponse(
                i.getId(), i.getTitle(), i.getDescription(), i.getLocation(), i.getPhotoUrl(),
                i.getStatus(), i.getCreatedBy(), i.getAssignee(), i.getCreatedAt(), i.getUpdatedAt()
        );
    }
}
