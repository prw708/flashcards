package com.penguinwebstudio.conversation;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class ChatMessage {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	
	@Column(name="chatRoom")
	private Long chatRoom;
	
	@Column(name="username")
	private String username;
	
	@Column(name="chatWith")
	private String chatWith;
	
	@Column(name="postedOn")
	private Date postedOn;
	
	@Column(name="message")
	private String message;
	
	@Column(name="cpu")
	private boolean cpu;
	
	protected ChatMessage() {
	}
	
	public ChatMessage(Long chatRoom, String username, String chatWith, Date postedOn, String message, boolean cpu) {
		this.chatRoom = chatRoom;
		this.username = username;
		this.chatWith = chatWith;
		this.postedOn = postedOn;
		this.message = message;
		this.cpu = cpu;
	}
	
	public Long getId() {
		return this.id;
	}
	
	public Long getChatRoom() {
		return this.chatRoom;
	}
	
	public String getUsername() {
		return this.username;
	}
	
	public String getChatWith() {
		return this.chatWith;
	}
	
	public Date getPostedOn() {
		return this.postedOn;
	}
	
	public String getMessage() {
		return this.message;
	}
	
	public boolean getCpu() {
		return this.cpu;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public void setChatRoom(Long chatRoom) {
		this.chatRoom = chatRoom;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public void setChatWith(String chatWith) {
		this.chatWith = chatWith;
	}
	
	public void setPostedOn(Date postedOn) {
		this.postedOn = postedOn;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
	
	public void setCpu(boolean cpu) {
		this.cpu = cpu;
	}
	
}
