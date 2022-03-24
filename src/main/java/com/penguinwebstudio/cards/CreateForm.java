package com.penguinwebstudio.cards;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.web.bind.annotation.RequestParam;

public class CreateForm {
	
	private Long pileId;
	
	@NotBlank
	@Size(min=1, max=100)
	@Pattern(regexp="^[A-Za-z0-9 _,!.?-]{1,100}$")
	private String title;
	
	private boolean makePublic;
	
	private List<Card> cards;
	
	@NotBlank
	@Size(min=1, max=1000)
	@Pattern(regexp="^[A-Za-z0-9\\-_]+$")
	private String recaptcha;

	public Long getPileId() {
		return this.pileId;
	}
	
	public String getTitle() {
		return this.title;
	}
	
	public boolean getMakePublic() {
		return this.makePublic;
	}

	public List<Card> getCards() {
		return this.cards;
	}
	
	public String getRecaptcha() {
		return this.recaptcha;
	}
	
	public void setPileId(Long pileId) {
		this.pileId = pileId;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public void setMakePublic(boolean makePublic) {
		this.makePublic = makePublic;
	}

	public void setCards(List<Card> cards) {
		this.cards = cards;
	}
	
	public void setRecaptcha(String recaptcha) {
		this.recaptcha = recaptcha;
	}
	
}
