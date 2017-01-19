
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

		if (items.length) {

			if (firebase) {

				var transactions = firebase.database().ref('transactions/');

				var transactionReferenceKey = transactions.push().key;
				var transactionTime = Date.now().toString();

				var transaction = {
					items: items,
					reference: transactionReferenceKey,
					time: transactionTime
				};

				transactions.child(transactionReferenceKey).set(transaction);

				$.ajax({
					//contentType: "application/json",
					crossDomain: true,
					// url: 'https://service.elbit.com.br/dalia-server/index.php',
					url: 'https://service-elbit-com-br.umbler.net/dalia-server/index.php',
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

						try {

							ga('send', 'event', {
								eventCategory: 'Ticket',
								eventAction: 'click',
								eventLabel: 'TicketCheckout'
							});

						} catch (e) { }

					},
					success: function (data) {

						try {

							if (data.code) {

								transaction.code = data.code;
								transaction.date = data.date;

								// update transaction data
								console.log(transaction);
								console.log(transactionReferenceKey);
								transactions.child(transactionReferenceKey).set(transaction);

							}

						} catch (e) { }

						setTimeout(function () {

							if (data.url)
								window.location.replace(data.url);

						}, 2000);

					}
				});

			}

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