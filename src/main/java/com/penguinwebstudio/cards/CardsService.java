package com.penguinwebstudio.conversation;

import java.util.Date;
import java.util.List;
import java.util.Optional;

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
	
	public ResetStatusMessage resetStatus(String user1, String user2) {
		List<ChatRoom> chatRooms = chatRoomRepository.findByActive(true);
		String user1Status = "AVAILABLE";
		String user2Status = "AVAILABLE";
		for (ChatRoom c : chatRooms) {
			if (c.getUser1().equals(user1) || c.getUser2().equals(user1)) {
				user1Status = "BUSY";
				break;
			}
		}
		for (ChatRoom c : chatRooms) {
			if (c.getUser1().equals(user2) || c.getUser2().equals(user2)) {
				user2Status = "BUSY";
				break;
			}
		}
		return new ResetStatusMessage(user1, user1Status, user2, user2Status);
	}
	
	public Long createChatRoom(String loggedInAs, String user1, String user2) {
		ChatRoom chatRoom = null;
		if (chatRoomRepository.findByUser1(user1) != null) {
			return (long) -1;
		}
		if (chatRoomRepository.findByUser2(user1).size() != 0) {
			List<ChatRoom> user2List = chatRoomRepository.findByUser2(user1);
			for (ChatRoom c : user2List) {
				if (c.getActive()) {
					return (long) -1;
				}
			}
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
			for (ChatRoom c : user2List) {
				if (c.getUser2().equals(user1) && c.getUser1().equals(user2)) {
					chatRoom = c;
					chatRoom.setActive(true);
					chatRoomRepository.save(chatRoom);
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
	
	public boolean deleteUserConversations(String username) {
		try {
			ChatRoom chatRoom = chatRoomRepository.findByUser1(username);
			if (chatRoom != null) {
				List<ChatMessage> conversation = chatMessageRepository.findByChatRoomOrderByPostedOnAsc(chatRoom.getId());
				for (ChatMessage c : conversation) {
					chatMessageRepository.deleteById(c.getId());
				}
				chatRoomRepository.deleteById(chatRoom.getId());
			}
			List<ChatRoom> chatRooms = chatRoomRepository.findByUser2(username);
			if (chatRooms != null && chatRooms.size() > 0) {
				for (ChatRoom c : chatRooms) {
					List<ChatMessage> conversation = chatMessageRepository.findByChatRoomOrderByPostedOnAsc(c.getId());
					for (ChatMessage m : conversation) {
						chatMessageRepository.deleteById(m.getId());
					}
					chatRoomRepository.deleteById(c.getId());
				}
			}
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
