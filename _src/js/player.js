
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