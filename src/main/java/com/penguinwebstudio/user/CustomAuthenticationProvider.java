package com.penguinwebstudio.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;

import com.penguinwebstudio.conversation.ConversationService;

@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {

	@Autowired
	UserService userService;
	
	@Autowired
	ConversationService conversationService;
	
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		String username = authentication.getName();
		String password = authentication.getCredentials().toString();
		User user = userService.getUser(username);
		String existingPassword;
		if (user != null) {
			existingPassword = user.getPassword();
			if (BCrypt.checkpw(password, existingPassword)) {
				List<SimpleGrantedAuthority> grantedAuths = new ArrayList<>();
				grantedAuths.add(new SimpleGrantedAuthority("ROLE_USER"));
				if (user.isAdmin()) {
					grantedAuths.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
				}
				conversationService.addUser(username);
				conversationService.updateLastAction(username, "AVAILABLE");
				conversationService.deleteUserConversations(username);
				return new UsernamePasswordAuthenticationToken(username, password, grantedAuths);
			} else {
				throw new BadCredentialsException("Invalid username or password.");
			}
		} else {
			throw new BadCredentialsException("Invalid username or password.");
		}
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return authentication.equals(UsernamePasswordAuthenticationToken.class);
	}

}