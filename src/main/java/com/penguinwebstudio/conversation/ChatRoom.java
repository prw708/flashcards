package com.penguinwebstudio.conversation;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class ChatRoom {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	
	@Column(name="user1")
	private String user1;
	
	@Column(name="user2")
	private String user2;
	
	protected ChatRoom() {
	}
	
	public ChatRoom(String user1, String user2) {
		this.user1 = user1;
		this.user2 = user2;
	}
	
	public Long getId() {
		return this.id;
	}
	
	public String getUser1() {
		return this.user1;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public void setUser1(String user1) {
		this.user1 = user1;
	}
	
	public String getUser2() {
		return this.user2;
	}
	
	public void setUser2(String user2) {
		this.user2 = user2;
	}
	
}
