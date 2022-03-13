const STATUS_TIMEOUT = 10000;
const ACTION_DELAY = 1000;
const DOM_CONTAINER = document.getElementById("usersContainer");

class ListButton extends React.Component {
	constructor(props) {
		super(props);	
	}
	
	handleClick(event) {
		if (this.props.loggedInStatus === "BUSY") {
			event.preventDefault();
		} else {
			this.props.onStartChat(this.props.loggedInAs, this.props.withName);
		}
	}
	
	render() {
		if (this.props.loggedInAs === this.props.withName) {
			return React.createElement("button", { 
				className: "btn btn-light btn-sm float-end", 
				disabled: true 
			}, "Logged In");
		} else if (!this.props.loggedInAs || this.props.status === "BUSY") {
			return null;
		}
		return React.createElement("a", { 
			className: (this.props.loggedInStatus === "BUSY") ? "disabled btn btn-secondary btn-sm float-end" : "btn btn-secondary btn-sm float-end",
			href: "/chat?user1=" + this.props.loggedInAs + "&user2=" + this.props.withName,
			target: "_blank",
			rel: "noopener noreferrer",
			onClick: (e) => this.handleClick(e)
		}, "Start Chat");
	}
}

class StatusIndicator extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		if (this.props.status === 'AWAY') {
			return React.createElement("span", { className: "bg-light position-absolute top-50 start-0 translate-middle p-2 border border-light rounded-circle" }, null);
		} else if (this.props.status === 'BUSY') {
			return React.createElement("span", { className: "bg-danger position-absolute top-50 start-0 translate-middle p-2 border border-light rounded-circle" }, null);
		} else {
			return React.createElement("span", { className: "bg-success position-absolute top-50 start-0 translate-middle p-2 border border-light rounded-circle" }, null);
		}
	}
}

class UsersList extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		const usersList = [];
		if (this.props.loading) {
			return React.createElement("div", { className: "text-center mb-4" }, 
				React.createElement("div", { className: "spinner-border" }, 
					React.createElement("span", { className: "visually-hidden" }, "Loading...")
				)
			);
		} else if (!this.props.users || this.props.users.length === 0) {
			return React.createElement("p", { className: "mb-0" }, "No users to show.");
		} else {
			this.props.users.forEach((user) => {
				var user = React.createElement("div", { className: "p-3 border-bottom", key: user.id }, 
					React.createElement(ListButton, { 
						loggedInStatus: this.props.loggedInStatus,
						status: user.status,
						withName: user.username,
						loggedInAs: this.props.loggedInAs,
						onStartChat: this.props.onStartChat 
					}, null),
					React.createElement("div", { className: "col-7 position-relative" }, 
						React.createElement(StatusIndicator, { status: user.status }, null),
						React.createElement("span", { className: "fs-5 ms-4" }, user.username)
					)
				);
				usersList.push(user);
			});
			return React.createElement("div", { className: "border-top" }, 
				usersList
			);
		}
	}
}

class Notification extends React.Component {
	constructor(props) {
		super(props);
		this.interval = null;
		this.toggle = false;
	}
	
	componentDidMount() {
		this.interval = setInterval(function() {
			this.toggle = !this.toggle;
			if (this.toggle && this.props.notifications.length === 1) {
				document.title = "(" + this.props.notifications.length + ") New Chat Invitation - Chat Application";
			} else if (this.toggle && this.props.notifications.length > 1) {
				document.title = "(" + this.props.notifications.length + ") New Chat Invitations - Chat Application";
			} else {
				document.title = "Home - Chat Application";
			}
		}.bind(this), ACTION_DELAY);
	}
	
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	
	componentDidUpdate() {
		this.toastElements = [].slice.call(document.querySelectorAll(".toast"));
		this.toastList = this.toastElements.map(function (element) {
			return new bootstrap.Toast(element, { animation: false, autohide: false }).show();
		});
	}
	
	handleClick(event, username, chatWith) {
		this.props.onAcceptChat(username, chatWith);
	}
	
