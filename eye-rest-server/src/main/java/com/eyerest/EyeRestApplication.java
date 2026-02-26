package com.eyerest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class EyeRestApplication {
    public static void main(String[] args) {
        SpringApplication.run(EyeRestApplication.class, args);
    }
}
