package com.penguinwebstudio.cards;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.web.bind.annotation.RequestParam;

public class RatingForm {
	
	private Long pileId;
	
	private String rater;
	
	private int rating;
		
	@NotBlank
	@Size(min=1, max=1000)
	@Pattern(regexp="^[A-Za-z0-9\\-_]+$")
	private String recaptcha;

	public Long getPileId() {
		return this.pileId;
	}
	
	public String getRater() {
		return this.rater;
	}
	
	public int getRating() {
		return this.rating;
	}

	public String getRecaptcha() {
		return this.recaptcha;
	}
	
	public void setPileId(Long pileId) {
		this.pileId = pileId;
	}
	
	public void setRater(String rater) {
		this.rater = rater;
	}
	
	public void setRating(int rating) {
		this.rating = rating;
	}

	public void setRecaptcha(String recaptcha) {
		this.recaptcha = recaptcha;
	}
	
}
