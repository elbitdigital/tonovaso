
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