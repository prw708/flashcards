const DOM_CONTAINER = document.getElementById("container");

class SaveButton extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return <div className="float-end ms-4 text-end">
			<button 
				className="btn btn-secondary mb-2"
				onClick={this.props.onSave}
				disabled={this.props.saving || this.props.viewOnly ? true : false}
			>
				{this.props.saving ? 
				<span className="spinner-border spinner-border-sm">
				</span> : 
				"Save"}
			</button>
			<div>
				<small>
					{this.props.success === null ? "" : this.props.success}
				</small>
			</div>
		</div>;
	}
}

class Pagination extends React.Component {
	constructor(props) {
		super(props);
		this.validIndex = true;
		this.handleIndexChange = this.handleIndexChange.bind(this);
	}
	
	handleIndexChange(event) {
		if (/^[0-9]{1,4}$/.test(event.target.value)) {
			if (parseInt(event.target.value, 10) >= 1 &&
				parseInt(event.target.value, 10) <= this.props.max) {
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
	
	render() {
		return <div className="d-flex align-items-center mb-4">
			<button 
				className="btn btn-secondary me-2"
				disabled={this.props.index <= 0 ? true : false}
				onClick={this.props.onPrevious}
			>&lt;</button>
			<div className="col-2 me-2">
				<input 
					type="text" 
					className={this.validIndex ? "form-control" : "form-control is-invalid"}
					name="fcIndex"
					id="fcIndex"
					autoComplete="off"
					maxLength="4"
					value={this.props.max === 0 ? "0" : this.props.typedIndex}
					onChange={this.handleIndexChange}
				/>
			</div>
			<button 
				className="btn btn-secondary me-2"
				disabled={this.props.index >= this.props.max - 1 ? true : false}
				onClick={this.props.onNext}
			>&gt;</button>
			<small className="ms-auto">{this.props.max === 0 ? 0 : this.props.index + 1} out of {this.props.max}</small>
		</div>;
	}
}

class TitleBar extends React.Component {
	constructor(props) {
		super(props);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handlePublicChange = this.handlePublicChange.bind(this);
	}
	
	handleTitleChange(event) {
		this.props.onTitleChange(event.target.value);
	}
	
	handlePublicChange(event) {
		this.props.onPublicChange(event.target.checked);
	}
	
	render() {
		return <div className="mb-4">
			{!this.props.viewOnly && <SaveButton 
				success={this.props.success}
				saving={this.props.saving}
				onSave={this.props.onSave}
				viewOnly={this.props.viewOnly}
			/>}
			{this.props.viewOnly && <div className="d-flex align-items-center">
				<span className="fs-2">{this.props.title}</span>
				<RatingContainer container={DOM_CONTAINER} />
			</div>}
			{!this.props.viewOnly && <div className={this.props.viewOnly ? "row g-0" : "row g-0 mb-4"}>
				<label className="col-4 col-sm-3 col-md-2 col-form-label" htmlFor="fcTitle">Title</label>
				<div className="col-8 col-sm-9 col-md-10">
					<input 
						type="text" 
						className={this.props.validTitle ? "form-control" : "form-control is-invalid"}
						name="fcTitle"
						id="fcTitle"
						autoComplete="off"
						maxLength="100"
						value={this.props.title ? this.props.title : ""}
						onChange={this.handleTitleChange}
						disabled={this.props.viewOnly}
					/>
					{!this.props.validTitle && 
					<div className="invalid-feedback">
						1 to 100 characters allowed. A-Z, a-z, 0-9, spaces, _, ,, !, ., ?, and - allowed.
					</div>
					}
				</div>
			</div>}
			{!this.props.viewOnly && <div className="row g-0 mb-0">
				<div className="form-check">
					<input 
						type="checkbox" 
						className={this.props.validPublic ? "form-check-input" : "form-check-input is-invalid"}
						id="fcPublic"
						name="fcPublic"
						checked={this.props.public ? true : false}
						onChange={this.handlePublicChange}
						disabled={this.props.viewOnly}
					/>
					<label className="form-check-label" htmlFor="fcPublic">Make Public</label>
					{!this.props.validPublic && 
					<div className="invalid-feedback">
						Must be either true or false.
					</div>
					}
				</div>
			</div>}
		</div>;
	}
}

class Card extends React.Component {
	constructor(props) {
		super(props);
		this.handleFlipClick = this.handleFlipClick.bind(this);
		this.handleNewClick = this.handleNewClick.bind(this);
		this.handleDeleteClick = this.handleDeleteClick.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.textInput = React.createRef();
		this.card = React.createRef();
	}
	
	componentDidMount() {
		document.addEventListener("keydown", this.handleKeyDown, false);
	}
	
	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeyDown);
	}
	
	componentDidUpdate(prevProps) {
		this.textInput.current.style.height = "auto";
		this.textInput.current.style.height = this.textInput.current.scrollHeight + "px";
	}
	
	handleFlipClick(event) {
		event.preventDefault();
		this.props.onFlip();
	}
	
	handleNewClick(event) {
		event.preventDefault();
		this.props.onNew();
		this.textInput.current.focus();
	}
	
	handleDeleteClick(event) {
		event.preventDefault();
		this.props.onDelete();
	}
	
	handleTextChange(event) {
		this.textInput.current.style.height = "auto";
		this.textInput.current.style.height = this.textInput.current.scrollHeight + "px";
		this.props.onTextChange(event.target.value);
	}
	
	handleKeyDown(event) {
		if (event.target.tagName.toLowerCase() === "input" || event.target.tagName.toLowerCase() === "textarea") {
			return;
		}
		switch (event.key) {
			case " ":
			case "Spacebar":
				if (document.activeElement !== this.textInput.current) {
					event.preventDefault();
					this.props.onFlip();
				}
				break;
			case "ArrowRight":
			case "Right":
				if (document.activeElement !== this.textInput.current) {
					this.props.onNext();
				}
				break;
			case "ArrowLeft":
			case "Left":
				if (document.activeElement !== this.textInput.current) {
					this.props.onPrevious();
				}
				break;
		}
	}
	
	render() {
		return <React.Fragment>
			{this.props.loading && 
			<div className="text-center mb-4">
				<div className="spinner-border">
				</div>
			</div>
			}
			{!this.props.loading && this.props.cards.length === 0 && 
			<div className="text-center my-5">
				<p className="mb-2">No flash cards to show.</p>
				{!this.props.viewOnly &&
				<a href="#" className="link-dark" onClick={this.handleNewClick}>Create New Card</a>}
			</div>
			}
			<div 
				className={!this.props.loading && this.props.cards.length > 0 ? "card" : "card d-none"}
				ref={this.card}
			>
				<div className="card-header d-flex align-items-center">
					<a 
						className="btn btn-link btn-sm link-dark me-auto text-decoration-none"
						onClick={this.handleFlipClick}
					><strong>Flip Card</strong></a>
					{!this.props.viewOnly && <a 
						className="btn btn-link btn-sm link-dark text-decoration-none ms-2"
						onClick={this.handleNewClick}
					>New</a>}
					{!this.props.viewOnly && <a 
						className="btn btn-link btn-sm link-dark text-decoration-none ms-2"
						onClick={this.handleDeleteClick}
					>Delete</a>}
				</div>
				<div className="card-body">
					<form>
						<textarea
							className={this.props.validCards.length > 0 && this.props.validCards[this.props.index] === false ? 
								"form-control is-invalid fs-2 border-0 text-center py-5 bg-white" :
								"form-control fs-2 border-0 text-center py-5 bg-white"
							}
							value={this.props.cards.length > 0 ? 
									(this.props.front 
									? this.props.cards[this.props.index].front
									: this.props.cards[this.props.index].back) :
									""}
							onChange={this.handleTextChange}
							ref={this.textInput}
							readOnly={this.props.viewOnly ? true : false}
							style={{resize: "none", overflow: "hidden", backgroundColor: "#fff"}}
						>
						</textarea>
					</form>
				</div>
			</div>
		</React.Fragment>
	}
}

class CardsContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
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
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handlePublicChange = this.handlePublicChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleIndexChange = this.handleIndexChange.bind(this);
		this.handlePrevious = this.handlePrevious.bind(this);
		this.handleNext = this.handleNext.bind(this);
		this.handleFlip = this.handleFlip.bind(this);
		this.handleNew = this.handleNew.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
		this.validTitle = true;
		this.validPublic = true;
		this.validCards = [];
		this.pileId = DOM_CONTAINER.getAttribute("data-pileId");
		this.viewOnly = DOM_CONTAINER.getAttribute("data-viewOnly");
		this.pileDoesNotExist = DOM_CONTAINER.getAttribute("data-pileDoesNotExist");
		this.notCreator = DOM_CONTAINER.getAttribute("data-notCreator");
	}
	
	componentDidMount() {
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
		load("/load", data)
		.then(function(json) {
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
		}.bind(this))
		.catch(function(err) {
			this.setState({
				cards: [],
				loading: false
			});
		}.bind(this));
	}
	
	handleIndexChange(valid, value) {
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
	
	handleTextChange(value) {
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
	
	handleFlip() {
		this.setState({
			front: !this.state.front
		});
	}
	
	handleNew() {
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
	
	handleDelete() {
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
	
	handleTitleChange(title) {
		if (/^[A-Za-z0-9 _,!.?-]{1,100}$/.test(title)) {
			this.validTitle = true;
		} else {
			this.validTitle = false;
		}
		this.setState({
			title: title
		});
	}
	
	handlePublicChange(publicState) {
		if (publicState === true || publicState === false) {
			this.validPublic = true;
		} else {
			this.validPublic = false;
		}
		this.setState({
			public: publicState
		});
	}
	
	handleSave() {
		this.setState({
			saving: true
		});
		this.handleTitleChange(this.state.title);
		this.handlePublicChange(this.state.public);
		if (!this.validTitle || !this.validPublic || !this.validCards.every((val) => val === true)) {
			this.setState({
				success: "Validation errors.",
				saving: false
			});
			setTimeout(function() {
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
		save("/create", data)
		.then(function(success) {
			this.pileId = success.pileId;
			this.setState({
				success: success.status,
				saving: false
			});
			setTimeout(function() {
				this.setState({
					success: null
				});
			}.bind(this), 3000);
		}.bind(this))
		.catch(function(err) {
			this.setState({
				success: "Error!",
				saving: false
			});
			setTimeout(function() {
				this.setState({
					success: null
				});
			}.bind(this), 3000);
		}.bind(this));
	}
	
	handlePrevious() {
		var decrement = this.state.index <= 0 ? 0 : this.state.index - 1;
		this.setState({
			index: decrement,
			typedIndex: decrement + 1,
			front: true
		});
	}
	
	handleNext() {
		var increment = this.state.index >= this.state.cards.length - 1 ? this.state.cards.length - 1 : this.state.index + 1;
		this.setState({
			index: increment,
			typedIndex: increment + 1,
			front: true
		});
	}
	
	render() {
		if (this.notCreator || this.pileDoesNotExist) {
			return null;
		}
		return <React.Fragment>
			<TitleBar 
				title={this.state.title}
				public={this.state.public}
				success={this.state.success}
				saving={this.state.saving}
				onSave={this.handleSave}
				onTitleChange={this.handleTitleChange}
				onPublicChange={this.handlePublicChange}
				validTitle={this.validTitle}
				validPublic={this.validPublic}
				viewOnly={this.viewOnly}
			/>
			<Pagination 
				index={this.state.index}
				typedIndex={this.state.typedIndex}
				max={this.state.cards.length}
				onIndexChange={this.handleIndexChange}
				onPrevious={this.handlePrevious} 
				onNext={this.handleNext}
			/>
			<Card 
				loading={this.state.loading}
				index={this.state.index}
				cards={this.state.cards}
				front={this.state.front}
				onFlip={this.handleFlip}
				onNew={this.handleNew}
				onDelete={this.handleDelete}
				onTextChange={this.handleTextChange}
				onPrevious={this.handlePrevious} 
				onNext={this.handleNext}
				validCards={this.validCards}
				viewOnly={this.viewOnly}
			/>
		</React.Fragment>;
	}
}

ReactDOM.render(
	<CardsContainer />, 
	DOM_CONTAINER
);