
/* Tickets Option */

var TicketsOption = (function () {

	/**
	 * Tickets Options constructor
	 * @constructor
	 */
	function TicketsOption(element, parent) {

		var self = this;

		this.element = element;
		this.parent = parent;

		this.config = {
			showMoreElementSelector: '.TicketsOptions-showMore',
			showLessElementSelector: '.TicketsOptions-showLess',
			showingMoreStateClass: 'is-showingMore',
			selectElementSelector: '.Select.Select--ticketOption'
		};

		this.quantity = 0;
		this.id = this.element.dataset.optionId || '';
		this.description = this.element.dataset.description || '';
		this.price = this.getPrice();

		this.onSelectChange = function (value) {

			try {

				self.quantity = parseInt(value);
				self.parent.onOptionQuantityChange();

			} catch (e) { }

		};

		if (this.element)
			this.init();

	}

	TicketsOption.prototype.addListeners = function () {

		var self = this;

		try {

			this.showMore.addEventListener('click', function (event) {

				event.preventDefault();

				self.element.classList.add(self.config.showingMoreStateClass);

			});

			this.showLess.addEventListener('click', function (event) {

				event.preventDefault();

				self.element.classList.remove(self.config.showingMoreStateClass);

			});

		} catch (e) {

			console.log(e);

		}


	};

	TicketsOption.prototype.getElements = function () {

		var self = this;

		this.showLess = this.element.querySelector(this.config.showLessElementSelector);
		this.showMore = this.element.querySelector(this.config.showMoreElementSelector);

		var selectElement = this.element.querySelector(this.config.selectElementSelector);

		if (selectElement)
			this.select = new Select(selectElement, self.onSelectChange);

	};

	TicketsOption.prototype.getPrice = function () {

		try {

			if (this.element.dataset.price)
				return parseFloat(this.element.dataset.price).toFixed(2);
			else
				return 0;

		} catch (e) {

			return 0;

		}

	};

	TicketsOption.prototype.init = function () {

		this.getElements();
		this.addListeners();

	};

	return TicketsOption;

})();