
/* Tickets Option */

var TicketsOption = (function () {

	/**
	 * Tickets Options constructor
	 * @constructor
	 */
	function TicketsOption(element) {

		this.element = element;

		this.config = {
			showMoreElementSelector: '.TicketsOptions-showMore',
			showLessElementSelector: '.TicketsOptions-showLess',
			showingMoreStateClass: 'is-showingMore'
		};

		if (this.element)
			this.init();

	}

	TicketsOption.prototype.addListeners = function () {

		var self = this;

		try {

			this.showMore.addEventListener('click', function () {

				self.element.classList.add(self.config.showingMoreStateClass);

			});

			this.showLess.addEventListener('click', function () {

				self.element.classList.remove(self.config.showingMoreStateClass);

			});

		} catch (e) {

			console.log(e);

		}


	};

	TicketsOption.prototype.getElements = function () {

		this.showLess = this.element.querySelector(this.config.showLessElementSelector);
		this.showMore = this.element.querySelector(this.config.showMoreElementSelector);

	};

	TicketsOption.prototype.init = function () {

		this.getElements();
		this.addListeners();

	};

	return TicketsOption;

})();