var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DOM_CONTAINER = document.getElementById("container");

var SaveButton = function (_React$Component) {
	_inherits(SaveButton, _React$Component);

	function SaveButton(props) {
		_classCallCheck(this, SaveButton);

		return _possibleConstructorReturn(this, (SaveButton.__proto__ || Object.getPrototypeOf(SaveButton)).call(this, props));
	}

	_createClass(SaveButton, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ className: "float-end ms-4 text-end" },
				React.createElement(
					"button",
					{
						className: "btn btn-secondary mb-2",
						onClick: this.props.onSave,
						disabled: this.props.saving || this.props.viewOnly ? true : false
					},
					this.props.saving ? React.createElement(
						"span",
						{ className: "spinner-border spinner-border-sm" },
						React.createElement(
							"span",
							{ className: "visually-hidden" },
							"Saving..."
						)
					) : "Save"
				),
				React.createElement(
					"div",
					null,
					React.createElement(
						"small",
						null,
						this.props.success === null ? "" : this.props.success
					)
				)
			);
		}
	}]);

	return SaveButton;
}(React.Component);

var Pagination = function (_React$Component2) {
	_inherits(Pagination, _React$Component2);

	function Pagination(props) {
		_classCallCheck(this, Pagination);

		var _this2 = _possibleConstructorReturn(this, (Pagination.__proto__ || Object.getPrototypeOf(Pagination)).call(this, props));

		_this2.validIndex = true;
		_this2.handleIndexChange = _this2.handleIndexChange.bind(_this2);
		return _this2;
	}

	_createClass(Pagination, [{
		key: "handleIndexChange",
		value: function handleIndexChange(event) {
			if (/^[0-9]{1,4}$/.test(event.target.value)) {
				if (parseInt(event.target.value, 10) >= 1 && parseInt(event.target.value, 10) <= this.props.max) {
					this.validIndex = true;
					this.props.onIndexChange(this.validIndex, parseInt(event.target.value, 10));
					return;
				} else {
					this.validIndex = false;
				}
			} else {
				this.validIndex = false;
			}
			this.props.onIndexChange(this.validIndex, event.target.value);
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ className: "d-flex align-items-center mb-4" },
				React.createElement(
					"button",
					{
						className: "btn btn-secondary me-2",
						disabled: this.props.index <= 0 ? true : false,
						onClick: this.props.onPrevious
					},
					"<"
				),
				React.createElement(
					"div",
					{ className: "col-2 me-2" },
					React.createElement("input", {
						type: "text",
						className: this.validIndex ? "form-control" : "form-control is-invalid",
						name: "fcIndex",
						id: "fcIndex",
						autoComplete: "off",
						maxLength: "4",
						value: this.props.max === 0 ? "0" : this.props.typedIndex,
						onChange: this.handleIndexChange
					})
				),
				React.createElement(
					"button",
					{
						className: "btn btn-secondary me-2",
						disabled: this.props.index >= this.props.max - 1 ? true : false,
						onClick: this.props.onNext
					},
					">"
				),
				React.createElement(
					"small",
					{ className: "ms-auto" },
					this.props.max === 0 ? 0 : this.props.index + 1,
					" out of ",
					this.props.max
				)
			);
		}
	}]);

	return Pagination;
}(React.Component);

