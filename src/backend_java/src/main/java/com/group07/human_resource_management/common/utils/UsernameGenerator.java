package com.group07.human_resource_management.common.utils;

import com.group07.human_resource_management.entity.Employee;
import org.springframework.stereotype.Component;

@Component
public class UsernameGenerator {
    public String generate(Employee e) {
        return e.getEmail().toLowerCase();
    }
}
