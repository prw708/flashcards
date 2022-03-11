package com.penguinwebstudio.conversation;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface LoggedInUserRepository extends CrudRepository<LoggedInUser, Long> {

	public Optional<LoggedInUser> findById(Long id);
	
	public LoggedInUser findByUsername(String username);
	
	public List<LoggedInUser> findAllByOrderByUsername();
	
	public List<LoggedInUser> findAllByOrderByLastAction();
	
	public void deleteById(Long id);
	
	public long count();
	
}