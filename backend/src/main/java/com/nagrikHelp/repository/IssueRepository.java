package com.nagrikHelp.repository;

import com.nagrikHelp.model.Issue;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface IssueRepository extends MongoRepository<Issue, String> {
    List<Issue> findByCreatedByOrderByUpdatedAtDesc(String createdBy);
    List<Issue> findAllByOrderByUpdatedAtDesc();
}
