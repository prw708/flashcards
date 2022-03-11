package com.penguinwebstudio.conversation;

import java.util.Date;

public class StatusMessage {

	private String username;
	private String status;
	
	public StatusMessage(String username, String status) {
		this.username = username;
		this.status = status;
	}
	
	public String getUsername() {
		return this.username;
	}
	
	public String getStatus() {
		return this.status;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
}
