function setUserStatus(username, status) {
	if (!username || !status) {
		return Promise.resolve(false);
	}
	return new Promise(function(resolve, reject) {
		var httpRequest = new XMLHttpRequest();
		var path = "/set?username=" + username + "&status=" + status;
		httpRequest.open("GET", path, true);
		httpRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		httpRequest.send();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					resolve(true);
				} else {
					reject(httpRequest.status);
				}
			}
		};
	});
}
	
function getAllUsers() {
	return new Promise(function(resolve, reject) {
		var httpRequest = new XMLHttpRequest();
		var path = "/all";
		httpRequest.open("GET", path, true);
		httpRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		httpRequest.send();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					resolve(JSON.parse(httpRequest.responseText));
				} else {
					reject(httpRequest.status);
				}
			}
		};
	});
}

function getUser(username) {
	if (!username) {
		return Promise.resolve(false);
	}
	return new Promise(function(resolve, reject) {
		var httpRequest = new XMLHttpRequest();
		var path = "/get?username=" + username;
		httpRequest.open("GET", path, true);
		httpRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		httpRequest.send();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					resolve(JSON.parse(httpRequest.responseText));
				} else {
					reject(httpRequest.status);
				}
			}
		};
	});
}

function resetStatus(user1, user2) {
	if (!user1 || !user2) {
		return Promise.resolve(false);
	}
	return new Promise(function(resolve, reject) {
		var httpRequest = new XMLHttpRequest();
		var path = "/reset?user1=" + user1 + "&user2=" + user2;
		httpRequest.open("GET", path, true);
		httpRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		httpRequest.send();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					resolve(JSON.parse(httpRequest.responseText));
				} else {
					reject(httpRequest.status);
				}
			}
		};
	});
}