	handleClose(event, username, chatWith) {
		this.props.onCloseNotification(username, chatWith);
	}
	
	render() {
		var notificationsList = [];
		this.props.notifications.map((notification) => {
			if (notification) {
				var toast = React.createElement("div", { 
					className: "toast", 
					key: notification.chatWith
				}, 
					React.createElement("div", { className: "toast-header" }, 
						React.createElement("strong", { className: "me-auto" }, "Chat Invitation"),
						React.createElement("button", { 
							className: "btn-close", 
							"data-bs-dismiss": "toast",
							onClick: (e) => { this.handleClose(e, notification.username, notification.chatWith) } 
						}, null)
					),
					React.createElement("div", { className: "toast-body" }, 
						React.createElement("p", { className: "mb-2" }, notification.username + " wants to chat."),
						React.createElement("a", { 
							className: "btn btn-secondary btn-sm", 
							href: "/chat?user1=" + notification.chatWith + "&user2=" + notification.username,
							target: "_blank",
							rel: "noopener noreferrer",
							onClick: (e) => { this.handleClick(e, notification.username, notification.chatWith) }
						}, "Accept Chat")
					)
				);
				notificationsList.push(toast);
			}
		});
		return React.createElement("div", { className: "fixed-bottom" }, 
			React.createElement("div", { 
				className: "toast-container float-end m-2", 
			}, 
				notificationsList
			)
		);
	}
}

class UsersContainer extends React.Component {
	constructor(props) {
		super(props);
		this.stompClient = null;
		this.loggedInAs = DOM_CONTAINER.getAttribute('data-loggedInAs');
		this.handleAction = this.handleAction.bind(this);
		this.debounceChange = this.debounceChange.bind(this);
		this.handleTimeoutInterval = this.handleTimeoutInterval.bind(this);
		this.handleStartChat = this.handleStartChat.bind(this);
		this.handleAcceptChat = this.handleAcceptChat.bind(this);
		this.handleCloseNotification = this.handleCloseNotification.bind(this);
		this.removeNotification = this.removeNotification.bind(this);
		this.setStatus = this.setStatus.bind(this);
		this.state = {
			users: null,
			loading: true,
			update: null,
			status: null,
			timer: setTimeout(this.handleTimeoutInterval, STATUS_TIMEOUT),
			notifications: []
		};
	}
	
	handleStartChat(username, chatWith) {
		this.setStatus(this.loggedInAs, "BUSY");
		this.stompClient.send("/send/notification", {}, JSON.stringify({
			username: username,
			chatWith: chatWith,
			notifiedOn: new Date(),
			acknowledged: false
		}));
		this.removeNotification(chatWith, username);
	}
	
	handleAcceptChat(username, chatWith) {
		this.setStatus(this.loggedInAs, "BUSY");
		this.stompClient.send("/send/notification", {}, JSON.stringify({
			username: username,
			chatWith: chatWith,
			notifiedOn: new Date(),
			acknowledged: true
		}));
	}
	
	handleCloseNotification(username, chatWith) {
		this.removeNotification(username, chatWith);
	}
	
	removeNotification(username, chatWith) {
		var filteredNotifications = this.state.notifications.filter((notification) => { 
			return !(notification.username === username && notification.chatWith === chatWith);
		});
		this.setState({
			notifications: filteredNotifications
		});
	}
	
	debounceChange(event) {
		return function() {
			clearTimeout(this.state.update);
			this.setState({
				update: setTimeout(function() {
					this.setState({ update: null });
					this.handleAction.apply(this, [event]);
				}.bind(this), ACTION_DELAY)
			});
		}.bind(this);
	}
	
