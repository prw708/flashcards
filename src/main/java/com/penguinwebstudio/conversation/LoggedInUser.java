package com.penguinwebstudio.conversation;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;

import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

@Entity
public class LoggedInUser {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	
	@Column(name="username")
	private String username;
	
	@Column(name="lastAction")
	private Date lastAction;
	
	@Column(name="status")
	private String status;
	
	protected LoggedInUser() {
	}
	
	public LoggedInUser(String username) {
		this.username = username;
		this.lastAction = new Date();
	}
	
	public Long getId() {
		return this.id;
	}
	
	public String getUsername() {
		return this.username;
	}
	
	public Date getLastAction() {
		return this.lastAction;
	}
	
	public String getStatus() {
		return status;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public void setLastAction(Date lastAction) {
		this.lastAction = lastAction;
	}
	
	public void setStatus(String status) {
		switch (status) {
			case "BUSY":
				this.status = "BUSY";
				break;
			case "AWAY":
				this.status = "AWAY";
				break;
			case "AVAILABLE":
			default:
				this.status = "AVAILABLE";
				break;
		}
	}
	
}
