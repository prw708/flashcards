package com.penguinwebstudio.cards;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.google.gson.Gson;
import com.penguinwebstudio.user.User;
import com.penguinwebstudio.user.UserLevel;
import com.penguinwebstudio.user.UserLevelService;
import com.penguinwebstudio.user.UserService;
import com.penguinwebstudio.utils.HttpRequests;
import com.penguinwebstudio.utils.RecaptchaResponse;

@Validated
@Controller
public class CardsController {

	@Value("${google.recaptcha.key.production.site}")
	private String recaptchaSiteKey;
	@Value("${google.recaptcha.key.production.secret}")
	private String recaptchaSecretKey;
	
	private CardsService cardsService;
	private UserService userService;
	private UserLevelService userLevelService;

	@Autowired
	public CardsController(CardsService cardsService, UserService userService, UserLevelService userLevelService) {
		this.cardsService = cardsService;
		this.userService = userService;
		this.userLevelService = userLevelService;
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
	public String home(
			Model model, 
			@PageableDefault(page = 0, size = 10) 
			@SortDefault(sort="lastUpdated", direction=Sort.Direction.DESC)
			Pageable pageable,
			@RequestParam(value="search", required=false) String search
	) {
		String loggedInAs = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if (loggedInAs.equals("anonymousUser")) {
			loggedInAs = null;
		}
		int totalPages = cardsService.getPublicPiles(search, pageable).getTotalPages();
		List<Pile> piles = cardsService.getPublicPiles(search, pageable).getContent();
		model.addAttribute("loggedInAs", loggedInAs);
		model.addAttribute("admin", isAdmin());
		model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
		model.addAttribute("piles", piles);
		model.addAttribute("totalPages", totalPages);
		model.addAttribute("currentPage", pageable.getPageNumber());
		model.addAttribute("previous", pageable.previousOrFirst().getPageNumber());
		model.addAttribute("next", pageable.next().getPageNumber());
		Sort sort = pageable.getSort();
		String orderBy = null, direction = null, newDirection = null;
		for (Sort.Order order : sort) {
			orderBy = order.getProperty().toString();
			direction = order.getDirection().toString();
			break;
		}
		if (orderBy != null && direction != null) {
			if (direction.toLowerCase().equals("desc")) {
				newDirection = "asc";
			} else {
				newDirection = "desc";
			}
			model.addAttribute("orderBy", orderBy);
			model.addAttribute("newDirection", newDirection);
			model.addAttribute("direction", direction.toLowerCase());
		} else {
			model.addAttribute("orderBy", "lastUpdated");
			model.addAttribute("newDirection", "desc");
			model.addAttribute("direction", "desc");
		}
		if (search == null || search.isEmpty()) {
			search = "";
		}
		model.addAttribute("search", search);
		return "home";
	}
	
	@GetMapping(path="/create")
	public String getCreate(Model model) {
		String loggedInAs = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if (loggedInAs.equals("anonymousUser")) {
			loggedInAs = null;
		}
		model.addAttribute("loggedInAs", loggedInAs);
		model.addAttribute("admin", isAdmin());
		model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
		return "create";
	}
	
	@ResponseBody
	@PostMapping(path="/create")
	public Map<String, String> postCreate(
			@Valid @RequestBody CreateForm createForm, 
			BindingResult bindingResult, 
			Model model, 
			RedirectAttributes attr
	) {
		Map<String, String> map = new HashMap<String, String>();
		String loggedInAs = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if (loggedInAs.equals("anonymousUser")) {
			loggedInAs = null;
			map.put("status", "Not logged in.");
			map.put("pileId", null);
			return map;
		}
		if (bindingResult.hasErrors()) {
			map.put("status", "Validation errors.");
			map.put("pileId", null);
			return map;
		} else {			
			String url = "https://www.google.com/recaptcha/api/siteverify";
			String data = "secret=" + recaptchaSecretKey + "&" + "response=" + createForm.getRecaptcha();
			String json = null;
			try {
				json = HttpRequests.postJSON(url, data);
			} catch (Exception e) {
				json = null;
			}
			Gson g = new Gson();
			RecaptchaResponse recaptchaResponse = g.fromJson(json, RecaptchaResponse.class);
			if (!recaptchaResponse.isSuccess() || recaptchaResponse.getScore() < 0.7 || !recaptchaResponse.getAction().equals("save")) {
				map.put("status", "Invalid recaptcha.");
				map.put("pileId", null);
				return map;
			}
			String pileId = null;
			try {
				User user = userService.getUser(loggedInAs);
				UserLevel userLevel = userLevelService.getUser(user.getId().toString());
				int maxPiles = userLevel.getMaxCards();
				Long pilesCount = cardsService.getPileCountByCreator(loggedInAs);
				if (pilesCount + 1 <= maxPiles) {
					Pile pile = new Pile(createForm.getTitle(), loggedInAs, createForm.getMakePublic(), new Date());
					if (createForm.getPileId() != null) {
						pile.setId(createForm.getPileId());
					}
					pileId = cardsService.createPile(pile, createForm.getCards()).toString();
					userLevelService.updateUserLevelByUser(user.getId().toString());
				} else {
					map.put("status", "Max piles reached.");
					map.put("pileId", null);
					return map;
				}
			} catch (Exception e) {
				map.put("status", "Error!");
				map.put("pileId", null);
				return map;
			}
			map.put("status", "Saved!");
			map.put("pileId", pileId);
			return map;
		}
	}
	
	@GetMapping(path="/my")
	public String getMy(Model model, @PageableDefault(page = 0, size = 10) Pageable pageable) {
		String loggedInAs = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if (loggedInAs.equals("anonymousUser")) {
			loggedInAs = null;
		}
		int totalPages = cardsService.getPilesByCreator(loggedInAs, pageable).getTotalPages();
		List<Pile> piles = cardsService.getPilesByCreator(loggedInAs, pageable).getContent();
		model.addAttribute("loggedInAs", loggedInAs);
		model.addAttribute("admin", isAdmin());
		model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
		model.addAttribute("piles", piles);
		model.addAttribute("totalPages", totalPages);
		model.addAttribute("currentPage", pageable.getPageNumber());
		model.addAttribute("previous", pageable.previousOrFirst().getPageNumber());
		model.addAttribute("next", pageable.next().getPageNumber());
		return "my";
	}
	
	@GetMapping(path="/view/{pileId}")
	public String getView(
			Model model,
			@Pattern(regexp="^[0-9]+$") @PathVariable String pileId
	) {
		String loggedInAs = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if (loggedInAs.equals("anonymousUser")) {
			loggedInAs = null;
		}
		Pile pile = cardsService.getPileById(Long.parseLong(pileId));
		if (pile == null) {
			model.addAttribute("pileDoesNotExistError", true);
		} else if (pile != null && !pile.getCreator().equals(loggedInAs) && pile.getMakePublic() == false) {
			model.addAttribute("notCreatorError", true);
		}
		model.addAttribute("loggedInAs", loggedInAs);
		model.addAttribute("admin", isAdmin());
		model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
		model.addAttribute("pileId", pileId);
		return "view";
	}
	
	@GetMapping(path="/edit/{pileId}")
	public String getEdit(
			Model model,
			@Pattern(regexp="^[0-9]+$") @PathVariable String pileId
	) {
		String loggedInAs = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if (loggedInAs.equals("anonymousUser")) {
			loggedInAs = null;
		}
		Pile pile = cardsService.getPileById(Long.parseLong(pileId));
		if (pile == null) {
			model.addAttribute("pileDoesNotExistError", true);
		} else if (pile != null && !pile.getCreator().equals(loggedInAs)) {
			model.addAttribute("notCreatorError", true);
		}
		model.addAttribute("loggedInAs", loggedInAs);
		model.addAttribute("admin", isAdmin());
		model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
		model.addAttribute("pileId", pileId);
		return "edit";
	}
	
	@ResponseBody
	@PostMapping(path="/load")
	public CreateForm postLoad(
			@Valid @RequestBody LoadForm loadForm, 
			BindingResult bindingResult, 
			Model model, 
			RedirectAttributes attr
	) {
		String loggedInAs = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if (loggedInAs.equals("anonymousUser")) {
			loggedInAs = null;
		}
		if (bindingResult.hasErrors()) {		
			return null;
		} else {			
			String url = "https://www.google.com/recaptcha/api/siteverify";
			String data = "secret=" + recaptchaSecretKey + "&" + "response=" + loadForm.getRecaptcha();
			String json = null;
			try {
				json = HttpRequests.postJSON(url, data);
			} catch (Exception e) {
				json = null;
			}
			Gson g = new Gson();
			RecaptchaResponse recaptchaResponse = g.fromJson(json, RecaptchaResponse.class);
			if (!recaptchaResponse.isSuccess() || recaptchaResponse.getScore() < 0.7 || !recaptchaResponse.getAction().equals("load")) {
				return null;
			}
			Pile pile = cardsService.getPileById(loadForm.getPileId());
			if (pile == null) {
				return null;
			} else if (pile != null && !pile.getCreator().equals(loggedInAs) && pile.getMakePublic() == false) {
				return null;
			}
			CreateForm jsonData = null;
			try {
				jsonData = cardsService.loadPile(loadForm.getPileId());
			} catch (Exception e) {
				return null;
			}
			return jsonData;
		}
	}
	
	@PostMapping(path="/delete")
	public String postDelete(
			@Valid @ModelAttribute DeleteForm deleteForm,
			BindingResult bindingResult,
			Model model, 
			RedirectAttributes attr,
			@PageableDefault(page = 0, size = 10) Pageable pageable
	) {
		String loggedInAs = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if (loggedInAs.equals("anonymousUser")) {
			loggedInAs = null;
			model.addAttribute("notLoggedInError", true);
			model.addAttribute("loggedInAs", loggedInAs);
			model.addAttribute("admin", isAdmin());
			model.addAttribute("errors", null);
			model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
			return "my";
		}
		List<Pile> piles = cardsService.getPilesByCreator(loggedInAs, pageable).getContent();
		model.addAttribute("piles", piles);
		if (bindingResult.hasErrors()) {
			model.addAttribute("errors", true);
			model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
			model.addAttribute("loggedInAs", loggedInAs);
			model.addAttribute("admin", isAdmin());
			return "my";
		} else {
			String url = "https://www.google.com/recaptcha/api/siteverify";
			String data = "secret=" + recaptchaSecretKey + "&" + "response=" + deleteForm.getRecaptcha();
			String json = null;
			try {
				json = HttpRequests.postJSON(url, data);
			} catch (Exception e) {
				json = null;
			}
			Gson g = new Gson();
			RecaptchaResponse recaptchaResponse = g.fromJson(json, RecaptchaResponse.class);
			if (!recaptchaResponse.isSuccess() || recaptchaResponse.getScore() < 0.7 || !recaptchaResponse.getAction().equals("delete")) {
				model.addAttribute("errors", null);
				model.addAttribute("recaptchaError", true);
				model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
				model.addAttribute("loggedInAs", loggedInAs);
				model.addAttribute("admin", isAdmin());
				return "my";
			}
			Pile p = cardsService.getPileById(Long.parseLong(deleteForm.getPileId()));
			if (p != null && p.getCreator().equals(loggedInAs)) {
				cardsService.deletePile(Long.parseLong(deleteForm.getPileId()));
			} else {
				model.addAttribute("errors", null);
				model.addAttribute("notUserError", true);
				model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
				model.addAttribute("loggedInAs", loggedInAs);
				model.addAttribute("admin", isAdmin());
				return "my";
			}
		}
		model.addAttribute("loggedInAs", loggedInAs);
		model.addAttribute("admin", isAdmin());
		model.addAttribute("errors", null);
		model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
		attr.addFlashAttribute("successMessage", "Delete successful!");
		return "redirect:/my";
	}
	
	@ResponseBody
	@PostMapping(path="/rate")
	public Map<String, String> postRate(
			@Valid @RequestBody RatingForm ratingForm, 
			BindingResult bindingResult, 
			Model model, 
			RedirectAttributes attr
	) {
		Map<String, String> map = new HashMap<String, String>();
		String loggedInAs = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if (loggedInAs.equals("anonymousUser")) {
			loggedInAs = null;
			map.put("status", "Not logged in.");
			return map;
		}
		if (bindingResult.hasErrors()) {
			map.put("status", "Validation errors.");
			return map;
		} else {			
			String url = "https://www.google.com/recaptcha/api/siteverify";
			String data = "secret=" + recaptchaSecretKey + "&" + "response=" + ratingForm.getRecaptcha();
			String json = null;
			try {
				json = HttpRequests.postJSON(url, data);
			} catch (Exception e) {
				json = null;
			}
			Gson g = new Gson();
			RecaptchaResponse recaptchaResponse = g.fromJson(json, RecaptchaResponse.class);
			if (!recaptchaResponse.isSuccess() || recaptchaResponse.getScore() < 0.7 || !recaptchaResponse.getAction().equals("save")) {
				map.put("status", "Invalid recaptcha.");
				return map;
			}
			Pile p = cardsService.setRating(ratingForm);
			if (p == null) {
				map.put("status", "Already rated.");
				return map;
			} else {
				map.put("status", "Rated!");
				map.put("rating", Double.toString(p.getRating()));
				map.put("ratingsCompleted", Long.toString(p.getRatingsCompleted()));
			}
			return map;
		}
	}
	
	@ResponseBody
	@PostMapping(path="/load/rating")
	public Pile postLoadRating(
			@Valid @RequestBody RatingForm ratingForm, 
			BindingResult bindingResult, 
			Model model, 
			RedirectAttributes attr
	) {
		String loggedInAs = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if (loggedInAs.equals("anonymousUser")) {
			loggedInAs = null;
		}
		if (bindingResult.hasErrors()) {
			return null;
		} else {			
			String url = "https://www.google.com/recaptcha/api/siteverify";
			String data = "secret=" + recaptchaSecretKey + "&" + "response=" + ratingForm.getRecaptcha();
			String json = null;
			try {
				json = HttpRequests.postJSON(url, data);
			} catch (Exception e) {
				json = null;
			}
			Gson g = new Gson();
			RecaptchaResponse recaptchaResponse = g.fromJson(json, RecaptchaResponse.class);
			if (!recaptchaResponse.isSuccess() || recaptchaResponse.getScore() < 0.7 || !recaptchaResponse.getAction().equals("load")) {
				return null;
			}
			Pile pile = null;
			try {
				pile = cardsService.getPileById(ratingForm.getPileId());
			} catch (Exception e) {
				return null;
			}
			return pile;
		}
	}
	
	@GetMapping(path="/delete/any")
	public String getDeleteAny(Model model, @PageableDefault(page = 0, size = 10) Pageable pageable) {
		String loggedInAs = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if (loggedInAs.equals("anonymousUser")) {
			loggedInAs = null;
			model.addAttribute("notLoggedInError", true);
		}
		if (!isAdmin()) {
			model.addAttribute("notAdminError", true);
		}
		int totalPages = cardsService.getAllPiles(pageable).getTotalPages();
		List<Pile> piles = cardsService.getAllPiles(pageable).getContent();
		model.addAttribute("loggedInAs", loggedInAs);
		model.addAttribute("admin", isAdmin());
		model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
		model.addAttribute("piles", piles);
		model.addAttribute("totalPages", totalPages);
		model.addAttribute("currentPage", pageable.getPageNumber());
		model.addAttribute("previous", pageable.previousOrFirst().getPageNumber());
		model.addAttribute("next", pageable.next().getPageNumber());
		return "deleteAny";
	}
	
	@PostMapping(path="/delete/any")
	public String postDeleteAny(
			@Valid @ModelAttribute DeleteForm deleteForm,
			BindingResult bindingResult,
			Model model, 
			RedirectAttributes attr,
			@PageableDefault(page = 0, size = 10) Pageable pageable
	) {
		String loggedInAs = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		if (loggedInAs.equals("anonymousUser")) {
			loggedInAs = null;
			model.addAttribute("notLoggedInError", true);
			model.addAttribute("loggedInAs", loggedInAs);
			model.addAttribute("admin", isAdmin());
			model.addAttribute("errors", null);
			model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
			return "deleteAny";
		}
		List<Pile> piles = cardsService.getAllPiles(pageable).getContent();
		model.addAttribute("piles", piles);
		if (bindingResult.hasErrors()) {
			model.addAttribute("errors", true);
			model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
			model.addAttribute("loggedInAs", loggedInAs);
			model.addAttribute("admin", isAdmin());
			return "deleteAny";
		} else {
			String url = "https://www.google.com/recaptcha/api/siteverify";
			String data = "secret=" + recaptchaSecretKey + "&" + "response=" + deleteForm.getRecaptcha();
			String json = null;
			try {
				json = HttpRequests.postJSON(url, data);
			} catch (Exception e) {
				json = null;
			}
			Gson g = new Gson();
			RecaptchaResponse recaptchaResponse = g.fromJson(json, RecaptchaResponse.class);
			if (!recaptchaResponse.isSuccess() || recaptchaResponse.getScore() < 0.7 || !recaptchaResponse.getAction().equals("delete")) {
				model.addAttribute("errors", null);
				model.addAttribute("recaptchaError", true);
				model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
				model.addAttribute("loggedInAs", loggedInAs);
				model.addAttribute("admin", isAdmin());
				return "deleteAny";
			}
			Pile p = cardsService.getPileById(Long.parseLong(deleteForm.getPileId()));
			if (p != null && isAdmin()) {
				cardsService.deletePile(Long.parseLong(deleteForm.getPileId()));
			} else {
				model.addAttribute("errors", null);
				model.addAttribute("notAdminError", true);
				model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
				model.addAttribute("loggedInAs", loggedInAs);
				model.addAttribute("admin", isAdmin());
				return "deleteAny";
			}
		}
		model.addAttribute("loggedInAs", loggedInAs);
		model.addAttribute("admin", isAdmin());
		model.addAttribute("errors", null);
		model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
		attr.addFlashAttribute("successMessage", "Delete successful!");
		return "redirect:/delete/any";
	}
	
}
