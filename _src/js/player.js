
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
		this.element.style.backgroundImage = 'url(http://i.ytimg.com/vi/' + this.video.id + '/hqdefault.jpg)';

	};

	Player.prototype.addListeners = function () {

		var self = this;

		try {

			this.element.addEventListener('click', self.power);

		} catch (e) { }

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

	Player.prototype.init = function () {

		this.addListeners();

	};

	return Player;

})();