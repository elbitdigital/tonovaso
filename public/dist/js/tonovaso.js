

/* Scroll */

var Anchor = (function () {

	/**
	 * Anchor class constructor
	 * @constructor
	 */
	function Anchor(element, options) {

		var self = this;

		this.element = element;

		_.defaults(options, {
			duration:  200,
			easing: 'linear',
			callback: false,
			scrollOffset: 0
		});

		this.duration = options.duration;
		this.easing = options.easing;
		this.callback = options.callback;
		this.scrollOffset = options.scrollOffset;

		this.push = function() {

			self.start = this.bodyElement.scrollTop;
			self.startTime = Date.now();

			// Height checks to prevent requestAnimationFrame from infinitely looping
			// If the function tries to scroll below the visible document area
			// it should only scroll to the bottom of the document
			self.documentHeight = self.getDocumentHeight();
			self.windowHeight = self.getWindowHeight();
			self.destinationPosition = self.getDestinationPosition();

			self.animate();

		};

		if (this.element)
			this.init();

	}

	/**
	 * Returns document.documentElement for Chrome and Safari
	 * document.body for rest of the world
	 *
	 * @return body DOM element
	 */
	Anchor.prototype.checkBody = function () {

		document.documentElement.scrollTop += 1;
		var body = (document.documentElement.scrollTop !== 0) ? document.documentElement : document.body;
		document.documentElement.scrollTop -= 1;

		return body;

	};

	/**
	 * Choose what easing function to use
	 * @param easing String
	 * @param t Integer
	 */
	Anchor.prototype.easingOption = function (easing , t) {

		switch (easing) {

			case 'linear':
				return t;
				break;

			case 'easeInQuad':
				return t * t;
				break;

			case 'easeOutQuad':
				return t * (2 - t);
				break;

			case 'easeInOutQuad':
				return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
				break;

			case 'easeInCubic':
				return t * t * t;
				break;

			case 'easeOutCubic':
				return (--t) * t * t + 1;
				break;

			case 'easeInOutCubic':
				return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
				break;

			case 'easeInQuart':
				return t * t * t * t;
				break;

			case 'easeOutQuart':
				return 1 - (--t) * t * t * t;
				break;

			case 'easeInOutQuart':
				return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
				break;

			case 'easeInQuint':
				return t * t * t * t * t;
				break;

			case 'easeOutQuint':
				return 1 + (--t) * t * t * t * t;
				break;

			case 'easeInOutQuint':
				return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
				break;

			default:
				return t * t;
				break;

		}

	};


	/**
	 * Animate the body element until destination
	 */
	Anchor.prototype.animate = function () {

		var self = this;

		var now = Date.now();
		var time = Math.min(1, ((now - this.startTime) / this.duration));
		var timeFunction = this.easingOption(this.easing, time);
		this.bodyElement.scrollTop = (timeFunction * (this.destinationPosition - this.start)) + this.start;

		if (this.bodyElement.scrollTop === this.destinationPosition) {
			return;
		}

		requestAnimationFrame(function () {

			self.animate();

		});

	};

	Anchor.prototype.getDestinationPosition = function () {

		return ( this.documentHeight - this.element.offsetTop < this.windowHeight ? this.documentHeight - this.windowHeight : this.element.offsetTop ) + this.scrollOffset;

	};

	Anchor.prototype.getWindowHeight = function () {

		return window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;

	};

	Anchor.prototype.getDocumentHeight = function () {

		return Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);

	};

	Anchor.prototype.init = function () {

		this.bodyElement = this.checkBody();

	};

	return Anchor;

})();

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

/* LineupArtist */

var LineupArtist = (function () {

	/**
	 * LineupArtist constructor
	 * @constructor
	 */
	function LineupArtist(element) {

		var self = this;

		this.element = element;

		this.config = {
			showMoreButtonElementSelector: '.Button--lineupShowMore'
		};

		if (this.element)
			this.init();

	}

	LineupArtist.prototype.addListeners = function () {

		var self = this;

		try {

			if (this.showMoreButtonElement)
				this.showMoreButtonElement.addEventListener('click', function () {

					self.element.classList.toggle('is-showingMore');

				})

		} catch (e) { }

	};

	LineupArtist.prototype.getElements = function () {

		this.showMoreButtonElement = this.element.querySelector(this.config.showMoreButtonElementSelector);

	};

	LineupArtist.prototype.init = function () {

		this.getElements();
		this.addListeners();

		console.log(this.showMoreButtonElement);

	};

	return LineupArtist;

})();

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

/* Order List */

