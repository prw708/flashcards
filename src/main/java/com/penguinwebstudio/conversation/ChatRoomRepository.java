package com.penguinwebstudio.conversation;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface ChatRoomRepository extends CrudRepository<ChatRoom, Long> {

	public Optional<ChatRoom> findById(Long id);
	
	public ChatRoom findByUser1(String user1);
	
	public List<ChatRoom> findByUser2(String user2);
	
	public void deleteById(Long id);
	
	public long count();
	
}
