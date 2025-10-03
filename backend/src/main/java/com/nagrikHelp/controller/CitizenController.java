package com.nagrikHelp.controller;

import com.nagrikHelp.dto.CreateIssueRequest;
import com.nagrikHelp.dto.IssueResponse;
import com.nagrikHelp.dto.IssueResponseDto;
import com.nagrikHelp.service.IssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citizen")
@RequiredArgsConstructor
public class CitizenController {

    private final IssueService issueService;

    @GetMapping("/ping")
    public ResponseEntity<?> ping(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok("CITIZEN OK: " + (user != null ? user.getUsername() : "unknown"));
    }

    @GetMapping("/issues")
    public List<IssueResponse> myIssues(@AuthenticationPrincipal UserDetails user) {
        return issueService.getIssuesForUser(user.getUsername());
    }

    @PostMapping("/issues")
    public IssueResponse createIssue(@AuthenticationPrincipal UserDetails user,
                                     @Valid @RequestBody CreateIssueRequest request) {
        return issueService.createIssue(user.getUsername(), request);
    }

    @GetMapping("/public/issues")
    public List<IssueResponseDto> publicIssues() {
        return issueService.getAllIssues();
    }
}
