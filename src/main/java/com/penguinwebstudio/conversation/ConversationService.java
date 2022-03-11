package com.penguinwebstudio.conversation;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConversationService {

	LoggedInUserRepository loggedInUserRepository;
	ChatRoomRepository chatRoomRepository;
	ChatMessageRepository chatMessageRepository;
	
	@Autowired
	public ConversationService(
			LoggedInUserRepository loggedInUserRepository, 
			ChatRoomRepository chatRoomRepository,
			ChatMessageRepository chatMessageRepository
	) {
		this.loggedInUserRepository = loggedInUserRepository;
		this.chatRoomRepository = chatRoomRepository;
		this.chatMessageRepository = chatMessageRepository;
	}
	
	public List<LoggedInUser> getAllUsersByUsername() {
		return loggedInUserRepository.findAllByOrderByUsername();
	}
	
	public List<LoggedInUser> getAllUsersByLastAction() {
		return loggedInUserRepository.findAllByOrderByLastAction();
	}
	
	public LoggedInUser getUser(String username) {
		LoggedInUser loggedInUser = loggedInUserRepository.findByUsername(username);
		return loggedInUser;
	}
	
	public void addUser(String username) {
		LoggedInUser loggedInUser = loggedInUserRepository.findByUsername(username);
		if (loggedInUser != null) {
			loggedInUser.setLastAction(new Date());
			loggedInUserRepository.save(loggedInUser);
		} else {
			LoggedInUser newUser = new LoggedInUser(username);
			loggedInUserRepository.save(newUser);
		}
	}
	
	public void deleteUser(String username) {
		LoggedInUser loggedInUser = loggedInUserRepository.findByUsername(username);
		if (loggedInUser != null) {
			loggedInUserRepository.deleteById(loggedInUser.getId());
		}
	}
	
	public void updateLastAction(String username, String status) {
		LoggedInUser loggedInUser = loggedInUserRepository.findByUsername(username);
		if (loggedInUser == null) {
			return;
		}
		loggedInUser.setLastAction(new Date());
		loggedInUser.setStatus(status);
		loggedInUserRepository.save(loggedInUser);
	}
	
	public Long createChatRoom(String loggedInAs, String user1, String user2) {
		ChatRoom chatRoom = null;
		if (chatRoomRepository.findByUser1(user1) != null) {
			return (long) -1;
		}
		if (chatRoomRepository.findByUser1(user1) == null && 
			chatRoomRepository.findByUser2(user2).size() == 0 &&
			chatRoomRepository.findByUser1(user2) == null
		) {
			chatRoom = new ChatRoom(user1, user2);
			chatRoomRepository.save(chatRoom);
		} else if (loggedInUserRepository.findByUsername(user2).getStatus().equals("BUSY") && 
			chatRoomRepository.findByUser2(user1).size() != 0
		) {
			List<ChatRoom> user2List = chatRoomRepository.findByUser2(user1);
			for (ChatRoom u : user2List) {
				if (u.getUser2().equals(user1) && u.getUser1().equals(user2)) {
					chatRoom = u;
					break;
				}
			}
		} else if (!loggedInUserRepository.findByUsername(user2).getStatus().equals("BUSY") && 
			chatRoomRepository.findByUser2(user2).size() != 0 &&
			chatRoomRepository.findByUser1(user2) == null
		) {
			List<ChatRoom> user2List = chatRoomRepository.findByUser2(user1);
			if (user2List.size() == 0) {
				chatRoom = new ChatRoom(user1, user2);
				chatRoomRepository.save(chatRoom);
			} else {
				for (ChatRoom u : user2List) {
					if (u.getUser2().equals(user2)) {
						chatRoom = new ChatRoom(user1, user2);
						chatRoomRepository.save(chatRoom);
						break;
					}
				}
			}
		}
		if (chatRoom == null) {
			return (long) -1;
		}
		return chatRoom.getId();
	}
	
	public boolean deleteChatRoomConversation(Long chatRoomId) {
		try {
			List<ChatMessage> conversation = chatMessageRepository.findByChatRoomOrderByPostedOnAsc(chatRoomId);
			for (ChatMessage c : conversation) {
				chatMessageRepository.deleteById(c.getId());
			}
			chatRoomRepository.deleteById(chatRoomId);
		} catch (Exception e) {
			return false;
		}
		return true;
	}
	
	public void addChatMessage(ChatMessage message) {
		chatMessageRepository.save(message);
	}
	
	public List<ChatMessage> getAllChatRoomMessages(Long chatRoom) {
		return chatMessageRepository.findByChatRoomOrderByPostedOnAsc(chatRoom);
	}
	
}