	componentDidMount() {
		this.setState({
			loading: true
		});
		this.socket = new SockJS("/websocket");
		this.stompClient = Stomp.over(this.socket);
		this.stompClient.connect({}, function(frame) {
			this.stompClient.subscribe("/receive/done", function(message) {
				var content = JSON.parse(message.body);
				resetStatus(content.user1, content.user2)
					.then(function(statuses) {
						this.setStatus(statuses.user1, statuses.user1Status);
						this.setStatus(statuses.user2, statuses.user2Status);
						this.removeNotification(content.user1, content.user2);
					}.bind(this))
					.catch(function() {
						this.removeNotification(content.user1, content.user2);
					}.bind(this));
			}.bind(this));
			this.stompClient.subscribe("/receive/notification", function(message) {
				var content = JSON.parse(message.body);
				if (this.loggedInAs === content.chatWith && !content.acknowledged) {
					var notifications = this.state.notifications;
					notifications.push({
						username: content.username,
						chatWith: content.chatWith,
						notifiedOn: content.notifiedOn
					});
					this.setState({
						notifications: notifications
					});
				} else if (content.acknowledged) {
					this.removeNotification(content.username, content.chatWith);
				}
			}.bind(this));
		}.bind(this));
		window.addEventListener("keydown", (e) => this.debounceChange(e)());
		window.addEventListener("mousemove", (e) => this.debounceChange(e)());
		window.addEventListener("scroll", (e) => this.debounceChange(e)());
		window.addEventListener("mousedown", (e) => this.debounceChange(e)());
		getUser(this.loggedInAs)
			.then(function(user) {
				if (user) {
					this.setState({
						status: user.status
					});
				}
				return getAllUsers();
			}.bind(this))
			.then(function(users) {
				clearTimeout(this.state.timer);
				this.setState({
					users: users,
					loading: false,
					timer: setTimeout(this.handleTimeoutInterval, STATUS_TIMEOUT)
				});
			}.bind(this))
			.catch(function(err) {
				clearTimeout(this.state.timer);
				this.setState({
					status: "AVAILABLE",
					users: null,
					loading: false,
					timer: setTimeout(this.handleTimeoutInterval, STATUS_TIMEOUT)
				});
			}.bind(this));
	}
	
	componentWillUnmount() {
		clearTimeout(this.state.update);
		clearTimeout(this.state.timer);
		window.removeEventListener("keydown", (e) => this.debounceChange(e)());
		window.removeEventListener("mousemove", (e) => this.debounceChange(e)());
		window.removeEventListener("scroll", (e) => this.debounceChange(e)());
		window.removeEventListener("mousedown", (e) => this.debounceChange(e)());
		if (this.stompClient) {
			this.stompClient.disconnect();
		}
	}
	
	setStatus(username, status) {
		setUserStatus(username, status)
			.then(function(success) {
				if (username === this.loggedInAs) {
					this.setState({
						status: status
					});
				}
				return getAllUsers();
			}.bind(this))
			.then(function(users) {
				clearTimeout(this.state.timer);
				this.setState({
					users: users,
					loading: false,
					timer: setTimeout(this.handleTimeoutInterval, STATUS_TIMEOUT)
				});
			}.bind(this))
			.catch(function(err) {
				clearTimeout(this.state.timer);
				this.setState({
					users: null,
					loading: false,
					timer: setTimeout(this.handleTimeoutInterval, STATUS_TIMEOUT)
				});
			}.bind(this));
	}
	
	handleAction() {
		if (this.state.status === "BUSY") {
			this.setStatus(this.loggedInAs, "BUSY");
		} else {
			this.setStatus(this.loggedInAs, "AVAILABLE");
		}
	}
	
	handleTimeoutInterval() {
		if (this.state.status === "BUSY") {
			this.setStatus(this.loggedInAs, "BUSY");
		} else {
			this.setStatus(this.loggedInAs, "AWAY");
		}
	}
	
	render() {
		return React.createElement("div", {}, 
			React.createElement(Notification, { 
				notifications: this.state.notifications,
				onAcceptChat: this.handleAcceptChat, 
				onCloseNotification: this.handleCloseNotification
			}, null),
			React.createElement(UsersList, { 
				users: this.state.users, 
				loading: this.state.loading,
				onStartChat: this.handleStartChat,
				loggedInAs: this.loggedInAs,
				loggedInStatus: this.state.status
			}, null),
		);
	}
}

ReactDOM.render(
	React.createElement(UsersContainer, {}, null), 
	DOM_CONTAINER
);