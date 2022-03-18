package com.penguinwebstudio.conversation;

import java.util.Date;

public class DoneMessage {

	private String chatRoomId;
	private String user1;
	private String user2;
	
	public DoneMessage(String chatRoomId, String user1, String user2) {
		this.chatRoomId = chatRoomId;
		this.user1 = user1;
		this.user2 = user2;
	}
	
	public String getChatRoomId() {
		return this.chatRoomId;
	}
	
	public String getUser1() {
		return this.user1;
	}
	
	public String getUser2() {
		return this.user2;
	}
	
	public void setChatRoomId(String chatRoomId) {
		this.chatRoomId = chatRoomId;
	}
	
	public void setUser1(String user1) {
		this.user1 = user1;
	}
	
	public void setUser2(String user2) {
		this.user2 = user2;
	}
	
}
