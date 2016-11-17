/* Tickets */

var Tickets = (function () {

	/**
	 * Tickets constructor
	 * @constructor
	 */
	function Tickets(element) {

		var self = this;

		this.element = element;

		this.config = {
			optionElementSelector: '.TicketsOption',
			checkoutElementSelector: '.Tickets-checkout'
		};

		this.options = [];

		this.onOptionQuantityChange = function () {

			self.checkout.updateDetails();

			var quantity = 0;

			for (var i = self.options.length; i--; )
				quantity += self.options[i].quantity;

			if (quantity == 0)
				self.element.classList.add('is-empty');
			else
				self.element.classList.remove('is-empty');

		};

		if (this.element)
			this.init();

	}

	Tickets.prototype.getElements = function () {

		var checkoutElement = this.element.querySelector(this.config.checkoutElementSelector);

		if (checkoutElement)
			this.checkout = new TicketsCheckout(checkoutElement, this);

	};

	Tickets.prototype.getOptions = function () {

		var optionElements = this.element.querySelectorAll(this.config.optionElementSelector);

		for (var i = optionElements.length; i--; )
			this.options.push(new TicketsOption(optionElements[i], this));

	};

	Tickets.prototype.init = function () {

		this.getOptions();
		this.getElements();

	};

	return Tickets;

})();