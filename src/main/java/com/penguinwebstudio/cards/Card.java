package com.penguinwebstudio.cards;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Size;

@Entity
public class Card {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	
	@Column(name="orderId")
	private Long orderId;
	
	@Column(name="pile")
	private Long pile;
	
	@Size(min=0, max=1000)
	@Column(name="front", length=1000)
	private String front;
	
	@Size(min=0, max=1000)
	@Column(name="back", length=1000)
	private String back;
	
	protected Card() {
	}
	
	public Card(Long pile, Long orderId, String front, String back) {
		this.pile = pile;
		this.orderId = orderId;
		this.front = front;
		this.back = back;
	}
	
	public Long getId() {
		return this.id;
	}
	
	public Long getOrderId() {
		return this.orderId;
	}
	
	public Long getPile() {
		return this.pile;
	}
	
	public String getFront() {
		return this.front;
	}
	
	public String getBack() {
		return this.back;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}
	
	public void setPile(Long pile) {
		this.pile = pile;
	}
	
	public void setFront(String front) {
		this.front = front;
	}
	
	public void setBack(String back) {
		this.back = back;
	}
	
}
