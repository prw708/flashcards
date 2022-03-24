package com.penguinwebstudio.cards;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Rater {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	
	@Column(name="pileId")
	private Long pileId;
	
	@Column(name="rater")
	private String rater;
	
	protected Rater() {
	}
	
	public Rater(Long pileId, String rater) {
		this.pileId = pileId;
		this.rater = rater;
	}
	
	public Long getId() {
		return this.id;
	}
	
	public Long getPileId() {
		return this.pileId;
	}
	
	public String getRater() {
		return this.rater;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public void setPileId(Long pileId) {
		this.pileId = pileId;
	}
	
	public void setRater(String rater) {
		this.rater = rater;
	}
	
}
