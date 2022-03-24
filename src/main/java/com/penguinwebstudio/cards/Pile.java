package com.penguinwebstudio.cards;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Pile {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	
	@Column(name="title")
	private String title;
	
	@Column(name="creator")
	private String creator;
	
	@Column(name="public")
	private boolean makePublic;
	
	@Column(name="lastUpdated")
	private Date lastUpdated;
	
	@Column(name="count")
	private Long count;
	
	@Column(name="rating")
	private Double rating;
	
	@Column(name="ratingsCompleted")
	private Long ratingsCompleted;
	
	protected Pile() {
	}
	
	public Pile(String title, String creator, boolean makePublic, Date lastUpdated) {
		this.title = title;
		this.creator = creator;
		this.makePublic = makePublic;
		this.lastUpdated = lastUpdated;
		this.count = (long) 0;
		this.rating = (double) 0;
		this.ratingsCompleted = (long) 0;
	}
	
	public Long getId() {
		return this.id;
	}
	
	public String getTitle() {
		return this.title;
	}
	
	public String getCreator() {
		return this.creator;
	}
	
	public boolean getMakePublic() {
		return this.makePublic;
	}
	
	public Date getLastUpdated() {
		return this.lastUpdated;
	}
	
	public Long getCount() {
		return this.count;
	}
	
	public Double getRating() {
		return this.rating;
	}
	
	public Long getRatingsCompleted() {
		return this.ratingsCompleted;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public void setCreator(String creator) {
		this.creator = creator;
	}
	
	public void setMakePublic(boolean makePublic) {
		this.makePublic = makePublic;
	}
	
	public void setLastUpdated(Date lastUpdated) {
		this.lastUpdated = lastUpdated;
	}
	
	public void setCount(Long count) {
		this.count = count;
	}
	
	public void setRating(Double rating) {
		this.rating = rating;
	}
	
	public void setRatingsCompleted(Long ratingsCompleted) {
		this.ratingsCompleted = ratingsCompleted;
	}
	
}
