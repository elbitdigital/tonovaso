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