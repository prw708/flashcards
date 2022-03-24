var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DOM_CONTAINER = document.getElementById("order");

var OrderContainer = function (_React$Component) {
	_inherits(OrderContainer, _React$Component);

	function OrderContainer(props) {
		_classCallCheck(this, OrderContainer);

		var _this = _possibleConstructorReturn(this, (OrderContainer.__proto__ || Object.getPrototypeOf(OrderContainer)).call(this, props));

		_this.handleClick = _this.handleClick.bind(_this);
		_this.currentPage = _this.props.container.getAttribute("data-currentPage");
		_this.searchText = _this.props.container.getAttribute("data-searchText");
		_this.state = {
			inv: "desc",
			orderBy: "lastUpdated"
		};
		return _this;
	}

	_createClass(OrderContainer, [{
		key: "handleClick",
		value: function handleClick(orderBy) {
			if (this.state.orderBy === orderBy && this.state.inv === "desc") {
				this.setState({
					inv: "asc"
				});
			} else {
				this.setState({
					inv: "desc"
				});
			}
			this.setState({
				orderBy: orderBy
			});
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ className: "d-flex flex-row align-items-center mb-0" },
				React.createElement(
					"small",
					{ className: "m-0 me-2 me-md-4" },
					"Order By"
				),
				React.createElement(
					"a",
					{
						href: "?sort=lastUpdated," + this.state.inv + "&page=" + (parseInt(this.currentPage, 10) + 1),
						className: "btn btn-link btn-sm link-dark m-0 p-0 ms-2 ms-md-4",
						onClick: this.handleClick.bind(this, "lastUpdated")
					},
					"Last Updated"
				),
				React.createElement(
					"a",
					{
						href: "?sort=title," + this.state.inv + "&page=" + (parseInt(this.currentPage, 10) + 1),
						className: "btn btn-link btn-sm link-dark m-0 p-0 ms-2 ms-md-4",
						onClick: this.handleClick.bind(this, "alphabetical")
					},
					"Alphabetical"
				),
				React.createElement(
					"a",
					{
						href: "?sort=rating," + this.state.inv + "&page=" + (parseInt(this.currentPage, 10) + 1),
						className: "btn btn-link btn-sm link-dark m-0 p-0 ms-2 ms-md-4",
						onClick: this.handleClick.bind(this, "rating")
					},
					"Rating"
				)
			);
		}
	}]);

	return OrderContainer;
}(React.Component);

ReactDOM.render(React.createElement(OrderContainer, {
	container: DOM_CONTAINER
}), DOM_CONTAINER);