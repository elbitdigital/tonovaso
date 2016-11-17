/*!
 * Elbit Tô No Vaso Project v0.0.0 (http://elbit.com.br/)
 * Copyright 2013-2016 Elbit Developers
 * Licensed under MIT (https://github.com/elbitdigital/base/blob/master/LICENSE)
*/
/* Dialog */

var Dialog = (function () {

	/**
	 * Dialog constructor
	 * @constructor
	 */
	function Dialog(element) {

		var self = this;

		this.element = element;

		this.show = function () {

			self.element.classList.add('is-active');

		};

		this.hide = function () {

			self.element.classList.remove('is-active');

		};

		this.setText = function (text) {

			var textElement = self.element.querySelector('.Dialog-text');

			if (textElement) {

				textElement.innerHTML = '';

				var spanElement = document.createElement('span');
				spanElement.textContent = text;

				textElement.appendChild(spanElement);

			}

		};

		this.setSubText = function (text) {

			var subTextElement = self.element.querySelector('.Dialog-subText');

			if (subTextElement) {

				subTextElement.innerHTML = '';

				var spanElement = document.createElement('span');
				spanElement.textContent = text;

				subTextElement.appendChild(spanElement);

			}

		};

		if (this.element)
			this.init();

	}

	Dialog.prototype.init = function () {


	};

	return Dialog;

})();
/* Select */

var Select = (function () {

	/**
	 * Select constructor
	 * @constructor
	 */
	function Select(element, fallback) {

		this.element = element;
		this.fallback = fallback;

		this.config = {
			innerElementSelector: '.Select-inner',
			valueElementSelector: '.Select-value',
			selectElementSelector: '.Select-select'
		};

		if (this.element)
			this.init();

	}

	Select.prototype.updateValue = function () {

		var self = this;

		try {

			this.value = this.selectElement.value;

			this.valueElement.innerHTML = '';

			var valueTextElement = document.createElement('span');
			valueTextElement.innerText = this.selectElement.value;

			this.valueElement.appendChild(valueTextElement);

			setTimeout(function () {

				if (self.fallback)
					self.fallback(self.value);

			})

		} catch (e) { }

	};

	/**
	 * Função que adiciona eventos de focus, blur, keydown e change.
	 * A função keydown serve para pegar os eventos de tecla que não
	 * aparecem na hora que o usuário tecla as setas 'down' e 'up'.
	 * A função change serve para trocar o evento.
	 * Todos eventos que trocam o valor do select executam a função 'updateValue'.
	 */
	Select.prototype.addListeners = function () {

		var self = this;

		try {

			this.selectElement.addEventListener('focus', function () {

				self.element.classList.add('is-focus');

			});

			this.selectElement.addEventListener('blur', function () {

				self.element.classList.remove('is-focus');

			});

			this.selectElement.addEventListener('keydown', function () {

				setTimeout(function () {

					self.updateValue();

				}, 1);

			});

			this.selectElement.addEventListener('change', function () {

				self.updateValue();

			});

		} catch (e) {

			console.log(e);

		}

	};

	Select.prototype.getElements = function () {

		this.innerElement = this.element.querySelector(this.config.innerElementSelector);
		this.valueElement = this.element.querySelector(this.config.valueElementSelector);
		this.selectElement = this.element.querySelector(this.config.selectElementSelector);

	};

	Select.prototype.init = function () {

		this.getElements();
		this.addListeners();
		this.updateValue();

	};

	return Select;

})();

/* Tickets Checkout */

var TicketsCheckout = (function () {

	/**
	 * Tickets Checkout constructor
	 * @constructor
	 */
	function TicketsCheckout(element, parent) {

		this.element = element;
		this.parent = parent;

		this.config = {
			priceAmountElementSelector: '.TicketsCheckout-amount',
			quantityElementSelector: '.TicketsCheckout-quantity',
			startButtonElementSelector: '.TicketsCheckout-start'
		};

		this.amount = '';
		this.quantity = '';

		if (this.element && this.parent)
			this.init();

	}

	TicketsCheckout.prototype.start = function () {

		var self = this;

		var items = [];

		for (var i = this.parent.options.length; i--; ) {

			if (this.parent.options[i].quantity) {

				var item = {
					id: this.parent.options[i].id,
					description: this.parent.options[i].description,
					amount: this.parent.options[i].price,
					quantity: this.parent.options[i].quantity
				};

				items.push(item);

			}

		}

		if (firebase) {

			var transactions = firebase.database().ref('transactions/');

			var transaction = {
				items: items,
				reference: transactions.push(items).key
			};

			transactions.child(transaction.reference).set(transaction);

			/*
			var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
			xmlhttp.open("POST", "https://service.elbit.com.br/dalia-server/");
			xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			//JSON.stringify(transaction)
			xmlhttp.send();
			*/

			$.ajax({
				//contentType: "application/json",
				crossDomain: true,
				url: 'https://service.elbit.com.br/dalia-server/index.php',
				type: "POST",
				cache: false,
				data: {
					pedido: JSON.stringify(transaction)
				},
				//dataType: 'json',
				beforeSend: function () {

					self.parent.dialog.setText('Aguarde, estamos te redirecionando para uma página segura de pagamento');
					//self.parent.dialog.setSubText('Fique tranquilo, de agora em diante você estarem um ambiente seguro');
					self.parent.dialog.show();

				},
				success: function (data) {

					console.log(data);

					setTimeout(function () {

						if (data.url)
							window.location.replace(data.url);

					}, 2000);

				}
			});

		}

	};

	TicketsCheckout.prototype.convertToComma = function (amount) {

		return amount.toString().replace('.', ',');

	};

	TicketsCheckout.prototype.getQuantity = function () {

		var quantity = 0.00;

		for (var i = this.parent.options.length; i--; )
			quantity += this.parent.options[i].quantity;

		return quantity;

	};

	TicketsCheckout.prototype.getPriceAmount = function () {

		var priceAmount = 0.00;

		for (var i = this.parent.options.length; i--; )
			priceAmount += this.parent.options[i].quantity * this.parent.options[i].price;


		return parseFloat(priceAmount).toFixed(2);

	};

	TicketsCheckout.prototype.updatePriceAmount = function () {

		this.priceAmountElement.innerHTML = '';

		var amountTextElement = document.createElement('span');
		amountTextElement.textContent = 'R$' + this.convertToComma(this.getPriceAmount());

		this.priceAmountElement.appendChild(amountTextElement);

	};

	TicketsCheckout.prototype.updateQuantity = function () {

		this.quantityElement.innerHTML = '';

		var quantityTextElement = document.createElement('span');
		quantityTextElement.textContent = 'QTD: ' + this.getQuantity();

		this.quantityElement.appendChild(quantityTextElement);

	};

	TicketsCheckout.prototype.updateDetails = function () {

		this.updatePriceAmount();
		this.updateQuantity();

	};

	TicketsCheckout.prototype.addListeners = function () {

		var self = this;

		try {

			this.startButtonElement.addEventListener('click', function () {

				self.start();

			});

		} catch (e) { }


	};

	TicketsCheckout.prototype.getElements = function () {

		this.quantityElement = this.element.querySelector(this.config.quantityElementSelector);
		this.priceAmountElement = this.element.querySelector(this.config.priceAmountElementSelector);
		this.startButtonElement = this.element.querySelector(this.config.startButtonElementSelector);

	};

	TicketsCheckout.prototype.init = function () {

		this.getElements();
		this.addListeners();
		this.updatePriceAmount();

	};

	return TicketsCheckout;

})();

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