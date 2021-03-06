const _PROJECTNAME = 'tonovaso';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	batch = require('gulp-batch'),
	print = require('gulp-print'),
	plumber = require('gulp-plumber'),
	concat = require('gulp-concat'),
	concatCSS = require('gulp-concat-css'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	imageResize = require('gulp-image-resize'),
	tinypng = require('gulp-tinypng'),

	browserSync = require('browser-sync').create();

/*
 * To use the gulp-image-resize, it needs of some dependencies:
 * https://www.npmjs.com/package/gulp-image-resize
 *
 * Or, install:
 *
 * Ubuntu:
 * apt-get install imagemagick
 * apt-get install graphicsmagick
 *
 * Mac:
 * brew install imagemagick
 * brew install graphicsmagick
 *
 * Windows & others:
 * http://www.imagemagick.org/script/binary-releases.php
 * */

const tinypngToken = 'c8yyMiCZDZU7wE4SWDTxiKdNcEq7krZU';

// Source Content structure

var source = {
	content: '*',
	location: './_src/'
};

source.css = {
	content: '**/*.css',
	location: source.location + 'css/'
};

source.js = {
	content: '*.js',
	location: source.location + 'js/'
};

source.index = {
	content: '**/*.html',
	location: source.location
};

source.images = {
	content: '*.*',
	location: source.location + 'img/'
};

source.images.backgroundElement = {
	content: '*.*',
	location: source.images.location + 'backgroundElement/'
};

source.images.logo = {
	content: '*.*',
	location: source.images.location + 'logo/'
};

source.images.artists = {
	content: '*.*',
	location: source.images.location + 'artists/'
};

source.images.artistsEletronicSunset = {
	content: '*.*',
	location: source.images.location + 'artistsEletronicSunset/'
};

source.images.lineup = {
	content: '*.*',
	location: source.images.location + 'lineup/'
};

source.images.uniform = {
	content: '*.*',
	location: source.images.location + 'uniform/'
};

// Public Content structure

var public = {
	location: './public/'
};

// Dist Content structure

var dist = {
	content: '*',
	location: public.location + 'dist/'
};

dist.css = {
	content: '*.css',
	location: dist.location + 'css/'
};

dist.js = {
	content: '*.js',
	location: dist.location + 'js/'
};

dist.images = {
	content: '*.*',
	location: dist.location + 'img/'
};

dist.images.backgroundElement = {
	content: '*.*',
	location: dist.images.location + 'backgroundElement/'
};

dist.images.logo = {
	content: '*.*',
	location: dist.images.location + 'logo/'
};

dist.images.artists = {
	content: '*.*',
	location: dist.images.location + 'artists/'
};

dist.images.artistsEletronicSunset = {
	content: '*.*',
	location: dist.images.location + 'artistsEletronicSunset/'
};

dist.images.lineup = {
	content: '*.*',
	location: dist.images.location + 'lineup/'
};

dist.images.uniform = {
	content: '*.*',
	location: dist.images.location + 'uniform/'
};

// CSS

gulp.task('css', function() {
	gulp.src(source.css.location + source.css.content)
		.pipe(concatCSS(_PROJECTNAME + '.css'))
		.pipe(gulp.dest(dist.css.location))
		.pipe(plumber())
		.pipe(cleanCSS())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest(dist.css.location));
});

gulp.task('css-watch', ['css'], function () {
	watch(source.css.location + source.css.content, batch(function (events, done) {
		gulp.start('css', done);
		browserSync.reload();
	}));
});

// JS

gulp.task('js', function() {
	gulp.src(source.js.location + source.js.content)
		.pipe(concat(_PROJECTNAME + '.js'))
		.pipe(gulp.dest(dist.js.location))
		.pipe(plumber())
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest(dist.js.location));
});

gulp.task('js-watch', ['js'], function () {
	watch(source.js.location + source.js.content, batch(function (events, done) {
		gulp.start('js', done);
		browserSync.reload();
	}));
});

// IMAGES

gulp.task('resizePhotos', function () {
	gulp.src(source.images.location + source.images.content)
		.pipe(imageResize({
			height : 960,
			upscale : false
		}))
		.pipe(gulp.dest(dist.location.images.location));
});

gulp.task('resizeBackgroundElement', function () {
	gulp.src(source.images.backgroundElement.location + source.images.backgroundElement.content)
		.pipe(imageResize({
			height : 1536,
			upscale : false
		}))
		.pipe(gulp.dest(dist.images.backgroundElement.location));
});

