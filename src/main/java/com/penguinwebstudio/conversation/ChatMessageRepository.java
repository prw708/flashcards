package com.penguinwebstudio.conversation;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface ChatMessageRepository extends CrudRepository<ChatMessage, Long> {

	public Optional<ChatMessage> findById(Long id);
	
	public List<ChatMessage> findByChatRoomOrderByPostedOnAsc(Long chatRoom);
	
	public void deleteById(Long id);
	
	public long count();
	
}
