package com.penguinwebstudio.cards;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.web.bind.annotation.RequestParam;

public class DeleteForm {
		
	@NotBlank
	@Size(min=1, max=10)
	@Pattern(regexp="^[0-9]+$")
	String pileId;
	
	@NotBlank 
	@Size(min=1, max=1000) 
	@Pattern(regexp="^[A-Za-z0-9\\-_]+$")
	String recaptcha;
		
	public void setPileId(String id) {
		this.pileId = id;
	}
	
	public String getPileId() {
		return this.pileId;
	}
	
	public void setRecaptcha(String recaptcha) {
		this.recaptcha = recaptcha;
	}
	
	public String getRecaptcha() {
		return this.recaptcha;
	}
	
}
