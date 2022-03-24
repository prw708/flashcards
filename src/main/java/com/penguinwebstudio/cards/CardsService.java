package com.penguinwebstudio.cards;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CardsService {
	
	PileRepository pileRepository;
	CardRepository cardRepository;
	RaterRepository raterRepository;
	
	@Autowired
	public CardsService(
			PileRepository pileRepository, 
			CardRepository cardRepository,
			RaterRepository raterRepository
	) {
		this.pileRepository = pileRepository;
		this.cardRepository = cardRepository;
		this.raterRepository = raterRepository;
	}
	
	public Long createPile(Pile pile, List<Card> cards) {
		Pile existingPile = null;
		if (pile.getId() != null) {
			existingPile = pileRepository.findById(pile.getId()).orElse(null);
		}
		if (existingPile != null) {
			existingPile.setTitle(pile.getTitle());
			existingPile.setCreator(pile.getCreator());
			existingPile.setMakePublic(pile.getMakePublic());
			existingPile.setLastUpdated(pile.getLastUpdated());
			existingPile.setCount((long) cards.size());
			pileRepository.save(existingPile);
			List<Card> existingCards = cardRepository.findByPileOrderByOrderIdAsc(existingPile.getId());
			for (Card c : existingCards) {
				cardRepository.delete(c);
			}
			Long orderId = (long) 1;
			for (Card c : cards) {
				Card card = new Card(existingPile.getId(), orderId, c.getFront(), c.getBack());
				cardRepository.save(card);
				orderId++;
			}
			return existingPile.getId();
		} else {
			pile.setCount((long) cards.size());
			pileRepository.save(pile);
			Long orderId = (long) 1;
			for (Card c : cards) {
				Card card = new Card(pile.getId(), orderId, c.getFront(), c.getBack());
				cardRepository.save(card);
				orderId++;
			}
			return pile.getId();
		}
	}
	
	public Page<Pile> getPilesByCreator(String creator, Pageable pageable) {
		return pileRepository.findByCreatorOrderByLastUpdatedDescCreatorAsc(creator, pageable);
	}
	
	public CreateForm loadPile(Long pileId) {
		List<Card> cards = cardRepository.findByPileOrderByOrderIdAsc(pileId);
		Pile pile = pileRepository.findById(pileId).orElse(null);
		CreateForm data = new CreateForm();
		data.setTitle(pile.getTitle());
		data.setMakePublic(pile.getMakePublic());
		data.setCards(cards);
		data.setRecaptcha(null);
		return data;
	}
	
	public Pile getPileById(Long pileId) {
		return pileRepository.findById(pileId).orElse(null);
	}
	
	public Page<Pile> getPublicPiles(String search, Pageable pageable) {
		if (search != null && !search.isEmpty()) {
			return pileRepository.findByMakePublicAndTitleContainingIgnoreCase(true, search, pageable);
		}
		return pileRepository.findByMakePublic(true, pageable);
	}
	
	public void deletePile(Long pileId) {
		pileRepository.deleteById(pileId);
		List<Rater> ratings = raterRepository.findByPileId(pileId);
		for (Rater r : ratings) {
			raterRepository.deleteById(r.getId());
		}
	}
	
	public Long getPileCountByCreator(String creator) {
		return pileRepository.countByCreator(creator);
	}
	
	public Pile setRating(RatingForm ratingForm) {
		if (raterRepository.findByRaterAndPileId(ratingForm.getRater(), ratingForm.getPileId()) != null) {
			return null;
		} else {
			Rater r = new Rater(ratingForm.getPileId(), ratingForm.getRater());
			raterRepository.save(r);
			Pile p = pileRepository.findById(ratingForm.getPileId()).orElse(null);
			double avgN1 = (p.getRating() * p.getRatingsCompleted() + ratingForm.getRating()) / (p.getRatingsCompleted() + 1);
			p.setRating(avgN1);
			p.setRatingsCompleted(p.getRatingsCompleted() + 1);
			pileRepository.save(p);
			return p;
		}
	}
	
	public Page<Pile> getAllPiles(Pageable pageable) {
		Page<Pile> piles = pileRepository.findAllByOrderByLastUpdatedDescCreatorAsc(pageable);
		return piles;
	}
	
}
