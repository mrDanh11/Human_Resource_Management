package com.group07.human_resource_management.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DotenvConfig {
//    @Bean
//    public Dotenv dotenv() {
//        return Dotenv.configure()
//                .filename(".env")    // load file .env
//                .ignoreIfMalformed()
//                .ignoreIfMissing()
//                .load();
//    }

    @PostConstruct
    public void loadEnv() {
        Dotenv dotenv = Dotenv.configure()
                .directory("./")     // load từ root
                .ignoreIfMissing()
                .load();

        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });
    }
}
