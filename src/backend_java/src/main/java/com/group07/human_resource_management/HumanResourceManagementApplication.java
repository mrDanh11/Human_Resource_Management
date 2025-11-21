package com.group07.human_resource_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = {
    org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class,
    org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration.class
})
public class HumanResourceManagementApplication {

	public static void main(String[] args) {
		System.out.println("=== Hello World ===");
		System.out.println("Starting Human Resource Management System...");
		SpringApplication.run(HumanResourceManagementApplication.class, args);
		System.out.println("=== Hello World ===");
		System.out.println("Human Resource Management System started successfully!");
		System.out.println("Test API: http://localhost:8080/api/v1/hello");
		System.out.println("=== Hello World ===");
	}

}
