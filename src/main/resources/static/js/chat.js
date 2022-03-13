const DOM_CONTAINER = document.getElementById("chatContainer");
const STATUS_TIMEOUT = 10000;
const ACTION_DELAY = 1000;

class ChatConversation extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		if (!this.props.conversation || this.props.conversation.length === 0) {
			return React.createElement("p", { className: "text-center mb-4" }, "No posts to show.");
		} else {
			var replyChain = [];
			this.props.conversation.forEach(function(replyContent) {
				if (replyContent.cpu) {
					var reply = React.createElement("p", { className: "text-center mb-4" }, replyContent.message);
					replyChain.push(reply);
				} else {
					const DATE_TIME_FORMAT_OPTIONS = { month: "2-digit", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"};
					var dateTime = new Date(replyContent.postedOn);
					var align = "me-5";
					if (replyContent.username !== this.props.loggedInAs) {
						align = "ms-5";
					}
					var reply = React.createElement("div", { className: "card mb-4 " + align }, 
						React.createElement("div", { className: "card-body" }, 
							React.createElement("p", { className: "comment-text mb-0" }, replyContent.message)
						),
						React.createElement("div", { className: "card-footer" }, 
							React.createElement("small", {}, 'Comment by ' + replyContent.username + ' @ ' + dateTime.toLocaleDateString("en-US", DATE_TIME_FORMAT_OPTIONS))
						)
					);
					replyChain.push(reply);
				}
			}.bind(this));
			return React.createElement("div", {}, replyChain);
		}
	}
}

class ChatStatus extends React.Component {
	constructor(props) {
		super(props);
		this.statusText = null;
	}
	
	render() {
		if (!this.props.active) {
			return React.createElement("small", { 
				className: "text-muted mx-4 mx-sm-0 my-sm-2 mx-md-4 d-sm-block d-md-inline", 
			}, "The conversation has ended.");
		}
		switch (this.props.chatWithStatus) {
			case "TYPING":
				this.statusText = this.props.chatWith + " is typing...";
				break;
			case "AWAY":
				this.statusText = this.props.chatWith + " is away.";
				break;
			case "AVAILABLE":
				this.statusText = this.props.chatWith + " is available.";
				break;
			case "DISCONNECTED":
			default:
				this.statusText = this.props.chatWith + " is disconnected.";
		}
		return React.createElement("small", { 
			className: "text-muted mx-4 mx-sm-0 my-sm-2 mx-md-4 d-sm-block d-md-inline", 
		}, this.statusText);
	}
}

class ChatForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: ""
		};
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSend = this.handleSend.bind(this);
		this.handleEnd = this.handleEnd.bind(this);
	}
	
	handleKeyPress(event) {
		if (event.key === "Enter") {
			if (this.state.message.trim()) {
				this.props.onSendButtonClick(this.state.message);
				this.setState({
					message: ""
				});
			}
		}
	}
	
	handleChange(event) {
		if (event.target.value === "\n" ||
			event.target.value === "\r" ||
			event.target.value === "\r\n") {
			this.setState({
				message: ""
			});
		} else {
			this.setState({
				message: event.target.value
			});
		}
	}
	
	handleSend(event) {
		event.preventDefault();
		if (this.state.message.trim()) {
			this.props.onSendButtonClick(this.state.message);
			this.setState({
				message: ""
			});
		}
	}
	
	handleEnd(event) {
		event.preventDefault();
		this.props.onEndButtonClick();
	}
	
	render() {
		return React.createElement("form", { className: "mb-0" }, 
				React.createElement("div", { className: "mb-4" },
					React.createElement("textarea", { 
						className: "form-control", 
						rows: "3", 
						value: this.state.message,
						onKeyDown: (e) => this.handleKeyPress(e),
						onChange: (e) => this.handleChange(e),
						onFocus: () => this.props.onFocus(),
						onBlur: () => this.props.onBlur()
					}, null)
				),
				React.createElement("div", { className: "mb-0" },
					React.createElement("button", { 
						className: "btn btn-danger float-end", 
						onClick: (e) => this.handleEnd(e)
					}, "End"),
					React.createElement("button", { 
						className: "btn btn-secondary", 
						onClick: (e) => this.handleSend(e)
					}, "Send"),
					React.createElement(ChatStatus, { 
						chatWith: this.props.chatWith,
						chatWithStatus: this.props.chatWithStatus,
						active: this.props.active
					}, null)
				)
		);
	}
}


class ChatContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			conversation: [],
			active: true,
			chatWithStatus: "DISCONNECTED",
			update: null,
			focused: false,
			timer: setTimeout(this.handleTimeoutInterval, STATUS_TIMEOUT),
		};
		this.socket = null;
		this.stompClient = null;
		this.loggedInAs = DOM_CONTAINER.getAttribute('data-loggedInAs');
		this.chatRoom = DOM_CONTAINER.getAttribute('data-chatRoomId');
		this.chatWith = DOM_CONTAINER.getAttribute('data-with');
		this.interval = null;
		this.toggle = false;
		this.messagesReceived = [];
		this.readMessages = [];
		this.handleSendButtonClick = this.handleSendButtonClick.bind(this);
		this.handleEndButtonClick = this.handleEndButtonClick.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleAction = this.handleAction.bind(this);
		this.handleTimeoutInterval = this.handleTimeoutInterval.bind(this);
		this.debounceChange = this.debounceChange.bind(this);
	}
	
	componentDidMount() {
		this.socket = new SockJS("/websocket");
		this.stompClient = Stomp.over(this.socket);
		this.stompClient.connect({}, function(frame) {
			this.stompClient.subscribe("/receive/" + this.chatRoom + "/message", function(message) {
				var content = JSON.parse(message.body);
				if (content[content.length - 1].cpu && content[content.length - 1].message === "The conversation has ended.") {
					this.stompClient.send("/send/done", {}, JSON.stringify({
						chatRoomId: this.chatRoom,
						user1: this.loggedInAs,
						user2: this.chatWith
					}));
					if (this.stompClient) {
						this.stompClient.disconnect();
					}
					this.setState({
						active: false,
						conversation: content
					});
				} else {
					this.setState({
						conversation: content
					});
				}
				this.messagesReceived = content.filter(function(message) {
					return message.username === this.chatWith;
				}.bind(this));
			}.bind(this));
			this.stompClient.subscribe("/receive/" + this.chatRoom + "/status", function(message) {
				var content = JSON.parse(message.body);
				if (this.chatWith === content.username) {
					this.setState({
						chatWithStatus: content.status
					});
				}
			}.bind(this));
			this.stompClient.send("/send/" + this.chatRoom + "status", {}, JSON.stringify({
				username: this.loggedInAs,
				status: "AVAILABLE"
			}));
		}.bind(this));
		window.addEventListener("beforeunload", function(e) {
			this.handleEndButtonClick(null);
		}.bind(this));
		window.addEventListener("keydown", (e) => this.debounceChange(e)());
		window.addEventListener("mousemove", (e) => this.debounceChange(e)());
		window.addEventListener("scroll", (e) => this.debounceChange(e)());
		window.addEventListener("mousedown", (e) => this.debounceChange(e)());
		this.interval = setInterval(function() {
			this.toggle = !this.toggle;
			if (!this.state.active) {
				document.title = "Chat with " + this.chatWith + " Ended - Chat Application";
			} else if (this.toggle && (this.messagesReceived.length - this.readMessages.length) === 1) {
				document.title = "(" + (this.messagesReceived.length - this.readMessages.length) + ") New Message - Chat Application";
			} else if (this.toggle && (this.messagesReceived.length - this.readMessages.length) > 1) {
				document.title = "(" + (this.messagesReceived.length - this.readMessages.length) + ") New Messages - Chat Application";
			} else {
				document.title = "Chat with " + this.chatWith + " - Chat Application";
			}
		}.bind(this), ACTION_DELAY);
	}
	
	componentWillUnmount() {
		clearInterval(this.interval);
		clearTimeout(this.state.update);
		clearTimeout(this.state.timer);
		if (this.stompClient) {
			this.stompClient.disconnect();
		}
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
	
	handleAction() {
		if (!this.state.active) {
			return false;
		}
		var status = (this.state.focused) ? "TYPING" : "AVAILABLE";
		clearTimeout(this.state.timer);
		this.stompClient.send("/send/" + this.chatRoom + "/status", {}, JSON.stringify({
			username: this.loggedInAs,
			status: status
		}));
		this.readMessages = this.state.conversation.filter(function(message) {
			return message.username === this.chatWith;
		}.bind(this));
		this.setState({
			timer: setTimeout(this.handleTimeoutInterval, STATUS_TIMEOUT)
		});
	}
	
	handleTimeoutInterval() {
		if (!this.state.active) {
			return false;
		}
		var status = (this.state.focused) ? "TYPING" : "AWAY";
		clearTimeout(this.state.timer);
		this.stompClient.send("/send/" + this.chatRoom + "/status", {}, JSON.stringify({
			username: this.loggedInAs,
			status: status
		}));
		this.setState({
			timer: setTimeout(this.handleTimeoutInterval, STATUS_TIMEOUT)
		});
	}
	
	handleSendButtonClick(message) {
		if (!this.state.active) {
			return false;
		}
		var content = {
			chatRoom: this.chatRoom,
			username: this.loggedInAs,
			chatWith: this.chatWith,
			postedOn: new Date(),
			message: message,
			cpu: false
		};
		var conversationChain = this.state.conversation;
		conversationChain.push(content);
		this.setState({
			conversation: conversationChain
		});
		this.stompClient.send("/send/" + this.chatRoom + "/message", {}, JSON.stringify(content));
	}
	
	handleEndButtonClick(message) {
		if (!this.state.active) {
			return false;
		}
		var content = {
			chatRoom: this.chatRoom,
			username: "CPU",
			chatWith: this.chatWith,
			postedOn: new Date(),
			message: "The conversation has ended.",
			cpu: true
		};
		var conversationChain = this.state.conversation;
		conversationChain.push(content);
		this.setState({
			conversation: conversationChain,
			active: false
		});
		this.stompClient.send("/send/" + this.chatRoom + "/message", {}, JSON.stringify(content));
		this.stompClient.send("/send/done", {}, JSON.stringify({
			chatRoomId: this.chatRoom,
			user1: this.loggedInAs,
			user2: this.chatWith
		}));
		if (this.stompClient) {
			this.stompClient.disconnect();
		}
	}
	
	handleFocus() {
		if (!this.state.active) {
			return false;
		}
		this.setState({
			focused: true
		});
		this.stompClient.send("/send/" + this.chatRoom + "/status", {}, JSON.stringify({
			username: this.loggedInAs,
			status: "TYPING"
		}));
	}
	
	handleBlur() {
		if (!this.state.active) {
			return false;
		}
		this.setState({
			focused: false
		});
		this.stompClient.send("/send/" + this.chatRoom + "/status", {}, JSON.stringify({
			username: this.loggedInAs,
			status: "AVAILABLE"
		}));
	}
	
	render() {
		return React.createElement("div", { className: "mb-0" }, 
			React.createElement(ChatConversation, { 
				conversation: this.state.conversation,
				loggedInAs: this.loggedInAs
			}, null),
			React.createElement(ChatForm, {
				onSendButtonClick: this.handleSendButtonClick,
				onEndButtonClick: this.handleEndButtonClick,
				onFocus: this.handleFocus,
				onBlur: this.handleBlur,
				chatWith: this.chatWith,
				chatWithStatus: this.state.chatWithStatus,
				active: this.state.active
			}, null)
		);
	}
}

ReactDOM.render(
	React.createElement(ChatContainer, {}, null), 
	DOM_CONTAINER
);