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