var OrderList = (function () {

	/**
	 * Order List constructor
	 * @constructor
	 */
	function OrderList(element, database) {

		this.element = element;
		this.database = database;

		// bloqueia o build enquanto o delay de 3000 milisegundos não passar
		this.locked = true;

		// global list
		this.list = [];

		// global list view list
		this.viewList = [];

		// a diferença entre viewList e list, é que na list, ficam armazenados os dados 'seguros', na listView, os dados são apenas ordenados

		this.config = {
			orderType: 'time',
			orderReverse: false,
			approvedOnly: true,
			hiddenCanceled: true
		}

	}

	/**
	 * build the list
	 * se tiver uma findString, a função mostra apenas entradas com nome que inclua a string
	 * @param findString {String}
	 */
	OrderList.prototype.build = function (findString) {

		// fix findString value
		findString = !!findString ? findString.toLowerCase() : '';

		this.element.innerHTML = '';

		if (!this.locked) {

			// se não tiver uma viewList, cria uma
			if (!this.viewList.length)
				this.buildViewList();

			var self = this;

			// função para fazer o append dos items dentro da lista, usada no próximo for
			function appendOrderItem(orderItemElement) {

				self.element.appendChild(orderItemElement);

			}

			for (var i = 0; i < this.viewList.length; i++) {

				// permite apenas transações com estado
				if (!!this.list[i].status) {

					var addToViewList = false;

					// permite apenas transações com nome parecido com a findString
					if (this.list[i].clientName)
						addToViewList = this.list[i].clientName.toLowerCase().includes(findString);

					if (this.config.hiddenCanceled && !findString.length)
						if (this.list[i].status == 'Cancelada' || this.list[i].status == 'Pagamento negado pela empresa de cartão de crédito')
							addToViewList = false;

					if (addToViewList)
						appendOrderItem(this.list[i].element);

				}

			}

		}

	};

	OrderList.prototype.buildViewList = function () {

		var viewList = this.list;

		viewList.sort(function (a, b) {

			if (a.clientName > b.clientName) {
				return 1;
			}
			if (a.clientName < b.clientName) {
				return -1;
			}
			// a must be equal to b
			return 0;

		});

		this.viewList = viewList;

	};

	OrderList.prototype.isInList = function (orderItem) {

		var filterItemReference = this.list.filter(function (orderListItem) {

			return orderListItem.reference == orderItem.reference;

		});

		return !!filterItemReference.length;

	};

	OrderList.prototype.push = function (orderItem) {

		// check if order item is on order list
		if (!this.isInList(orderItem))
			this.list.push(orderItem);

	};

	OrderList.prototype.start = function () {

		var self = this;

		this.database.ref('transactions/').on('child_added', function (snap) {

			// create the order item object
			var orderItem = new OrderItem(snap.val());

			// push order item object to order list
			self.push(orderItem);

			document.getElementById('orderList-count').innerText = self.list.length + ' registro processados';

			if (!self.locked) {
				self.buildViewList();
				self.build();
			}

			if (!snap.val().reference)
				console.log(snap.key);

		});

		setTimeout(function () {

			self.locked = false;
			self.build();

		}, 3000);

	};

	return OrderList;

})();


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

/* Order Ticket List */

var OrderTicketList = (function () {

	/**
	 * Order Ticket List constructor
	 * @constructor
	 */
	function OrderTicketList(element, orderItem) {

		var self = this;

		this.element = element;
		this.orderItem = orderItem;
		this.list = [];

		if (this.orderItem && this.element) {

			//console.log(data);
			database.ref('transactions/' + this.orderItem.reference + '/tickets/').on('child_added', function (snap) {

				var orderTicketItem = new OrderTicketItem(snap.val(), self.orderItem);
				self.push(orderTicketItem);

			});

		}

	}

	OrderTicketList.prototype.build = function () {

		this.element.innerHTML = '';

		for (var i = this.list.length; i--; )
			this.element.appendChild(this.list[i].element);

	};

	OrderTicketList.prototype.push = function (orderTicketItem) {

		this.list.push(orderTicketItem);
		this.build();

	};

	return OrderTicketList;

})();

/* Player */

