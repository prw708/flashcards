package com.penguinwebstudio.cards;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface CardRepository extends CrudRepository<Card, Long> {

	public Optional<Card> findById(Long id);
	
	public List<Card> findByPileOrderByOrderIdAsc(Long pile);
	
	public void deleteById(Long id);
	
	public long count();
	
}