var TitleBar = function (_React$Component3) {
	_inherits(TitleBar, _React$Component3);

	function TitleBar(props) {
		_classCallCheck(this, TitleBar);

		var _this3 = _possibleConstructorReturn(this, (TitleBar.__proto__ || Object.getPrototypeOf(TitleBar)).call(this, props));

		_this3.handleTitleChange = _this3.handleTitleChange.bind(_this3);
		_this3.handlePublicChange = _this3.handlePublicChange.bind(_this3);
		return _this3;
	}

	_createClass(TitleBar, [{
		key: "handleTitleChange",
		value: function handleTitleChange(event) {
			this.props.onTitleChange(event.target.value);
		}
	}, {
		key: "handlePublicChange",
		value: function handlePublicChange(event) {
			this.props.onPublicChange(event.target.checked);
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ className: "mb-4" },
				!this.props.viewOnly && React.createElement(SaveButton, {
					success: this.props.success,
					saving: this.props.saving,
					onSave: this.props.onSave,
					viewOnly: this.props.viewOnly
				}),
				this.props.viewOnly && React.createElement(
					"div",
					{ className: "d-flex align-items-center" },
					React.createElement(
						"span",
						{ className: "fs-2" },
						this.props.title
					),
					React.createElement(RatingContainer, { container: DOM_CONTAINER })
				),
				!this.props.viewOnly && React.createElement(
					"div",
					{ className: this.props.viewOnly ? "row g-0" : "row g-0 mb-4" },
					React.createElement(
						"label",
						{ className: "col-4 col-sm-3 col-md-2 col-form-label", htmlFor: "fcTitle" },
						"Title"
					),
					React.createElement(
						"div",
						{ className: "col-8 col-sm-9 col-md-10" },
						React.createElement("input", {
							type: "text",
							className: this.props.validTitle ? "form-control" : "form-control is-invalid",
							name: "fcTitle",
							id: "fcTitle",
							autoComplete: "off",
							maxLength: "100",
							value: this.props.title ? this.props.title : "",
							onChange: this.handleTitleChange,
							disabled: this.props.viewOnly
						}),
						!this.props.validTitle && React.createElement(
							"div",
							{ className: "invalid-feedback" },
							"1 to 100 characters allowed. A-Z, a-z, 0-9, spaces, _, ,, !, ., ?, and - allowed."
						)
					)
				),
				!this.props.viewOnly && React.createElement(
					"div",
					{ className: "row g-0 mb-0" },
					React.createElement(
						"div",
						{ className: "form-check" },
						React.createElement("input", {
							type: "checkbox",
							className: this.props.validPublic ? "form-check-input" : "form-check-input is-invalid",
							id: "fcPublic",
							name: "fcPublic",
							checked: this.props.public ? true : false,
							onChange: this.handlePublicChange,
							disabled: this.props.viewOnly
						}),
						React.createElement(
							"label",
							{ className: "form-check-label", htmlFor: "fcPublic" },
							"Make Public"
						),
						!this.props.validPublic && React.createElement(
							"div",
							{ className: "invalid-feedback" },
							"Must be either true or false."
						)
					)
				)
			);
		}
	}]);

	return TitleBar;
}(React.Component);

