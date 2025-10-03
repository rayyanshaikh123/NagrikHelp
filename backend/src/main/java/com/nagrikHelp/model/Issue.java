package com.nagrikHelp.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "issues")
public class Issue {
    @Id
    private String id;

    private String title;
    private String description;
    private String location;
    private String photoUrl;

    private IssueStatus status;

    // store creator as email (username)
    @Indexed
    private String createdBy;

    private String assignee; // email of assignee (optional)

    // epoch millis for easy FE consumption
    private long createdAt;
    private long updatedAt;
}
