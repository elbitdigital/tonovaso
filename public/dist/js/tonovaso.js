

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

		console.log(this);

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

			// transactions.child(transaction.reference).set(transaction);

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
				// url: 'https://service.elbit.com.br/dalia-server/index.php',
				url: 'https://service-elbit-com-br.umbler.net/dalia-server/test.php',
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