var Card = function (_React$Component4) {
	_inherits(Card, _React$Component4);

	function Card(props) {
		_classCallCheck(this, Card);

		var _this4 = _possibleConstructorReturn(this, (Card.__proto__ || Object.getPrototypeOf(Card)).call(this, props));

		_this4.handleFlipClick = _this4.handleFlipClick.bind(_this4);
		_this4.handleNewClick = _this4.handleNewClick.bind(_this4);
		_this4.handleDeleteClick = _this4.handleDeleteClick.bind(_this4);
		_this4.handleTextChange = _this4.handleTextChange.bind(_this4);
		_this4.handleKeyDown = _this4.handleKeyDown.bind(_this4);
		_this4.textInput = React.createRef();
		_this4.card = React.createRef();
		return _this4;
	}

	_createClass(Card, [{
		key: "componentDidUpdate",
		value: function componentDidUpdate(prevProps) {
			if (this.props.loading !== prevProps.loading) {
				this.card.current.focus();
			}
			this.textInput.current.style.height = "auto";
			this.textInput.current.style.height = this.textInput.current.scrollHeight + "px";
		}
	}, {
		key: "handleFlipClick",
		value: function handleFlipClick(event) {
			event.preventDefault();
			this.props.onFlip();
		}
	}, {
		key: "handleNewClick",
		value: function handleNewClick(event) {
			event.preventDefault();
			this.props.onNew();
			this.textInput.current.focus();
		}
	}, {
		key: "handleDeleteClick",
		value: function handleDeleteClick(event) {
			event.preventDefault();
			this.props.onDelete();
		}
	}, {
		key: "handleTextChange",
		value: function handleTextChange(event) {
			this.textInput.current.style.height = "auto";
			this.textInput.current.style.height = this.textInput.current.scrollHeight + "px";
			this.props.onTextChange(event.target.value);
		}
	}, {
		key: "handleKeyDown",
		value: function handleKeyDown(event) {
			switch (event.code) {
				case "Space":
					if (document.activeElement !== this.textInput.current) {
						event.preventDefault();
						this.props.onFlip();
					}
					break;
				case "ArrowRight":
					if (document.activeElement !== this.textInput.current) {
						this.props.onNext();
					}
					break;
				case "ArrowLeft":
					if (document.activeElement !== this.textInput.current) {
						this.props.onPrevious();
					}
					break;
			}
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				React.Fragment,
				null,
				this.props.loading && React.createElement(
					"div",
					{ className: "text-center mb-4" },
					React.createElement(
						"div",
						{ className: "spinner-border" },
						React.createElement(
							"span",
							{ className: "visually-hidden" },
							"Loading..."
						)
					)
				),
				!this.props.loading && this.props.cards.length === 0 && React.createElement(
					"div",
					{ className: "text-center my-5" },
					React.createElement(
						"p",
						{ className: "mb-2" },
						"No flash cards to show."
					),
					!this.props.viewOnly && React.createElement(
						"a",
						{ href: "#", className: "link-dark", onClick: this.handleNewClick },
						"Create New Card"
					)
				),
				React.createElement(
					"div",
					{
						className: !this.props.loading && this.props.cards.length > 0 ? "card" : "card d-none",
						tabIndex: "0",
						onKeyDown: this.handleKeyDown,
						ref: this.card
					},
					React.createElement(
						"div",
						{ className: "card-header d-flex align-items-center" },
						React.createElement(
							"a",
							{
								className: "btn btn-link btn-sm link-dark me-auto text-decoration-none",
								onClick: this.handleFlipClick
							},
							React.createElement(
								"strong",
								null,
								"Flip Card"
							)
						),
						!this.props.viewOnly && React.createElement(
							"a",
							{
								className: "btn btn-link btn-sm link-dark text-decoration-none ms-2",
								onClick: this.handleNewClick
							},
							"New"
						),
						!this.props.viewOnly && React.createElement(
							"a",
							{
								className: "btn btn-link btn-sm link-dark text-decoration-none ms-2",
								onClick: this.handleDeleteClick
							},
							"Delete"
						)
					),
					React.createElement(
						"div",
						{ className: "card-body" },
						React.createElement(
							"form",
							null,
							React.createElement("textarea", {
								className: this.props.validCards.length > 0 && this.props.validCards[this.props.index] === false ? "form-control is-invalid fs-2 border-0 text-center py-5 bg-white" : "form-control fs-2 border-0 text-center py-5 bg-white",
								value: this.props.cards.length > 0 ? this.props.front ? this.props.cards[this.props.index].front : this.props.cards[this.props.index].back : "",
								onChange: this.handleTextChange,
								ref: this.textInput,
								readOnly: this.props.viewOnly ? true : false,
								style: { resize: "none" }
							})
						)
					)
				)
			);
		}
	}]);

	return Card;
}(React.Component);

