function load(path, data) {
	return new Promise(function(resolve, reject) {
		var httpRequest = new XMLHttpRequest();
		var csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
		var csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
		var recaptchaSiteKey = document.querySelector('meta[name="recaptchaSiteKey"]').getAttribute('content');
		grecaptcha.ready(function() {
        	grecaptcha.execute(recaptchaSiteKey, { action: 'load' })
        	.then(function(recaptchaToken) {
	          	data['recaptcha'] = recaptchaToken;
	          	httpRequest.open('POST', path, true);
	          	httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	          	httpRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
				httpRequest.setRequestHeader(csrfHeader, csrfToken);
	          	httpRequest.send(JSON.stringify(data));
        	}.bind(this));
      	}.bind(this));
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					try {
						var json = JSON.parse(httpRequest.responseText);
					} catch (e) {
						resolve(false);
					}
					resolve(json);
				} else {
					reject(httpRequest.status);
				}
			}
		}.bind(this);
	}.bind(this));
}

function save(path, data) {
	return new Promise(function(resolve, reject) {
		var httpRequest = new XMLHttpRequest();
		var csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
		var csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
		var recaptchaSiteKey = document.querySelector('meta[name="recaptchaSiteKey"]').getAttribute('content');
		grecaptcha.ready(function() {
        	grecaptcha.execute(recaptchaSiteKey, { action: 'save' })
        	.then(function(recaptchaToken) {
	          	data['recaptcha'] = recaptchaToken;
	          	httpRequest.open('POST', path, true);
	          	httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	          	httpRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
				httpRequest.setRequestHeader(csrfHeader, csrfToken);
	          	httpRequest.send(JSON.stringify(data));
        	}.bind(this));
      	}.bind(this));
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					try {
						var success = JSON.parse(httpRequest.responseText);
					} catch (e) {
						resolve({status: false});
					}
					resolve(success);
				} else {
					reject(httpRequest.status);
				}
			}
		}.bind(this);
	}.bind(this));
}