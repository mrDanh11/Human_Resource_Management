package com.group07.human_resource_management.common.utils;

import java.text.Normalizer;

public class VNStringUtils {
    public static String removeDiacritics(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "");
    }
}
