package com.penguinwebstudio.chat;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import com.penguinwebstudio.conversation.ConversationService;

public class CustomLogoutHandler implements LogoutHandler {
	
	@Autowired
	ConversationService conversationService;

	@Override
	public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
		String username = authentication.getName();
		conversationService.deleteUser(username);
		try {
			request.logout();
		} catch (ServletException e) {
			e.printStackTrace();
		}
	}
	
}
