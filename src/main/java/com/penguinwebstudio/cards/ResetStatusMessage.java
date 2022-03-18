package com.penguinwebstudio.conversation;

public class ResetStatusMessage {

	private String user1;
	private String user1Status;
	private String user2;
	private String user2Status;
	
	public ResetStatusMessage(String user1, String user1Status, String user2, String user2Status) {
		this.user1 = user1;
		this.user1Status = user1Status;
		this.user2 = user2;
		this.user2Status = user2Status;
	}
	
	public String getUser1() {
		return this.user1;
	}
	
	public String getUser1Status() {
		return this.user1Status;
	}
	
	public String getUser2() {
		return this.user2;
	}
	
	public String getUser2Status() {
		return this.user2Status;
	}
	
	public void setUser1(String user1) {
		this.user1 = user1;
	}
	
	public void setUser1Status(String user1Status) {
		this.user1Status = user1Status;
	}
	
	public void setUser2(String user2) {
		this.user2 = user2;
	}
	
	public void setUser2Status(String user2Status) {
		this.user2Status = user2Status;
	}
	
}