var Player = (function () {

	/**
	 * Player constructor
	 * @constructor
	 */
	function Player(element) {

		var self = this;

		this.element = element;
		this.video = false;

		this.config = {
			backgroundElementSelector: '.Player-background',
			innerElementSelector: '.Player-inner',
			selectAreaElementSelector: '.Player-selectArea'
		};

		this.pause = function () {

			if (self.video)	self.video.pause();

		};

		this.play = function () {

			if (self.video)	self.video.play();

		};

		this.stop = function () {

			if (self.video)	self.video.stop();

		};

		this.power = function () {

			var tag = document.createElement('script');

			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		};

		if (this.element)
			this.init();

	}

	Player.prototype.setVideo = function (video) {

		this.video = video;
		this.video.elementID = this.element.id;

		if (this.backgroundElement)
			this.backgroundElement.style.backgroundImage = 'url(https://i.ytimg.com/vi/' + this.video.id + '/hqdefault.jpg)';
		else
			this.element.style.backgroundImage = 'url(https://i.ytimg.com/vi/' + this.video.id + '/hqdefault.jpg)';

	};

	/**
	 * This function add a control listener to some button (controlElement)
	 * The listener is based on 'type' param
	 * The acceptable values to 'type' param is: play, pause and stop
	 * The default value is 'play'
	 * @param type
	 * @param controlElement
	 */
	Player.prototype.addControl = function (type, controlElement) {

		var self = this;

		switch (type) {

			case 'pause':
				self.addControlListener(controlElement, self.pause);
				break;
			case 'play':
				self.addControlListener(controlElement, self.play);
				break;
			case 'power':
				self.addControlListener(controlElement, self.power);
				break;
			case 'stop':
				self.addControlListener(controlElement, self.stop);
				break;
			default:
				self.addControlListener(controlElement, self.play);

		}

	};

	/**
	 * It's a advanced function to add a event listener to control element
	 * @param controlElement
	 * @param controlListener
	 */
	Player.prototype.addControlListener = function (controlElement, controlListener) {

		try {

			controlElement.addEventListener('click', controlListener);

		} catch (e) {

			if (controlElement)
				controlElement.attachEvent('onclick', controlListener);

		}

	};

	Player.prototype.getElements = function () {

		this.backgroundElement = this.element.querySelector(this.config.backgroundElementSelector);
		this.innerElement = this.element.querySelector(this.config.innerElementSelector);
		this.selectAreaElement = this.element.querySelector(this.config.selectAreaElementSelector);

	};

	Player.prototype.addListeners = function () {

		var self = this;

		if (this.selectAreaElement)
			self.addControlListener(this.selectAreaElement, self.power);
		else
			self.addControlListener(this.element, self.power);

	};

	Player.prototype.init = function () {

		this.getElements();
		this.addListeners();

	};

	return Player;

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

			}, 1);

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
					url: 'https://service.elbit.com.br/dalia-server/index.php',
					// url: 'https://service-elbit-com-br.umbler.net/dalia-server/index.php',
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

				if (self.quantity > 0) {

					ga('send', 'event', {
						eventCategory: 'TicketOptionSelect',
						eventAction: 'change',
						eventLabel: self.id
					});

				}

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

/* YouTubeVideo */

var YouTubeVideo = (function () {

	/**
	 * YouTubeVideo constructor
	 * @constructor
	 */
	function YouTubeVideo(id) {

		var self = this;

		this.id = id;
		this.player = false;
		this.elementID = false;

		window.onYouTubeIframeAPIReady = function() {

			self.player = new YT.Player(self.elementID, self.config);

		};

		this.onPlayerReady = function(event) {

			event.target.playVideo();

			console.log(self.formatTime(self.getCurrentTime()));
			setInterval(function () {

				console.log(self.formatTime(self.getCurrentTime()));

			}, 1000);

		};

		this.onPlayerStateChange = function(event) {

//				if (event.data == YT.PlayerState.PLAYING && !done) {
//						setTimeout(stopVideo, 6000);
//						done = true;
//				}

		};

		this.config = {
			height: '100%',
			width: '100%',
			videoId: self.id,
			playerVars: {
				'autoplay': 0,
				'color': 'white',
				'disablekb': 1,
				'iv_load_policy': 3,
				'modestbranding': 1,
				'rel': 0,
				'showinfo': 0,
				'theme': 'light'
			},
			events: {
				'onReady': self.onPlayerReady,
				'onStateChange': self.onPlayerStateChange
			}
		};

	}

	YouTubeVideo.prototype.pause = function () {

		this.player.pauseVideo();

	};

	YouTubeVideo.prototype.play = function () {

		this.player.playVideo();

	};

	YouTubeVideo.prototype.stop = function () {

		this.player.stopVideo();

	};

	YouTubeVideo.prototype.formatTime = function(time) {

		time = Math.round(time);

		// get minutes and seconds
		var minutes = Math.floor(time / 60);
		var seconds = time - minutes * 60;
		seconds = seconds < 10 ? '0' + seconds : seconds;

		return minutes + ":" + seconds;

	};

	YouTubeVideo.prototype.getCurrentTime = function () {

		return this.player.getCurrentTime()

	};

	YouTubeVideo.prototype.getDuration = function () {

		return this.player.getDuration();

	};

	return YouTubeVideo;

})();