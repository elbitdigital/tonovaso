

/* Order Ticket Item */

var OrderTicketItem = (function () {

	/**
	 * Order Ticket Item constructor
	 * @constructor
	 */
	function OrderTicketItem(data, orderItem) {

		var self = this;

		if (data && orderItem) {

			this.orderItem = orderItem;

			this.reference = data.reference;
			this.id = data.id;
			this.amount= data.amount;
			this.description = data.description;
			this.shipping = data.shipping;

			this.createElement();

			database.ref('transactions/' + this.orderItem.reference + '/tickets/' + this.reference + '/').child('shipping').on('value', function (snap) {

				self.updateShippingStatus(snap.val());

			});

		}

	}

	OrderTicketItem.prototype.updateShippingStatus = function (data) {

		this.shipping = data;

		if (this.shipping) {

			this.element.classList.add('is-shipped');
			this.shippingButtonElement.innerHTML = "<span>Retirado</span>";

		} else {

			this.element.classList.remove('is-shipped');
			this.shippingButtonElement.innerHTML = "<span>Retirar</span>";

		}

	};

	OrderTicketItem.prototype.getTicketTypeColor = function (ticketId) {

		var maleClassName = {
			'background': 'indigo-50',
			'font': 'font-indigo-700'
		};
		var femaleClassName = {
			'background': 'pink-50',
			'font': 'font-pink-700'
		};

		switch (ticketId) {

			case 'TNVPACKPROMO_M':
				return maleClassName;
				break;
			case 'TNVPACKPROMO_F':
				return femaleClassName;
				break;
			case 'TNVPACK_M':
				return maleClassName;
				break;
			case 'TNVPACK_F':
				return femaleClassName;
				break;
			case 'TNVDIAR_M':
				return maleClassName;
				break;
			case 'TNVDIAR_F':
				return femaleClassName;
				break;
			default: return 'grey-700';

		}

	};

	OrderTicketItem.prototype.createElement = function () {

		var self = this;
		var colors = this.getTicketTypeColor(this.id);

		this.element = document.createElement('div');
		this.element.className  = 'OrderTicketItem';
		this.element.dataset.itemReferenceId = this.reference;
		this.element.classList.add(colors.background);


		// Create ID Label Element
		this.idLabelElement = document.createElement('span');
		this.idLabelElement.className = 'OrderTicketItem-id';
		this.idLabelElement.innerText = this.id + '';

		//this.element.appendChild(this.idLabelElement);

		// Create ID Label Element
		this.descriptionLabelElement = document.createElement('span');
		this.descriptionLabelElement.className = 'OrderTicketItem-description';
		this.descriptionLabelElement.innerText = this.description + '';
		this.descriptionLabelElement.classList.add(colors.font);

		this.element.appendChild(this.descriptionLabelElement);

		// Create Shipping Button Element
		this.shippingButtonElement = document.createElement('span');
		this.shippingButtonElement.className = 'OrderTicketItem-shippingButton';
		this.shippingButtonElement.innerHTML = "<span>Retirar</span>";
		this.shippingButtonElement.addEventListener('click', function () {

			if (!self.shipping) {

				// aqui dentro é iniciado a retirada do ingresso (ticket)

				if (window.confirm("Você confirma a retirada deste ingresso?")) {

					var user = firebase.auth().currentUser;
					var name = prompt("Qual o Nome da pessoa que está retirando?");
					var cpf = prompt("Qual o CPF da pessoa que está retirando?");

					var shippingObject = {
						cpf: cpf,
						name: name,
						timestamp: moment().format(),
						user: {
							'displayName': user.displayName,
							'email': user.email,
							'uid': user.uid
						}
					};

					database.ref('transactions/' + self.orderItem.reference + '/tickets/' + self.reference + '/').child('shipping').set(shippingObject);

					shippingObject.reference = self.reference;
					shippingObject.type = 'shipped';

					database.ref('ticketShippings/').push(shippingObject);

				}

			} else if (window.isSuperUser) {

				// aqui é feito o processo de 'des-retirada' do ingresso em casos de erros
				// este processo só pode ser feito por um Super Usuário

				if (window.confirm("Você está prestes a anular a retirada deste ticket, você confirma isso?")) {

					var user = firebase.auth().currentUser;

					var shippingObject = {
						timestamp: moment().format(),
						user: {
							'displayName': user.displayName,
							'email': user.email,
							'uid': user.uid
						}
					};

					database.ref('transactions/' + self.orderItem.reference + '/tickets/' + self.reference + '/').child('shipping').set(false);

					shippingObject.reference = self.reference;
					shippingObject.type = 'unshipped';

					database.ref('ticketShippings/').push(shippingObject);

				}

			} else {

				console.log('sorry');

			}

		});

		this.element.appendChild(this.shippingButtonElement);

	};

	return OrderTicketItem;

})();