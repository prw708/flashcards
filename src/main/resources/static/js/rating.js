var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DOM_CONTAINER = document.querySelectorAll("div.rating");

var Stars = function (_React$Component) {
	_inherits(Stars, _React$Component);

	function Stars(props) {
		_classCallCheck(this, Stars);

		var _this = _possibleConstructorReturn(this, (Stars.__proto__ || Object.getPrototypeOf(Stars)).call(this, props));

		_this.handleMouseOver = _this.handleMouseOver.bind(_this);
		_this.handleMouseLeave = _this.handleMouseLeave.bind(_this);
		_this.handleClick = _this.handleClick.bind(_this);
		_this.state = {
			highlight: -1
		};
		return _this;
	}

	_createClass(Stars, [{
		key: "handleMouseOver",
		value: function handleMouseOver(event, index) {
			this.setState({
				highlight: index
			});
		}
	}, {
		key: "handleMouseLeave",
		value: function handleMouseLeave() {
			this.setState({
				highlight: -1
			});
		}
	}, {
		key: "handleClick",
		value: function handleClick(index) {
			this.props.onClick(index + 1);
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			var wholeNumberRating = Math.floor(this.props.rating);
			var decimalPortion = this.props.rating - wholeNumberRating;
			var numberOfStars = [];
			for (var i = 1; i <= 5; i++) {
				if (i <= wholeNumberRating) {
					numberOfStars.push(1);
				} else if (i - 1 === wholeNumberRating) {
					numberOfStars.push(0.5);
				} else {
					numberOfStars.push(0);
				}
			}
			var stars = numberOfStars.map(function (starNumber, index) {
				if (starNumber === 1) {
					return React.createElement("div", {
						key: index,
						className: _this2.state.highlight === -1 ? "star-fill-icon" : index <= _this2.state.highlight ? "star-fill-icon" : "star-icon",
						onMouseOver: _this2.handleMouseOver.bind(_this2, event, index),
						onMouseLeave: _this2.handleMouseLeave,
						onClick: _this2.handleClick.bind(_this2, index)
					});
				} else {
					if (starNumber === 0.5 && decimalPortion >= 0.5) {
						return React.createElement("div", {
							key: index,
							className: _this2.state.highlight === -1 ? "star-half-icon" : index <= _this2.state.highlight ? "star-fill-icon" : "star-icon",
							onMouseOver: _this2.handleMouseOver.bind(_this2, event, index),
							onMouseLeave: _this2.handleMouseLeave,
							onClick: _this2.handleClick.bind(_this2, index)
						});
					} else {
						return React.createElement("div", {
							key: index,
							className: index <= _this2.state.highlight ? "star-fill-icon" : "star-icon",
							onMouseOver: _this2.handleMouseOver.bind(_this2, event, index),
							onMouseLeave: _this2.handleMouseLeave,
							onClick: _this2.handleClick.bind(_this2, index)
						});
					}
				}
			});
			if (this.props.loading || this.props.saving) {
				return React.createElement(
					"div",
					{ className: "mb-2" },
					React.createElement(
						"div",
						{ className: "spinner-border" },
						React.createElement(
							"span",
							{ className: "visually-hidden" },
							"Loading..."
						)
					)
				);
			} else {
				return React.createElement(
					"div",
					null,
					stars,
					React.createElement(
						"small",
						{ className: "py-0 my-0 lh-1 ms-2" },
						this.props.ratingsCompleted === 1 ? "1 rating" : this.props.ratingsCompleted + " ratings"
					),
					React.createElement(
						"div",
						null,
						React.createElement(
							"small",
							{ className: "py-0 my-0 lh-1" },
							this.props.status
						)
					)
				);
			}
		}
	}]);

	return Stars;
}(React.Component);

var RatingContainer = function (_React$Component2) {
	_inherits(RatingContainer, _React$Component2);

	function RatingContainer(props) {
		_classCallCheck(this, RatingContainer);

		var _this3 = _possibleConstructorReturn(this, (RatingContainer.__proto__ || Object.getPrototypeOf(RatingContainer)).call(this, props));

		_this3.handleClick = _this3.handleClick.bind(_this3);
		_this3.pileId = _this3.props.container.getAttribute("data-pileId");
		_this3.loggedInAs = _this3.props.container.getAttribute("data-loggedInAs");
		_this3.state = {
			rating: 0,
			ratingsCompleted: 0,
			loading: true,
			saving: false,
			status: null
		};
		return _this3;
	}

	_createClass(RatingContainer, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			var data = {
				rating: this.state.rating,
				pileId: this.pileId,
				rater: this.loggedInAs
			};
			load("/load/rating", data).then(function (json) {
				if (json && json.rating && json.ratingsCompleted) {
					this.setState({
						rating: json.rating,
						ratingsCompleted: json.ratingsCompleted
					});
				}
				this.setState({
					loading: false
				});
			}.bind(this)).catch(function (error) {
				this.setState({
					loading: false
				});
			}.bind(this));
		}
	}, {
		key: "handleClick",
		value: function handleClick(rating) {
			this.setState({
				saving: true
			});
			var data = {
				rating: rating,
				pileId: this.pileId,
				rater: this.loggedInAs
			};
			save("/rate", data).then(function (json) {
				if (json && json.status && json.rating && json.ratingsCompleted) {
					this.setState({
						status: json.status,
						rating: parseFloat(json.rating),
						ratingsCompleted: parseInt(json.ratingsCompleted, 10),
						saving: false
					});
				} else if (json && json.status) {
					this.setState({
						status: json.status,
						saving: false
					});
				}
				setTimeout(function () {
					this.setState({
						status: null
					});
				}.bind(this), 3000);
			}.bind(this)).catch(function (error) {
				this.setState({
					status: "Error!",
					saving: false
				});
				setTimeout(function () {
					this.setState({
						status: null
					});
				}.bind(this), 3000);
			}.bind(this));
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ className: "ms-auto" },
				React.createElement(Stars, {
					rating: this.state.rating,
					ratingsCompleted: this.state.ratingsCompleted,
					onClick: this.handleClick,
					status: this.state.status,
					loading: this.state.loading,
					saving: this.state.saving
				})
			);
		}
	}]);

	return RatingContainer;
}(React.Component);

if (DOM_CONTAINER) {
	DOM_CONTAINER.forEach(function (element) {
		ReactDOM.render(React.createElement(RatingContainer, {
			container: element
		}), element);
	});
}