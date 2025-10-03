package com.nagrikHelp.service;

import com.nagrikHelp.dto.CreateIssueRequest;
import com.nagrikHelp.dto.IssueResponse;
import com.nagrikHelp.dto.UpdateIssueRequest;
import com.nagrikHelp.model.Issue;
import com.nagrikHelp.model.IssueStatus;
import com.nagrikHelp.repository.IssueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IssueService {

    private final IssueRepository issueRepository;

    public IssueResponse createIssue(String createdBy, CreateIssueRequest req) {
        long now = System.currentTimeMillis();
        Issue issue = Issue.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .location(req.getLocation())
                .photoUrl(req.getPhotoUrl())
                .status(IssueStatus.PENDING)
                .createdBy(createdBy)
                .createdAt(now)
                .updatedAt(now)
                .build();
        issueRepository.save(issue);
        return IssueResponse.from(issue);
    }

    public List<IssueResponse> getIssuesForUser(String email) {
        return issueRepository.findByCreatedByOrderByUpdatedAtDesc(email)
                .stream().map(IssueResponse::from).toList();
    }

    public List<IssueResponse> getAllIssues() {
        return issueRepository.findAllByOrderByUpdatedAtDesc()
                .stream().map(IssueResponse::from).toList();
    }

    public Optional<IssueResponse> updateIssue(String id, UpdateIssueRequest req) {
        return issueRepository.findById(id).map(existing -> {
            if (req.getStatus() != null && !req.getStatus().isBlank()) {
                existing.setStatus(parseStatus(req.getStatus()));
            }
            if (req.getAssignee() != null) {
                existing.setAssignee(req.getAssignee().isBlank() ? null : req.getAssignee());
            }
            existing.setUpdatedAt(System.currentTimeMillis());
            issueRepository.save(existing);
            return IssueResponse.from(existing);
        });
    }

    private IssueStatus parseStatus(String value) {
        String v = value.trim().toUpperCase(Locale.ROOT).replace('-', '_');
        return IssueStatus.valueOf(v);
    }
}
