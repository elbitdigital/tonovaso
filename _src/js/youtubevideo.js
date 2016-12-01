
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