package com.nagrikHelp.controller;

import com.nagrikHelp.dto.IssueResponse;
import com.nagrikHelp.dto.UpdateIssueRequest;
import com.nagrikHelp.service.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final IssueService issueService;

    @GetMapping("/ping")
    public ResponseEntity<?> ping(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok("ADMIN OK: " + (user != null ? user.getUsername() : "unknown"));
    }

    @GetMapping("/issues")
    public List<IssueResponse> getAll() {
        return issueService.getAllIssues();
    }

    @PatchMapping("/issues/{id}")
    public ResponseEntity<IssueResponse> update(@PathVariable String id, @RequestBody UpdateIssueRequest req) {
        return issueService.updateIssue(id, req)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
