package com.penguinwebstudio.flashcards;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebAutoConfiguration;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.data.web.config.HateoasAwareSpringDataWebConfiguration;
import org.springframework.data.web.config.PageableHandlerMethodArgumentResolverCustomizer;

@Configuration
public class DataWebAutoConfig extends SpringDataWebAutoConfiguration {

	public DataWebAutoConfig(SpringDataWebProperties properties) {
		super(properties);
	}

	@Bean
	public PageableHandlerMethodArgumentResolverCustomizer pageableCustomizer() {
		return p -> p.setOneIndexedParameters(true);
	}

}
