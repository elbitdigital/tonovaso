/*!
 * Elbit Tô No Vaso Project v0.0.0 (http://elbit.com.br/)
 * Copyright 2013-2016 Elbit Developers
 * Licensed under MIT (https://github.com/elbitdigital/base/blob/master/LICENSE)
*/
/* Select */

var Select = (function () {

	/**
	 * Select constructor
	 * @constructor
	 */
	function Select(element) {

		this.element = element;

		this.config = {
			innerElementSelector: '.Select-inner',
			valueElementSelector: '.Select-value',
			selectElementSelector: '.Select-select'
		};

		if (this.element)
			this.init();

	}

	Select.prototype.updateValue = function () {

		try {

			this.valueElement.innerHTML = '';

			var valueTextElement = document.createElement('span');
			valueTextElement.innerText = this.selectElement.value;

			this.valueElement.appendChild(valueTextElement);

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