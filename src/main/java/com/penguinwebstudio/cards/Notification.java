package com.penguinwebstudio.conversation;

import java.util.Date;

public class Notification {

	private String username;
	private String chatWith;
	private Date notifiedOn;
	private boolean acknowledged;
	
	public Notification(String username, String chatWith, Date notifiedOn) {
		this.username = username;
		this.chatWith = chatWith;
		this.notifiedOn = notifiedOn;
		this.acknowledged = false;
	}
	
	public String getUsername() {
		return this.username;
	}
	
	public String getChatWith() {
		return this.chatWith;
	}
	
	public Date getNotifiedOn() {
		return this.notifiedOn;
	}
	
	public boolean getAcknowledged() {
		return this.acknowledged;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public void setChatWith(String chatWith) {
		this.chatWith = chatWith;
	}
	
	public void setNotifiedOn(Date notifiedOn) {
		this.notifiedOn = notifiedOn;
	}
	
	public void setAcknowledged(boolean acknowledged) {
		this.acknowledged = acknowledged;
	}
	
}
