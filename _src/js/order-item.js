
/* Order Item */

var OrderItem = (function () {

	/**
	 * Order Item constructor
	 * @constructor
	 */
	function OrderItem(data, database) {

		if (data) {

			this.clientName = data.clientName;
			this.clientEmail = data.clientEmail;
			this.code = data.code;
			this.date = data.date;
			this.items = data.items;
			this.reference = data.reference;
			this.status = data.status;
			this.time = data.time;
			this.tickets = data.tickets;

			this.normalizeData();
			this.createElement();
			this.getTicketList();

		}

	}

	OrderItem.prototype.setClientName = function (clientName) {

		this.clientName = clientName;
		database.ref('transactions/' + this.reference).child('clientName').set(this.clientName);

	};

	OrderItem.prototype.setClientEmail = function (clientEmail) {

		this.clientEmail = clientEmail;
		database.ref('transactions/' + this.reference).child('clientEmail').set(this.clientEmail);

	};

	OrderItem.prototype.setCode = function (code) {

		this.code = code;
		database.ref('transactions/' + this.reference).child('code').set(this.code);

	};

	OrderItem.prototype.setDate = function (date) {

		this.date = moment(date).format();
		database.ref('transactions/' + this.reference).child('date').set(this.date);

	};

	OrderItem.prototype.setStatus = function (status) {

		this.status = status;
		database.ref('transactions/' + this.reference).child('status').set(this.status);

	};

	OrderItem.prototype.setTime = function (time) {

		this.time = time;
		database.ref('transactions/' + this.reference).child('time').set(this.time);

	};

	OrderItem.prototype.getTicketList = function () {

		this.ticketList = new OrderTicketList(this.ticketListElement, this);

	};

	OrderItem.prototype.normalizeData = function () {

		if (!this.tickets) {

			var tickets = [];

			for (var i = this.items.length; i--; ) {

				if (this.items[i].id != 'TNVABADA') {

					if (this.items[i].quantity > 0) {

						for (var j = this.items[i].quantity; j--; ) {

							var pushKey = database.ref('transactions/' + this.reference).child('tickets').push().key;

							database.ref('transactions/' + this.reference).child('tickets').child(pushKey).set({
								amount: this.items[i].amount,
								description: this.items[i].description,
								id: this.items[i].id,
								reference: pushKey
							})

						}

					}

				}

			}

		}

	};

	OrderItem.prototype.defineStatusColor = function (status) {

		switch (status) {

			case 'Aprovada':
				return 'font-green-400';
				break;
			case 'Cancelada':
				return 'font-red-400';
				break;
			case 'Aguardando pagamento':
				return 'font-yellow-700';
				break;
			case 'Pagamento negado pela empresa de cartão de crédito':
				return 'font-red-400';
				break;
			default:
				return 'font-grey-400';

		}

	};

	OrderItem.prototype.createElement = function () {

		var self = this;

		this.element = document.createElement('div');
		this.element.className = 'OrderItem';
		this.element.dataset.itemReferenceId = this.reference;

		// Header element
		this.headerElement = document.createElement('div');
		this.headerElement.className = 'OrderItem-header';
		this.headerElement.dataset.itemReferenceId = this.reference;

		this.element.appendChild(this.headerElement);

		// Body element
		this.bodyElement = document.createElement('div');
		this.bodyElement.className = 'OrderItem-body';
		this.bodyElement.dataset.itemReferenceId = this.reference;

		this.element.appendChild(this.bodyElement);

		// Reference Label element
		this.referenceLabelElement = document.createElement('div');
		this.referenceLabelElement.className = 'OrderItem-referenceLabel ' + this.defineStatusColor(this.status);
		this.referenceLabelElement.innerHTML = "<span>" + this.reference + ' (' + this.status + ')' + "</span>";
		this.referenceLabelElement.dataset.itemReferenceId = this.reference;

		this.headerElement.appendChild(this.referenceLabelElement);

		// Client Name Label element
		this.clientNameLabelElement = document.createElement('input');
		this.clientNameLabelElement.className = 'OrderItem-clientNameField';
		this.clientNameLabelElement.placeholder = 'Nome (titular)';
		this.clientNameLabelElement.value = this.clientName;
		this.clientNameLabelElement.dataset.itemReferenceId = this.reference;
		this.clientNameLabelElement.addEventListener('input', function () {

			if (this.dataset.itemReferenceId) {

				var value = this.value.length ? this.value : null;

				database.ref('transactions/' + this.dataset.itemReferenceId).child('clientName').set(value);

			}

		});

		this.headerElement.appendChild(this.clientNameLabelElement);

		// Client Email Label element
		this.dateLabelElement = document.createElement('span');
		this.dateLabelElement.className = 'OrderItem-dateLabel';
		this.dateLabelElement.innerText = moment(this.date).format('LLL') || '';
		this.dateLabelElement.dataset.itemReferenceId = this.reference;

		this.bodyElement.appendChild(this.dateLabelElement);

		// Code ID Label element
		this.codeLabelElement = document.createElement('span');
		this.codeLabelElement.className = 'OrderItem-codeLabel';
		this.codeLabelElement.innerText = this.code || '';
		this.codeLabelElement.dataset.itemReferenceId = this.reference;

		this.bodyElement.appendChild(this.codeLabelElement);

		// Client Email Label element
		this.clientEmailLabelElement = document.createElement('span');
		this.clientEmailLabelElement.className = 'OrderItem-clientEmailLabel';
		this.clientEmailLabelElement.innerText = this.clientEmail || '';
		this.clientEmailLabelElement.dataset.itemReferenceId = this.reference;

		this.bodyElement.appendChild(this.clientEmailLabelElement);

		// Create Ticket List element
		this.ticketListElement = document.createElement('div');
		this.ticketListElement.className = 'OrderTicketList';
		this.ticketListElement.dataset.itemReferenceId = this.reference;

		this.bodyElement.appendChild(this.ticketListElement);

		// Create Ticket Button element
		/*this.createTicketButtonElement = document.createElement('button');
		this.createTicketButtonElement.className = 'OrderItem-createTicketButton';
		this.createTicketButtonElement.innerHTML = "<span>Retirar</span>";
		this.createTicketButtonElement.dataset.itemReferenceId = this.reference;
		this.createTicketButtonElement.addEventListener('click', function () {

			if (window.confirm("Você confirma a retirada deste ingresso?"))
				if (this.dataset.itemReferenceId) {

					// TODO
					// Cris, edita aqui, só adicionar o user aqui
					// DONE - 22-02-2017 16:35

					var user = firebase.auth().currentUser;
					var value = {
						timestamp: moment().format(),
						user: {
							'displayName': user.displayName,
							'email': user.email,
							'uid': user.uid
						}
					};

					database.ref('transactions/' + this.dataset.itemReferenceId).child('ticket').set(value);

				}

		});
		if (this.ticket)
			this.createTicketButtonElement.classList.add('is-empty');

		this.bodyElement.appendChild(this.createTicketButtonElement);*/

		// Show More button
		this.showMoreButtonElement = document.createElement('button');
		this.showMoreButtonElement.className = 'OrderItem-showMore';
		this.showMoreButtonElement.innerHTML = "<span>Mostrar mais</span>";
		this.showMoreButtonElement.addEventListener('click', function () {

			self.element.classList.toggle('is-showingMore');

			if (self.element.classList.contains('is-showingMore'))
				this.innerHTML = "<span>Mostrar menos</span>";
			else
				this.innerHTML = "<span>Mostrar mais</span>";

		});

		this.element.appendChild(this.showMoreButtonElement);

	};

	return OrderItem;

})();