// gulp

import gulp from 'gulp';
import gulpif from 'gulp-if';
import browserSync from 'browser-sync';
import plumber from 'gulp-plumber';
import del from 'del';
import rename from 'gulp-rename';

//html

import htmlMin from 'gulp-htmlmin';

// css

import sass from 'sass';
import gulpSass from 'gulp-sass';
const scssToCss = gulpSass(sass);

import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import gcmq from 'gulp-group-css-media-queries';
import {
  stream as critical
} from 'critical';


// js

import webpack from 'webpack-stream';
import terser from 'gulp-terser';

// image
import gulpImage from 'gulp-image';
import gulpWebp from 'gulp-webp';
import gulpAvif from 'gulp-avif';


// server


let dev = false;

const myPath = {
  src: {
    base: 'src/',
    html: 'src/*.html',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/index.js',
    img: 'src/img/**/*.{jpg,svg,jpeg,png,gif}',
    imgF: 'src/img/**/*.{jpg,jpeg,png}',
    assets: ['src/fonts/**/*.*', 'src/icons/**/*.*'],
  },
  dist: {
    base: 'dist/',
    html: 'dist/',
    css: 'dist/css/',
    js: 'dist/js/',
    img: 'dist/img/',

  },
  watch: {
    html: 'src/*.html',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.*',
    img: 'src/img/**/*.{jpg,svg,jpeg,png,gif}',
    imgF: 'src/img/**/*.{jpg,jpeg,png}',
  }
};

export const html = () => gulp
  .src(myPath.src.html)
  .pipe(gulpif(!dev, htmlMin({
    removeComments: true,
    collapseWhitespace: true,
  })))
  .pipe(gulp.dest(myPath.dist.html))
  .pipe(browserSync.stream());

export const scss = () => gulp
  .src(myPath.src.scss)
  .pipe(gulpif(dev, sourcemaps.init()))
  .pipe(scssToCss().on('error', scssToCss.logError))
  .pipe(gulpif(!dev, autoprefixer(({
    cascade: false,
  }))))
  .pipe(gulpif(!dev, gcmq()))
  .pipe(gulpif(!dev, gulp.dest(myPath.dist.css)))
  .pipe(gulpif(!dev, cleanCSS({
    2: {
      specialComments: 0,
    }
  })))
  .pipe(rename({suffix: '.min'}))
  .pipe(gulpif(dev, sourcemaps.write()))
  .pipe(gulp.dest(myPath.dist.css))
  .pipe(browserSync.stream());


const configWebpack = {
  mode: dev ? 'development' : 'production',
  devtool: false,
  optimization: {
    minimize: false,
  },
  output: {
    filename: 'index.js'
  },
  module: {
    rules: []
  }
};

if (!dev) {
  configWebpack.module.rules.push({
    test: /\.(js)$/,
    exclude: /(node_modules)/,
    loader: 'babel-loader',
    options:{
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-transform-runtime']
    }
  });
}

export const js = () => gulp
  .src(myPath.src.js)
  .pipe(plumber())
  .pipe(webpack(configWebpack))
  .pipe(gulpif(!dev, gulp.dest(myPath.dist.js)))
  .pipe(gulpif(!dev, terser()))
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(gulpif(!dev, gulp.dest(myPath.dist.js)))
  .pipe(gulp.dest(myPath.dist.js))
  .pipe(browserSync.stream());


const image = () => gulp
  .src(myPath.src.img)
  .pipe(gulpif(!dev, gulpImage({
    optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
    pngquant: ['--speed=1', '--force', 256],
    zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
    jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
    mozjpeg: ['-optimize', '-progressive'],
    gifsicle: ['--optimize'],
    svgo: ['--enable', 'cleanupIDs', '--disable', 'convertColors']
  })))
  .pipe(gulp.dest(myPath.dist.img))
  .pipe(browserSync.stream({
    once: true,
    })
  );

const webp = () => gulp
  .src(myPath.src.imgF)
  .pipe(gulpWebp({
    quality: dev ? 100 : 70
  }))
  .pipe(gulp.dest(myPath.dist.img))
  .pipe(browserSync.stream({
      once: true,
    })
  );

export const avif = () => gulp
  .src(myPath.src.imgF)
  .pipe(gulpAvif({
    quality: dev ? 100 : 50
  }))
  .pipe(gulp.dest(myPath.dist.img))
  .pipe(browserSync.stream({
      once: true,
    })
  );

export const copy = () => gulp
  .src(myPath.src.assets, {
    base: myPath.src.base
  })
  .pipe(gulp.dest(myPath.dist.base))
  .pipe(browserSync.stream({
    once: true
  }));


export const server = () => {
  browserSync.init({
    ui: false,
    notify: false,
    host: 'localhost',
    // tunnel: true,
    server: {
      baseDir: myPath.dist.base,
    }
  });

  gulp.watch(myPath.watch.html, html);
  gulp.watch(myPath.watch.scss, scss);
  gulp.watch(myPath.watch.js, js);
  gulp.watch(myPath.watch.img, image);
  gulp.watch(myPath.watch.imgF, gulp.parallel(webp, avif));
  gulp.watch(myPath.src.assets, copy);
};


export const clear = () => del(myPath.dist.base, {
  force: true,
});

const develop = (ready) => {
  dev = true;
  ready();
};

export const base = gulp.parallel(html, scss, js, image, avif, webp, copy);

export const build = gulp.series(clear, base);

export default gulp.series(develop, base, server);
