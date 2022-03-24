const DOM_CONTAINER = document.querySelectorAll("div.rating");

class Stars extends React.Component {
	constructor(props) {
		super(props);
		this.handleMouseOver = this.handleMouseOver.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.state = {
			highlight: -1
		};
	}
	
	handleMouseOver(event, index) {
		this.setState({
			highlight: index
		});
	}
	
	handleMouseLeave() {
		this.setState({
			highlight: -1
		});
	}
	
	handleClick(index) {
		this.props.onClick(index + 1);
	}
	
	render() {
		const wholeNumberRating = Math.floor(this.props.rating);
		const decimalPortion = this.props.rating - wholeNumberRating;
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
		var stars = numberOfStars.map((starNumber, index) => {
			if (starNumber === 1) {
				return <div 
					key={index} 
					className={this.state.highlight === -1 ? "star-fill-icon" : 
						(index <= this.state.highlight ? "star-fill-icon" : "star-icon")}
					onMouseOver={this.handleMouseOver.bind(this, event, index)}
					onMouseLeave={this.handleMouseLeave}
					onClick={this.handleClick.bind(this, index)}
				></div>;
			} else {
				if (starNumber === 0.5 && decimalPortion >= 0.5) {
					return <div 
						key={index} 
						className={this.state.highlight === -1 ? "star-half-icon" : 
							(index <= this.state.highlight ? "star-fill-icon" : "star-icon")}
						onMouseOver={this.handleMouseOver.bind(this, event, index)}
						onMouseLeave={this.handleMouseLeave}
						onClick={this.handleClick.bind(this, index)}
					></div>;
				} else {
					return <div 
						key={index} 
						className={index <= this.state.highlight ? "star-fill-icon" : "star-icon"}
						onMouseOver={this.handleMouseOver.bind(this, event, index)}
						onMouseLeave={this.handleMouseLeave}
						onClick={this.handleClick.bind(this, index)}
					></div>;
				}
			}
		});
		if (this.props.loading || this.props.saving) {
			return <div className="mb-2">
				<div className="spinner-border">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>;
		} else {
			return <div>
				{stars}
				<small className="py-0 my-0 lh-1 ms-2">{this.props.ratingsCompleted === 1 ? "1 rating" : this.props.ratingsCompleted + " ratings"}</small>
				<div><small className="py-0 my-0 lh-1">{this.props.status}</small></div>
			</div>;	
		}
	}
}

class RatingContainer extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.pileId = this.props.container.getAttribute("data-pileId");
		this.loggedInAs = this.props.container.getAttribute("data-loggedInAs");
		this.state = {
			rating: 0,
			ratingsCompleted: 0,
			loading: true,
			saving: false,
			status: null
		};
	}
	
	componentDidMount() {
		var data = {
			rating: this.state.rating,
			pileId: this.pileId,
			rater: this.loggedInAs
		};
		load("/load/rating", data)
		.then(function(json) {
			if (json && json.rating && json.ratingsCompleted) {
				this.setState({
					rating: json.rating,
					ratingsCompleted: json.ratingsCompleted
				});
			}
			this.setState({
				loading: false
			});
		}.bind(this))
		.catch(function(error) {
			this.setState({
				loading: false
			});
		}.bind(this));
	}
	
	handleClick(rating) {
		this.setState({
			saving: true
		});
		var data = {
			rating: rating,
			pileId: this.pileId,
			rater: this.loggedInAs
		};
		save("/rate", data)
		.then(function(json) {
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
			setTimeout(function() {
				this.setState({
					status: null
				});
			}.bind(this), 3000);
		}.bind(this))
		.catch(function(error) {
			this.setState({
				status: "Error!",
				saving: false
			});
			setTimeout(function() {
				this.setState({
					status: null
				});
			}.bind(this), 3000);
		}.bind(this));
	}
	
	render() {
		return <div className="ms-auto">
			<Stars
				rating={this.state.rating}
				ratingsCompleted={this.state.ratingsCompleted}
				onClick={this.handleClick}
				status={this.state.status}
				loading={this.state.loading}
				saving={this.state.saving}
			/>
		</div>;
	}
}

if (DOM_CONTAINER) {
	DOM_CONTAINER.forEach((element) => {
	ReactDOM.render(
		<RatingContainer 
			container={element}
		/>, 
		element
	);
});
}

