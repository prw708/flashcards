package com.penguinwebstudio.conversation;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.google.gson.Gson;
import com.penguinwebstudio.user.User;
import com.penguinwebstudio.user.UserService;
import com.penguinwebstudio.utils.HttpRequests;
import com.penguinwebstudio.utils.RecaptchaResponse;

@Validated
@Controller
public class ConversationController {

	@Value("${google.recaptcha.key.production.site}")
	private String recaptchaSiteKey;
	@Value("${google.recaptcha.key.production.secret}")
	private String recaptchaSecretKey;
	
	private ConversationService conversationService;
	private SimpMessagingTemplate simpMessagingTemplate;
	
	@Autowired
	public ConversationController(ConversationService conversationService, SimpMessagingTemplate simpMessagingTemplate) {
		this.conversationService = conversationService;
		this.simpMessagingTemplate = simpMessagingTemplate;
	}
	
	public static boolean isAdmin() {
		List<SimpleGrantedAuthority> authorities = (List<SimpleGrantedAuthority>) SecurityContextHolder.getContext().getAuthentication().getAuthorities();
		for (SimpleGrantedAuthority authority : authorities) {
			if (authority.getAuthority().equals("ROLE_ADMIN")) {
				return true;
			}
		}
		return false;
	}
	
	@GetMapping(path="")
	public String home(Model model) {
		String loggedInAs = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if (loggedInAs.equals("anonymousUser")) {
			loggedInAs = null;
		}
		model.addAttribute("loggedInAs", loggedInAs);
		model.addAttribute("admin", isAdmin());
		return "home";
	}
	
	@ResponseBody
	@GetMapping(path="/all")
	public List<LoggedInUser> getAllLoggedInUsers() {
		List<LoggedInUser> loggedInUsers = conversationService.getAllUsersByUsername();
		return loggedInUsers;
	}
	
	@ResponseBody
	@GetMapping(path="/get")
	public LoggedInUser getUser(
			@Pattern(regexp="^[A-Za-z0-9\\-_]+$") @RequestParam("username") String username	
	) {
		LoggedInUser loggedInUser = conversationService.getUser(username);
		return loggedInUser;
	}
	
	@ResponseBody
	@GetMapping(path="/set")
	public boolean setUserStatus(
			@Pattern(regexp="^[A-Za-z0-9\\-_]+$") @RequestParam("username") String username,
			@Pattern(regexp="^[A-Za-z0-9\\-_]+$") @RequestParam("status") String status
	) {
		if (username == null || status == null) {
			return false;
		}
		conversationService.updateLastAction(username, status);
		return true;
	}
	
	@GetMapping(path="/chat")
	public String chat(
			Model model,
			@Pattern(regexp="^[A-Za-z0-9\\-_]+$") @RequestParam("user1") String user1,
			@Pattern(regexp="^[A-Za-z0-9\\-_]+$") @RequestParam("user2") String user2
	) {
		String loggedInAs = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if (loggedInAs.equals("anonymousUser")) {
			loggedInAs = null;
		}
		model.addAttribute("loggedInAs", loggedInAs);
		model.addAttribute("admin", isAdmin());
		if (user1 == null || user2 == null || (loggedInAs.equals(user1) && loggedInAs.equals(user2))) {
			model.addAttribute("errorMessage", "Could not create chat room.");
			return "home";
		} else if (!user1.equals(loggedInAs) && !user2.equals(loggedInAs)) {
			model.addAttribute("errorMessage", "You are not allowed in this chat room.");
			return "home";
		} else {
			Long chatRoomId = conversationService.createChatRoom(loggedInAs, user1, user2);
			if (chatRoomId == -1) {
				model.addAttribute("errorMessage", "Users are busy.");
				return "home";
			}
			model.addAttribute("chatRoomId", chatRoomId);
			model.addAttribute("with", user2);
			return "chat";
		}
	}
	
	@MessageMapping("/{chatRoomId}/message")
	public void sendReply(Message message, @Pattern(regexp="^[0-9]+$") @DestinationVariable String chatRoomId) throws Exception {
		ChatMessage newMessage = new ChatMessage(
				message.getChatRoom(), 
				message.getUsername(),
				message.getChatWith(),
				new Date(),
				message.getMessage(),
				message.getCpu()
		);
		conversationService.addChatMessage(newMessage);
		List<ChatMessage> conversation = conversationService.getAllChatRoomMessages(message.getChatRoom());
		if (message.getCpu() && message.getMessage().equals("The conversation has been ended.")) {
			deleteConversation(new DoneMessage(message.getChatRoom().toString(), message.getUsername(), message.getChatWith()));
		}
		this.simpMessagingTemplate.convertAndSend("/receive/" + chatRoomId + "/message", conversation);
	}
		
	@MessageMapping("/done")
	@SendTo("/receive/done")
	public DoneMessage deleteConversation(DoneMessage message) {
		conversationService.deleteChatRoomConversation(Long.parseLong(message.getChatRoomId()));
		return message;
	}
	
	@MessageMapping("/notification")
	@SendTo("/receive/notification")
	public Notification sendNotification(Notification notification) {
		if (conversationService.getUser(notification.getChatWith()).getStatus().equals("BUSY")) {
			notification.setAcknowledged(true);
		}
		return notification;
	}
	
	@MessageMapping("/{chatRoomId}/status")
	public void sendStatus(StatusMessage statusMessage, @Pattern(regexp="^[0-9]+$") @DestinationVariable String chatRoomId) throws Exception {
		this.simpMessagingTemplate.convertAndSend("/receive/" + chatRoomId + "/status", statusMessage);
	}
	
}
