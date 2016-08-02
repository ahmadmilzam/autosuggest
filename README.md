======
Gulp Starter For Dummy
======

# Installation

To use Gulp, your computer needs [Node.js](https://nodejs.org/en/) 0.12 or greater.

## Getting Started

#### 1. Install gulp globally:

__If you have previously installed a version of gulp globally, please run `npm rm --global gulp`
to make sure your old version doesn't collide with gulp-cli.__

```sh
$ npm install --global gulp-cli
```

#### 2. Install gulp and other npm required packages to your local drive:

```sh
$ npm install
```

#### 3. Install some packages from bower:

```sh
$ bower install
```

#### 4. Run gulp:

```sh
$ gulp
```

The default task will run and create static local server plus watching your files for any changes.


```sh
$ gulp build --production
```
This command will minify your css and js files for production.

To run individual tasks, use `gulp <task> <othertask>`.

## Where do I go now?

You have a starter gulpfile and everything is installed. Check out the [Gulp docs](https://github.com/gulpjs/gulp/tree/master/docs) for more information.

## .src, .watch, .dest, CLI args - How do I use these things?

For API specific documentation you can check out the [documentation for that](https://github.com/gulpjs/gulp/blob/master/docs/API.md).

## Available Plugins

The gulp community is growing, with new plugins being added daily. See the [main website](http://gulpjs.com/plugins/) for a complete list.