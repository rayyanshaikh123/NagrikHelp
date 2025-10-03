package com.nagrikHelp.dto;

import lombok.Data;

@Data
public class UpdateIssueRequest {
    // accepts values like "pending", "in-progress", "resolved" or enum names
    private String status;
    private String assignee;
}
