package com.penguinwebstudio.chat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.penguinwebstudio.conversation.ConversationController;
import com.penguinwebstudio.logger.LogService;
import com.penguinwebstudio.user.UserController;

@SpringBootApplication
@ComponentScan(basePackageClasses=UserController.class)
@ComponentScan(basePackageClasses=WebSecurityConfig.class)
@ComponentScan(basePackageClasses=LogService.class)
@ComponentScan(basePackageClasses=ConversationController.class)
@EntityScan("com.penguinwebstudio.conversation")
@EnableJpaRepositories("com.penguinwebstudio.conversation")
public class ChatApplication {

	public static void main(String[] args) {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(ChatApplication.class.getPackage().getName());
		SpringApplication.run(ChatApplication.class, args);
	}

}