var CardsContainer = function (_React$Component5) {
	_inherits(CardsContainer, _React$Component5);

	function CardsContainer(props) {
		_classCallCheck(this, CardsContainer);

		var _this5 = _possibleConstructorReturn(this, (CardsContainer.__proto__ || Object.getPrototypeOf(CardsContainer)).call(this, props));

		_this5.state = {
			index: 0,
			cards: [],
			title: "",
			public: false,
			front: true,
			typedIndex: "1",
			loading: true,
			saving: false,
			success: null
		};
		_this5.handleTitleChange = _this5.handleTitleChange.bind(_this5);
		_this5.handlePublicChange = _this5.handlePublicChange.bind(_this5);
		_this5.handleSave = _this5.handleSave.bind(_this5);
		_this5.handleIndexChange = _this5.handleIndexChange.bind(_this5);
		_this5.handlePrevious = _this5.handlePrevious.bind(_this5);
		_this5.handleNext = _this5.handleNext.bind(_this5);
		_this5.handleFlip = _this5.handleFlip.bind(_this5);
		_this5.handleNew = _this5.handleNew.bind(_this5);
		_this5.handleDelete = _this5.handleDelete.bind(_this5);
		_this5.handleTextChange = _this5.handleTextChange.bind(_this5);
		_this5.validTitle = true;
		_this5.validPublic = true;
		_this5.validCards = [];
		_this5.pileId = DOM_CONTAINER.getAttribute("data-pileId");
		_this5.viewOnly = DOM_CONTAINER.getAttribute("data-viewOnly");
		_this5.pileDoesNotExist = DOM_CONTAINER.getAttribute("data-pileDoesNotExist");
		_this5.notCreator = DOM_CONTAINER.getAttribute("data-notCreator");
		return _this5;
	}

	_createClass(CardsContainer, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			if (this.notCreator || this.pileDoesNotExist || !this.pileId) {
				this.setState({
					cards: [],
					loading: false
				});
				return null;
			}
			var data = {
				pileId: this.pileId
			};
			load("/load", data).then(function (json) {
				if (json && json.cards) {
					for (var i = 0; i < json.cards.length; i++) {
						this.validCards.push(true);
					}
					this.setState({
						title: json.title,
						public: json.makePublic,
						cards: json.cards,
						loading: false
					});
				} else {
					this.setState({
						cards: [],
						loading: false
					});
				}
			}.bind(this)).catch(function (err) {
				this.setState({
					cards: [],
					loading: false
				});
			}.bind(this));
		}
	}, {
		key: "handleIndexChange",
		value: function handleIndexChange(valid, value) {
			if (valid) {
				this.setState({
					index: value - 1,
					front: true
				});
			}
			this.setState({
				typedIndex: value
			});
		}
	}, {
		key: "handleTextChange",
		value: function handleTextChange(value) {
			if (this.state.cards.length > 0) {
				if (value.length < 1000) {
					this.validCards[this.state.index] = true;
				} else {
					this.validCards[this.state.index] = false;
				}
				var updatedCards = this.state.cards;
				if (this.state.front) {
					updatedCards[this.state.index].front = value;
				} else {
					updatedCards[this.state.index].back = value;
				}
				this.setState({
					cards: updatedCards
				});
			}
		}
	}, {
		key: "handleFlip",
		value: function handleFlip() {
			this.setState({
				front: !this.state.front
			});
		}
	}, {
		key: "handleNew",
		value: function handleNew() {
			var newCards = this.state.cards;
			var newElement = {
				id: null,
				pile: null,
				front: "",
				back: ""
			};
			newCards.splice(this.state.index + 1, 0, newElement);
			this.validCards.splice(this.state.index + 1, 0, true);
			var newIndex = 0;
			if (this.state.cards.length > 0) {
				newIndex = this.state.index >= newCards.length - 1 ? newCards.length - 1 : this.state.index + 1;
			}
			this.setState({
				index: newIndex,
				typedIndex: newIndex + 1,
				cards: newCards,
				front: true
			});
		}
	}, {
		key: "handleDelete",
		value: function handleDelete() {
			var current = this.state.cards;
			current.splice(this.state.index, 1);
			this.validCards.splice(this.state.index, 1);
			if (this.state.index >= this.state.cards.length - 1) {
				this.setState({
					index: this.state.cards.length - 1,
					typedIndex: this.state.cards.length
				});
			}
			this.setState({
				cards: current,
				front: true
			});
		}
	}, {
		key: "handleTitleChange",
		value: function handleTitleChange(title) {
			if (/^[A-Za-z0-9 _,!.?-]{1,100}$/.test(title)) {
				this.validTitle = true;
			} else {
				this.validTitle = false;
			}
			this.setState({
				title: title
			});
		}
	}, {
		key: "handlePublicChange",
		value: function handlePublicChange(publicState) {
			if (publicState === true || publicState === false) {
				this.validPublic = true;
			} else {
				this.validPublic = false;
			}
			this.setState({
				public: publicState
			});
		}
	}, {
		key: "handleSave",
		value: function handleSave() {
			this.setState({
				saving: true
			});
			this.handleTitleChange(this.state.title);
			this.handlePublicChange(this.state.public);
			if (!this.validTitle || !this.validPublic || !this.validCards.every(function (val) {
				return val === true;
			})) {
				this.setState({
					success: "Validation errors.",
					saving: false
				});
				setTimeout(function () {
					this.setState({
						success: null
					});
				}.bind(this), 3000);
				return false;
			}
			var data = {
				pileId: this.pileId,
				title: this.state.title,
				makePublic: this.state.public,
				cards: this.state.cards
			};
			save("/create", data).then(function (success) {
				this.pileId = success.pileId;
				this.setState({
					success: success.status,
					saving: false
				});
				setTimeout(function () {
					this.setState({
						success: null
					});
				}.bind(this), 3000);
			}.bind(this)).catch(function (err) {
				this.setState({
					success: "Error!",
					saving: false
				});
				setTimeout(function () {
					this.setState({
						success: null
					});
				}.bind(this), 3000);
			}.bind(this));
		}
	}, {
		key: "handlePrevious",
		value: function handlePrevious() {
			var decrement = this.state.index <= 0 ? 0 : this.state.index - 1;
			this.setState({
				index: decrement,
				typedIndex: decrement + 1,
				front: true
			});
		}
	}, {
		key: "handleNext",
		value: function handleNext() {
			var increment = this.state.index >= this.state.cards.length - 1 ? this.state.cards.length - 1 : this.state.index + 1;
			this.setState({
				index: increment,
				typedIndex: increment + 1,
				front: true
			});
		}
	}, {
		key: "render",
		value: function render() {
			if (this.notCreator || this.pileDoesNotExist) {
				return null;
			}
			return React.createElement(
				React.Fragment,
				null,
				React.createElement(TitleBar, {
					title: this.state.title,
					"public": this.state.public,
					success: this.state.success,
					saving: this.state.saving,
					onSave: this.handleSave,
					onTitleChange: this.handleTitleChange,
					onPublicChange: this.handlePublicChange,
					validTitle: this.validTitle,
					validPublic: this.validPublic,
					viewOnly: this.viewOnly
				}),
				React.createElement(Pagination, {
					index: this.state.index,
					typedIndex: this.state.typedIndex,
					max: this.state.cards.length,
					onIndexChange: this.handleIndexChange,
					onPrevious: this.handlePrevious,
					onNext: this.handleNext
				}),
				React.createElement(Card, {
					loading: this.state.loading,
					index: this.state.index,
					cards: this.state.cards,
					front: this.state.front,
					onFlip: this.handleFlip,
					onNew: this.handleNew,
					onDelete: this.handleDelete,
					onTextChange: this.handleTextChange,
					onPrevious: this.handlePrevious,
					onNext: this.handleNext,
					validCards: this.validCards,
					viewOnly: this.viewOnly
				})
			);
		}
	}]);

	return CardsContainer;
}(React.Component);

ReactDOM.render(React.createElement(CardsContainer, null), DOM_CONTAINER);