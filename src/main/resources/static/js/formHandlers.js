function loginSubmit(token) {
	document.getElementById("12-form").submit();
}

function deleteHandler(e) {
	e.preventDefault();
    grecaptcha.ready(function() {
		var recaptchaSiteKey = document.querySelector("meta[name='recaptchaSiteKey']").getAttribute("content");
    	grecaptcha.execute(recaptchaSiteKey, {action: 'delete'}).then(function(token) {
			e.target.parentNode.elements['recaptcha'].value = token;
			e.target.parentNode.submit();
		});
	});
}