package com.penguinwebstudio.cards;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

public interface PileRepository extends CrudRepository<Pile, Long> {

	public Optional<Pile> findById(Long id);
	
	public Page<Pile> findAllByOrderByLastUpdatedDescCreatorAsc(Pageable pageable);
	
	public Page<Pile> findByCreatorOrderByLastUpdatedDescCreatorAsc(String creator, Pageable pageable);

	public Page<Pile> findByMakePublic(boolean makePublic, Pageable pageable);
	
	public Page<Pile> findByMakePublicAndTitleContainingIgnoreCase(boolean makePublic, String title, Pageable pageable);
	
	public void deleteById(Long id);
	
	public long count();
	
	public long countByCreator(String creator);
	
}
