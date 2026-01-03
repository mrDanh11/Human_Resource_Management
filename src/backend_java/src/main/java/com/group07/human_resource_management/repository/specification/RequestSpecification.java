package com.group07.human_resource_management.repository.specification;

import com.group07.human_resource_management.entity.Request;
import org.springframework.data.jpa.domain.Specification;

public class RequestSpecification {
    public static Specification<Request> hasManager(Long managerId){
        return (root, query, cb) -> {

            return cb.equal(root.get("employee").get("manager").get("id"), managerId);
        };
    }

    public static Specification<Request> hasStatus(String status){
        return (root, query, cb) -> {
          if (status == null || status.isEmpty()) return null;

          return cb.equal(root.get("status"), status);
        };
    }

    public static Specification<Request> hasType(String type){
        return (root, query, cb) -> {
            if(type == null || type.isEmpty()) return null;

            return cb.equal(root.get("type"), type);
        };
    }

    public static Specification<Request> hasKeyword(String keyword){
        return (root, query, cb) -> {
            if(keyword == null || keyword.isEmpty()) return null;

            String likePattern = "%" + keyword + "%";
            return cb.like(cb.lower(root.get("employee").get("fullname")), likePattern);
        };
    }

}