gulp.task('resizeLogo', function () {
	gulp.src(source.images.logo.location + source.images.logo.content)
		.pipe(imageResize({
			height : 576,
			upscale : false
		}))
		.pipe(tinypng(tinypngToken))
		.pipe(gulp.dest(dist.images.logo.location));
	gulp.src(source.images.logo.location + source.images.logo.content)
		.pipe(imageResize({
			height : 256,
			upscale : false
		}))
		.pipe(tinypng(tinypngToken))
		.pipe(gulp.dest(dist.images.logo.location + 'small/'));
});

gulp.task('resizeArtists', function () {
	gulp.src(source.images.artists.location + source.images.artists.content)
		.pipe(imageResize({
			height : 480,
			upscale : false
		}))
		.pipe(gulp.dest(dist.images.artists.location));
	gulp.src(source.images.artists.location + source.images.artists.content)
		.pipe(imageResize({
			height : 288,
			upscale : false
		}))
		.pipe(gulp.dest(dist.images.artists.location + 'small/'));
});

gulp.task('resizeArtistsEletronicSunset', function () {
	gulp.src(source.images.artistsEletronicSunset.location + source.images.artistsEletronicSunset.content)
		.pipe(imageResize({
			height : 320,
			upscale : false
		}))
		.pipe(tinypng(tinypngToken))
		.pipe(gulp.dest(dist.images.artistsEletronicSunset.location));
	gulp.src(source.images.artistsEletronicSunset.location + source.images.artistsEletronicSunset.content)
		.pipe(imageResize({
			height : 180,
			upscale : false
		}))
		.pipe(tinypng(tinypngToken))
		.pipe(gulp.dest(dist.images.artistsEletronicSunset.location + 'small/'));
});

gulp.task('resizeLineup', function () {
	gulp.src(source.images.lineup.location + source.images.lineup.content)
		.pipe(imageResize({
			height : 672,
			upscale : false
		}))
		.pipe(tinypng(tinypngToken))
		.pipe(gulp.dest(dist.images.lineup.location));
	gulp.src(source.images.lineup.location + source.images.lineup.content)
		.pipe(imageResize({
			height : 384,
			upscale : false
		}))
		.pipe(tinypng(tinypngToken))
		.pipe(gulp.dest(dist.images.lineup.location + 'small/'));
});

gulp.task('resizeUniform', function () {
	gulp.src(source.images.uniform.location + source.images.uniform.content)
		.pipe(imageResize({
			width : 576,
			upscale : false
		}))
		.pipe(tinypng(tinypngToken))
		.pipe(gulp.dest(dist.images.uniform.location));
	gulp.src(source.images.uniform.location + source.images.uniform.content)
		.pipe(imageResize({
			width : 376,
			upscale : false
		}))
		.pipe(tinypng(tinypngToken))
		.pipe(gulp.dest(dist.images.uniform.location + 'small/'));
});

gulp.task('tinyUniformImages', function () {
	if (tinypngToken)
		gulp.src(source.images.location + 'uniformImages/' + source.images.content)
			.pipe(tinypng(tinypngToken))
			.pipe(gulp.dest(source.images.location + 'uniformImages/done'));
	else
		console.log('TinyPNG Token Required');
});

// SERVER

gulp.task('serve', function () {

	// Serve files from the root of this project
	browserSync.init({
		server: {
			baseDir: "./public/",
			index: "index.html",
			routes: {
				"/home": "./public/index.html",
				"/tickets": "./public/tickets.html",
				"/ingressos": "./public/tickets.html",
				"/20-anos": "./public/20-anos.html",
				"/contato": "./public/contato.html",
				"/administracao/acesso": "./public/administracao/acesso.html",
				"/administracao/retirada": "./public/administracao/retirada.html",
				"/administracao/homologacao": "./public/administracao/homologacao.html",
				"/administracao/confirmacao": "./public/administracao/confirmacao.html",
				"/administracao/sair": "./public/administracao/sair.html",
				"/admin/login": "./public/admin/login.html",
				"/admin/logout": "./public/admin/logout.html",
				"/admin/signup": "./public/admin/signup.html",
				"/admin/confirmation": "./public/admin/confirmation.html"
			}
		},
		ghostMode: false
	});

	gulp.watch(source.index.content).on('change', browserSync.reload);

});

gulp.task('default', ['serve', 'css-watch', 'js-watch']);