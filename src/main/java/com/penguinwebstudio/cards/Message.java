package com.penguinwebstudio.conversation;

import java.util.Date;

public class Message {

	private Long chatRoom;
	private String username;
	private String chatWith;
	private Date postedOn;
	private String message;
	private boolean cpu;
	
	public Message(Long chatRoom, String username, String chatWith, Date postedOn, String message, boolean cpu) {
		this.chatRoom = chatRoom;
		this.username = username;
		this.chatWith = chatWith;
		this.postedOn = postedOn;
		this.message = message;
		this.cpu = cpu;
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
