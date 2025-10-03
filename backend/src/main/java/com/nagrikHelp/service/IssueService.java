package com.nagrikHelp.service;

import com.nagrikHelp.dto.*;
import com.nagrikHelp.model.Issue;
import com.nagrikHelp.model.IssueStatus;
import com.nagrikHelp.model.User;
import com.nagrikHelp.repository.IssueRepository;
import com.nagrikHelp.repository.UserRepository;
import com.nagrikHelp.service.VoteService;
import com.nagrikHelp.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IssueService {

    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final VoteService voteService;
    private final CommentService commentService;

    // Phase 1 existing API (kept for compatibility)
    public IssueResponse createIssue(String createdBy, CreateIssueRequest req) {
        long now = System.currentTimeMillis();
        Issue issue = Issue.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .location(req.getLocation())
                .photoUrl(req.getPhotoUrl())
                .status(IssueStatus.OPEN)
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

    // New Phase 2 variant returning enriched DTOs (with category, image, votes, comments)
    public List<IssueResponseDto> getIssuesForUserDto(String email) {
        return issueRepository.findByCreatedByOrderByUpdatedAtDesc(email)
                .stream().map(i -> {
                    IssueVoteSummaryDto vs = voteService.summarize(i.getId(), "__anon__");
                    IssueResponseDto dto = IssueResponseDto.from(i, vs.getUpVotes(), vs.getDownVotes(), null);
                    long cCount = commentService.count(i.getId());
                    dto.withComments(cCount, commentService.recent(i.getId(), 3));
                    return dto;
                }).toList();
    }

    public List<IssueResponse> getAllIssuesCompat() {
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

    // Phase 2 API
    public IssueResponseDto createIssue(IssueRequestDto dto, UserDetails userDetails) {
        long now = System.currentTimeMillis();
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElse(null);
        Issue issue = Issue.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .imageBase64(dto.getImageBase64())
                .location(dto.getLocation())
                .status(IssueStatus.OPEN)
                .createdBy(email)
                .createdById(user != null ? user.getId() : null)
                .createdByName(user != null ? user.getName() : null)
                .createdAt(now)
                .updatedAt(now)
                .build();
        issueRepository.save(issue);
        return IssueResponseDto.from(issue);
    }

    public List<IssueResponseDto> getAllIssues() {
        return issueRepository.findAllByOrderByUpdatedAtDesc()
                .stream().map(i -> {
                    IssueVoteSummaryDto vs = voteService.summarize(i.getId(), "__anon__");
                    IssueResponseDto dto = IssueResponseDto.from(i, vs.getUpVotes(), vs.getDownVotes(), null);
                    long cCount = commentService.count(i.getId());
                    dto.withComments(cCount, commentService.recent(i.getId(), 3));
                    return dto;
                }).toList();
    }

    public Optional<IssueResponseDto> getIssueById(String id, String userId) {
        return issueRepository.findById(id).map(i -> {
            IssueVoteSummaryDto vs = voteService.summarize(i.getId(), userId == null ? "__anon__" : userId);
            IssueResponseDto dto = IssueResponseDto.from(i, vs.getUpVotes(), vs.getDownVotes(), vs.getUserVote());
            long cCount = commentService.count(i.getId());
            dto.withComments(cCount, commentService.recent(i.getId(), 20));
            return dto;
        });
    }

    // Retain old signature for existing controller usage
    public Optional<IssueResponseDto> getIssueById(String id) {
        return getIssueById(id, null);
    }
}
