package com.penguinwebstudio.cards;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

public interface RaterRepository extends CrudRepository<Rater, Long> {

	public Optional<Rater> findById(Long id);
	
	public List<Rater> findByPileId(Long pileId);
	
	public Rater findByRaterAndPileId(String rater, Long pileId);

	public void deleteById(Long id);
	
	public long count();
	
	public long countByPileId(Long pileId);
		
}
