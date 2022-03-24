package com.penguinwebstudio.flashcards;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.penguinwebstudio.cards.CardsController;
import com.penguinwebstudio.logger.LogService;
import com.penguinwebstudio.user.UserController;

@SpringBootApplication
@ComponentScan(basePackageClasses=UserController.class)
@ComponentScan(basePackageClasses=WebSecurityConfig.class)
@ComponentScan(basePackageClasses=LogService.class)
@ComponentScan(basePackageClasses=CardsController.class)
@EntityScan("com.penguinwebstudio.cards")
@EnableJpaRepositories("com.penguinwebstudio.cards")
public class FlashCardsApplication {

	public static void main(String[] args) {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(FlashCardsApplication.class.getPackage().getName());
		SpringApplication.run(FlashCardsApplication.class, args);
	}

}
