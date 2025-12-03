package com.group07.human_resource_management.common.utils;

import com.group07.human_resource_management.entity.Employee;
import org.springframework.stereotype.Component;

@Component
public class PasswordGenerator {
    public String generate(Employee e) {
        return VNStringUtils.removeDiacritics(e.getFullname())
                .replace(" ", "")
                .toLowerCase();
    }
}
