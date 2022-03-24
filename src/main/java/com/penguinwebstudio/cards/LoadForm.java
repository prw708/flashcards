package com.penguinwebstudio.cards;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.web.bind.annotation.RequestParam;

public class LoadForm {
	
	private Long pileId;
	
	@NotBlank
	@Size(min=1, max=1000)
	@Pattern(regexp="^[A-Za-z0-9\\-_]+$")
	private String recaptcha;
	
	public Long getPileId() {
		return this.pileId;
	}
	
	public String getRecaptcha() {
		return this.recaptcha;
	}
	
	public void setPileId(Long pileId) {
		this.pileId = pileId;
	}
	
	public void setRecaptcha(String recaptcha) {
		this.recaptcha = recaptcha;
	}
	
}
