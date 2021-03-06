;(function(){


// CommonJS require()

  function require(p){
    var path = require.resolve(p)
        , mod = require.modules[path];
    if (!mod) throw new Error('failed to require "' + p + '"');
    if (!mod.exports) {
      mod.exports = {};
      mod.call(mod.exports, mod, mod.exports, require.relative(path));
    }
    return mod.exports;
  }

  require.modules = {};

  require.resolve = function (path){
    var orig = path
        , reg = path + '.js'
        , index = path + '/index.js';
    return require.modules[reg] && reg
        || require.modules[index] && index
        || orig;
  };

  require.register = function (path, fn){
    require.modules[path] = fn;
  };

  require.relative = function (parent) {
    return function(p){
      if ('.' != p.charAt(0)) return require(p);

      var path = parent.split('/')
          , segs = p.split('/');
      path.pop();

      for (var i = 0; i < segs.length; i++) {
        var seg = segs[i];
        if ('..' == seg) path.pop();
        else if ('.' != seg) path.push(seg);
      }

      return require(path.join('/'));
    };
  };


  require.register("browser/debug.js", function(module, exports, require){

    module.exports = function(type){
      return function(){

      }
    };
  }); // module: browser/debug.js

  require.register("browser/diff.js", function(module, exports, require){

  }); // module: browser/diff.js

  require.register("browser/events.js", function(module, exports, require){

    /**
     * Module exports.
     */

    exports.EventEmitter = EventEmitter;

    /**
     * Check if `obj` is an array.
     */

    function isArray(obj) {
      return '[object Array]' == {}.toString.call(obj);
    }

    /**
     * Event emitter constructor.
     *
     * @api public
     */

    function EventEmitter(){};

    /**
     * Adds a listener.
     *
     * @api public
     */

    EventEmitter.prototype.on = function (name, fn) {
      if (!this.$events) {
        this.$events = {};
      }

      if (!this.$events[name]) {
        this.$events[name] = fn;
      } else if (isArray(this.$events[name])) {
        this.$events[name].push(fn);
      } else {
        this.$events[name] = [this.$events[name], fn];
      }

      return this;
    };

    EventEmitter.prototype.addListener = EventEmitter.prototype.on;

    /**
     * Adds a volatile listener.
     *
     * @api public
     */

    EventEmitter.prototype.once = function (name, fn) {
      var self = this;

      function on () {
        self.removeListener(name, on);
        fn.apply(this, arguments);
      };

      on.listener = fn;
      this.on(name, on);

      return this;
    };

    /**
     * Removes a listener.
     *
     * @api public
     */

    EventEmitter.prototype.removeListener = function (name, fn) {
      if (this.$events && this.$events[name]) {
        var list = this.$events[name];

        if (isArray(list)) {
          var pos = -1;

          for (var i = 0, l = list.length; i < l; i++) {
            if (list[i] === fn || (list[i].listener && list[i].listener === fn)) {
              pos = i;
              break;
            }
          }

          if (pos < 0) {
            return this;
          }

          list.splice(pos, 1);

          if (!list.length) {
            delete this.$events[name];
          }
        } else if (list === fn || (list.listener && list.listener === fn)) {
          delete this.$events[name];
        }
      }

      return this;
    };

    /**
     * Removes all listeners for an event.
     *
     * @api public
     */

    EventEmitter.prototype.removeAllListeners = function (name) {
      if (name === undefined) {
        this.$events = {};
        return this;
      }

      if (this.$events && this.$events[name]) {
        this.$events[name] = null;
      }

      return this;
    };

    /**
     * Gets all listeners for a certain event.
     *
     * @api public
     */

    EventEmitter.prototype.listeners = function (name) {
      if (!this.$events) {
        this.$events = {};
      }

      if (!this.$events[name]) {
        this.$events[name] = [];
      }

      if (!isArray(this.$events[name])) {
        this.$events[name] = [this.$events[name]];
      }

      return this.$events[name];
    };

    /**
     * Emits an event.
     *
     * @api public
     */

    EventEmitter.prototype.emit = function (name) {
      if (!this.$events) {
        return false;
      }

      var handler = this.$events[name];

      if (!handler) {
        return false;
      }

      var args = [].slice.call(arguments, 1);

      if ('function' == typeof handler) {
        handler.apply(this, args);
      } else if (isArray(handler)) {
        var listeners = handler.slice();

        for (var i = 0, l = listeners.length; i < l; i++) {
          listeners[i].apply(this, args);
        }
      } else {
        return false;
      }

      return true;
    };
  }); // module: browser/events.js

  require.register("browser/fs.js", function(module, exports, require){

  }); // module: browser/fs.js

  require.register("browser/path.js", function(module, exports, require){

  }); // module: browser/path.js

  require.register("browser/progress.js", function(module, exports, require){

    /**
     * Expose `Progress`.
     */

    module.exports = Progress;

    /**
     * Initialize a new `Progress` indicator.
     */

    function Progress() {
      this.percent = 0;
      this.size(0);
      this.fontSize(11);
      this.font('helvetica, arial, sans-serif');
    }

    /**
     * Set progress size to `n`.
     *
     * @param {Number} n
     * @return {Progress} for chaining
     * @api public
     */

    Progress.prototype.size = function(n){
      this._size = n;
      return this;
    };

    /**
     * Set text to `str`.
     *
     * @param {String} str
     * @return {Progress} for chaining
     * @api public
     */

    Progress.prototype.text = function(str){
      this._text = str;
      return this;
    };

    /**
     * Set font size to `n`.
     *
     * @param {Number} n
     * @return {Progress} for chaining
     * @api public
     */

    Progress.prototype.fontSize = function(n){
      this._fontSize = n;
      return this;
    };

    /**
     * Set font `family`.
     *
     * @param {String} family
     * @return {Progress} for chaining
     */

    Progress.prototype.font = function(family){
      this._font = family;
      return this;
    };

    /**
     * Update percentage to `n`.
     *
     * @param {Number} n
     * @return {Progress} for chaining
     */

    Progress.prototype.update = function(n){
      this.percent = n;
      return this;
    };

    /**
     * Draw on `ctx`.
     *
     * @param {CanvasRenderingContext2d} ctx
     * @return {Progress} for chaining
     */

    Progress.prototype.draw = function(ctx){
      var percent = Math.min(this.percent, 100)
          , size = this._size
          , half = size / 2
          , x = half
          , y = half
          , rad = half - 1
          , fontSize = this._fontSize;

      ctx.font = fontSize + 'px ' + this._font;

      var angle = Math.PI * 2 * (percent / 100);
      ctx.clearRect(0, 0, size, size);

      // outer circle
      ctx.strokeStyle = '#9f9f9f';
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, angle, false);
      ctx.stroke();

      // inner circle
      ctx.strokeStyle = '#eee';
      ctx.beginPath();
      ctx.arc(x, y, rad - 1, 0, angle, true);
      ctx.stroke();

      // text
      var text = this._text || (percent | 0) + '%'
          , w = ctx.measureText(text).width;

      ctx.fillText(
          text
          , x - w / 2 + 1
          , y + fontSize / 2 - 1);

      return this;
    };

  }); // module: browser/progress.js

  require.register("browser/tty.js", function(module, exports, require){

    exports.isatty = function(){
      return true;
    };

    exports.getWindowSize = function(){
      return [window.innerHeight, window.innerWidth];
    };
  }); // module: browser/tty.js

  require.register("context.js", function(module, exports, require){

    /**
     * Expose `Context`.
     */

    module.exports = Context;

    /**
     * Initialize a new `Context`.
     *
     * @api private
     */

    function Context(){}

    /**
     * Set or get the context `Runnable` to `runnable`.
     *
     * @param {Runnable} runnable
     * @return {Context}
     * @api private
     */

    Context.prototype.runnable = function(runnable){
      if (0 == arguments.length) return this._runnable;
      this.test = this._runnable = runnable;
      return this;
    };

    /**
     * Set test timeout `ms`.
     *
     * @param {Number} ms
     * @return {Context} self
     * @api private
     */

    Context.prototype.timeout = function(ms){
      this.runnable().timeout(ms);
      return this;
    };

    /**
     * Set test slowness threshold `ms`.
     *
     * @param {Number} ms
     * @return {Context} self
     * @api private
     */

    Context.prototype.slow = function(ms){
      this.runnable().slow(ms);
      return this;
    };

    /**
     * Inspect the context void of `._runnable`.
     *
     * @return {String}
     * @api private
     */

    Context.prototype.inspect = function(){
      return JSON.stringify(this, function(key, val){
        if ('_runnable' == key) return;
        if ('test' == key) return;
        return val;
      }, 2);
    };

  }); // module: context.js

  require.register("hook.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Runnable = require('./runnable');

    /**
     * Expose `Hook`.
     */

    module.exports = Hook;

    /**
     * Initialize a new `Hook` with the given `title` and callback `fn`.
     *
     * @param {String} title
     * @param {Function} fn
     * @api private
     */

    function Hook(title, fn) {
      Runnable.call(this, title, fn);
      this.type = 'hook';
    }

    /**
     * Inherit from `Runnable.prototype`.
     */

    Hook.prototype = new Runnable;
    Hook.prototype.constructor = Hook;


    /**
     * Get or set the test `err`.
     *
     * @param {Error} err
     * @return {Error}
     * @api public
     */

    Hook.prototype.error = function(err){
      if (0 == arguments.length) {
        var err = this._error;
        this._error = null;
        return err;
      }

      this._error = err;
    };


  }); // module: hook.js

  require.register("interfaces/bdd.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Suite = require('../suite')
        , Test = require('../test');

    /**
     * BDD-style interface:
     *
     *      describe('Array', function(){
 *        describe('#indexOf()', function(){
 *          it('should return -1 when not present', function(){
 *
 *          });
 *
 *          it('should return the index when present', function(){
 *
 *          });
 *        });
 *      });
     *
     */

    module.exports = function(suite){
      var suites = [suite];

      suite.on('pre-require', function(context, file, mocha){

        /**
         * Execute before running tests.
         */

        context.before = function(fn){
          suites[0].beforeAll(fn);
        };

        /**
         * Execute after running tests.
         */

        context.after = function(fn){
          suites[0].afterAll(fn);
        };

        /**
         * Execute before each test case.
         */

        context.beforeEach = function(fn){
          suites[0].beforeEach(fn);
        };

        /**
         * Execute after each test case.
         */

        context.afterEach = function(fn){
          suites[0].afterEach(fn);
        };

        /**
         * Describe a "suite" with the given `title`
         * and callback `fn` containing nested suites
         * and/or tests.
         */

        context.describe = context.context = function(title, fn){
          var suite = Suite.create(suites[0], title);
          suites.unshift(suite);
          fn.call(suite);
          suites.shift();
          return suite;
        };

        /**
         * Pending describe.
         */

        context.xdescribe =
            context.xcontext =
                context.describe.skip = function(title, fn){
                  var suite = Suite.create(suites[0], title);
                  suite.pending = true;
                  suites.unshift(suite);
                  fn.call(suite);
                  suites.shift();
                };

        /**
         * Exclusive suite.
         */

        context.describe.only = function(title, fn){
          var suite = context.describe(title, fn);
          mocha.grep(suite.fullTitle());
        };

        /**
         * Describe a specification or test-case
         * with the given `title` and callback `fn`
         * acting as a thunk.
         */

        context.it = context.specify = function(title, fn){
          var suite = suites[0];
          if (suite.pending) var fn = null;
          var test = new Test(title, fn);
          suite.addTest(test);
          return test;
        };

        /**
         * Exclusive test-case.
         */

        context.it.only = function(title, fn){
          var test = context.it(title, fn);
          mocha.grep(test.fullTitle());
        };

        /**
         * Pending test case.
         */

        context.xit =
            context.xspecify =
                context.it.skip = function(title){
                  context.it(title);
                };
      });
    };

  }); // module: interfaces/bdd.js

  require.register("interfaces/exports.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Suite = require('../suite')
        , Test = require('../test');

    /**
     * TDD-style interface:
     *
     *     exports.Array = {
 *       '#indexOf()': {
 *         'should return -1 when the value is not present': function(){
 *
 *         },
 *
 *         'should return the correct index when the value is present': function(){
 *
 *         }
 *       }
 *     };
     *
     */

    module.exports = function(suite){
      var suites = [suite];

      suite.on('require', visit);

      function visit(obj) {
        var suite;
        for (var key in obj) {
          if ('function' == typeof obj[key]) {
            var fn = obj[key];
            switch (key) {
              case 'before':
                suites[0].beforeAll(fn);
                break;
              case 'after':
                suites[0].afterAll(fn);
                break;
              case 'beforeEach':
                suites[0].beforeEach(fn);
                break;
              case 'afterEach':
                suites[0].afterEach(fn);
                break;
              default:
                suites[0].addTest(new Test(key, fn));
            }
          } else {
            var suite = Suite.create(suites[0], key);
            suites.unshift(suite);
            visit(obj[key]);
            suites.shift();
          }
        }
      }
    };
  }); // module: interfaces/exports.js

  require.register("interfaces/index.js", function(module, exports, require){

    exports.bdd = require('./bdd');
    exports.tdd = require('./tdd');
    exports.qunit = require('./qunit');
    exports.exports = require('./exports');

  }); // module: interfaces/index.js

  require.register("interfaces/qunit.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Suite = require('../suite')
        , Test = require('../test');

    /**
     * QUnit-style interface:
     *
     *     suite('Array');
     *
     *     test('#length', function(){
 *       var arr = [1,2,3];
 *       ok(arr.length == 3);
 *     });
     *
     *     test('#indexOf()', function(){
 *       var arr = [1,2,3];
 *       ok(arr.indexOf(1) == 0);
 *       ok(arr.indexOf(2) == 1);
 *       ok(arr.indexOf(3) == 2);
 *     });
     *
     *     suite('String');
     *
     *     test('#length', function(){
 *       ok('foo'.length == 3);
 *     });
     *
     */

    module.exports = function(suite){
      var suites = [suite];

      suite.on('pre-require', function(context){

        /**
         * Execute before running tests.
         */

        context.before = function(fn){
          suites[0].beforeAll(fn);
        };

        /**
         * Execute after running tests.
         */

        context.after = function(fn){
          suites[0].afterAll(fn);
        };

        /**
         * Execute before each test case.
         */

        context.beforeEach = function(fn){
          suites[0].beforeEach(fn);
        };

        /**
         * Execute after each test case.
         */

        context.afterEach = function(fn){
          suites[0].afterEach(fn);
        };

        /**
         * Describe a "suite" with the given `title`.
         */

        context.suite = function(title){
          if (suites.length > 1) suites.shift();
          var suite = Suite.create(suites[0], title);
          suites.unshift(suite);
        };

        /**
         * Describe a specification or test-case
         * with the given `title` and callback `fn`
         * acting as a thunk.
         */

        context.test = function(title, fn){
          suites[0].addTest(new Test(title, fn));
        };
      });
    };

  }); // module: interfaces/qunit.js

  require.register("interfaces/tdd.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Suite = require('../suite')
        , Test = require('../test');

    /**
     * TDD-style interface:
     *
     *      suite('Array', function(){
 *        suite('#indexOf()', function(){
 *          suiteSetup(function(){
 *
 *          });
 *
 *          test('should return -1 when not present', function(){
 *
 *          });
 *
 *          test('should return the index when present', function(){
 *
 *          });
 *
 *          suiteTeardown(function(){
 *
 *          });
 *        });
 *      });
     *
     */

    module.exports = function(suite){
      var suites = [suite];

      suite.on('pre-require', function(context, file, mocha){

        /**
         * Execute before each test case.
         */

        context.setup = function(fn){
          suites[0].beforeEach(fn);
        };

        /**
         * Execute after each test case.
         */

        context.teardown = function(fn){
          suites[0].afterEach(fn);
        };

        /**
         * Execute before the suite.
         */

        context.suiteSetup = function(fn){
          suites[0].beforeAll(fn);
        };

        /**
         * Execute after the suite.
         */

        context.suiteTeardown = function(fn){
          suites[0].afterAll(fn);
        };

        /**
         * Describe a "suite" with the given `title`
         * and callback `fn` containing nested suites
         * and/or tests.
         */

        context.suite = function(title, fn){
          var suite = Suite.create(suites[0], title);
          suites.unshift(suite);
          fn.call(suite);
          suites.shift();
          return suite;
        };

        /**
         * Exclusive test-case.
         */

        context.suite.only = function(title, fn){
          var suite = context.suite(title, fn);
          mocha.grep(suite.fullTitle());
        };

        /**
         * Describe a specification or test-case
         * with the given `title` and callback `fn`
         * acting as a thunk.
         */

        context.test = function(title, fn){
          var test = new Test(title, fn);
          suites[0].addTest(test);
          return test;
        };

        /**
         * Exclusive test-case.
         */

        context.test.only = function(title, fn){
          var test = context.test(title, fn);
          mocha.grep(test.fullTitle());
        };

        /**
         * Pending test case.
         */

        context.test.skip = function(title){
          context.test(title);
        };
      });
    };

  }); // module: interfaces/tdd.js

  require.register("mocha.js", function(module, exports, require){
    /*!
     * mocha
     * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
     * MIT Licensed
     */

    /**
     * Module dependencies.
     */

    var path = require('browser/path')
        , utils = require('./utils');

    /**
     * Expose `Mocha`.
     */

    exports = module.exports = Mocha;

    /**
     * Expose internals.
     */

    exports.utils = utils;
    exports.interfaces = require('./interfaces');
    exports.reporters = require('./reporters');
    exports.Runnable = require('./runnable');
    exports.Context = require('./context');
    exports.Runner = require('./runner');
    exports.Suite = require('./suite');
    exports.Hook = require('./hook');
    exports.Test = require('./test');

    /**
     * Return image `name` path.
     *
     * @param {String} name
     * @return {String}
     * @api private
     */

    function image(name) {
      return __dirname + '/../images/' + name + '.png';
    }

    /**
     * Setup mocha with `options`.
     *
     * Options:
     *
     *   - `ui` name "bdd", "tdd", "exports" etc
     *   - `reporter` reporter instance, defaults to `mocha.reporters.Dot`
     *   - `globals` array of accepted globals
     *   - `timeout` timeout in milliseconds
     *   - `slow` milliseconds to wait before considering a test slow
     *   - `ignoreLeaks` ignore global leaks
     *   - `grep` string or regexp to filter tests with
     *
     * @param {Object} options
     * @api public
     */

    function Mocha(options) {
      options = options || {};
      this.files = [];
      this.options = options;
      this.grep(options.grep);
      this.suite = new exports.Suite('', new exports.Context);
      this.ui(options.ui);
      this.reporter(options.reporter);
      if (options.timeout) this.timeout(options.timeout);
      if (options.slow) this.slow(options.slow);
    }

    /**
     * Add test `file`.
     *
     * @param {String} file
     * @api public
     */

    Mocha.prototype.addFile = function(file){
      this.files.push(file);
      return this;
    };

    /**
     * Set reporter to `reporter`, defaults to "dot".
     *
     * @param {String|Function} reporter name of a reporter or a reporter constructor
     * @api public
     */

    Mocha.prototype.reporter = function(reporter){
      if ('function' == typeof reporter) {
        this._reporter = reporter;
      } else {
        reporter = reporter || 'dot';
        try {
          this._reporter = require('./reporters/' + reporter);
        } catch (err) {
          this._reporter = require(reporter);
        }
        if (!this._reporter) throw new Error('invalid reporter "' + reporter + '"');
      }
      return this;
    };

    /**
     * Set test UI `name`, defaults to "bdd".
     *
     * @param {String} bdd
     * @api public
     */

    Mocha.prototype.ui = function(name){
      name = name || 'bdd';
      this._ui = exports.interfaces[name];
      if (!this._ui) throw new Error('invalid interface "' + name + '"');
      this._ui = this._ui(this.suite);
      return this;
    };

    /**
     * Load registered files.
     *
     * @api private
     */

    Mocha.prototype.loadFiles = function(fn){
      var self = this;
      var suite = this.suite;
      var pending = this.files.length;
      this.files.forEach(function(file){
        file = path.resolve(file);
        suite.emit('pre-require', global, file, self);
        suite.emit('require', require(file), file, self);
        suite.emit('post-require', global, file, self);
        --pending || (fn && fn());
      });
    };

    /**
     * Enable growl support.
     *
     * @api private
     */

    Mocha.prototype._growl = function(runner, reporter) {
      var notify = require('growl');

      runner.on('end', function(){
        var stats = reporter.stats;
        if (stats.failures) {
          var msg = stats.failures + ' of ' + runner.total + ' tests failed';
          notify(msg, { name: 'mocha', title: 'Failed', image: image('error') });
        } else {
          notify(stats.passes + ' tests passed in ' + stats.duration + 'ms', {
            name: 'mocha'
            , title: 'Passed'
            , image: image('ok')
          });
        }
      });
    };

    /**
     * Add regexp to grep, if `re` is a string it is escaped.
     *
     * @param {RegExp|String} re
     * @return {Mocha}
     * @api public
     */

    Mocha.prototype.grep = function(re){
      this.options.grep = 'string' == typeof re
          ? new RegExp(utils.escapeRegexp(re))
          : re;
      return this;
    };

    /**
     * Invert `.grep()` matches.
     *
     * @return {Mocha}
     * @api public
     */

    Mocha.prototype.invert = function(){
      this.options.invert = true;
      return this;
    };

    /**
     * Ignore global leaks.
     *
     * @return {Mocha}
     * @api public
     */

    Mocha.prototype.ignoreLeaks = function(){
      this.options.ignoreLeaks = true;
      return this;
    };

    /**
     * Enable global leak checking.
     *
     * @return {Mocha}
     * @api public
     */

    Mocha.prototype.checkLeaks = function(){
      this.options.ignoreLeaks = false;
      return this;
    };

    /**
     * Enable growl support.
     *
     * @return {Mocha}
     * @api public
     */

    Mocha.prototype.growl = function(){
      this.options.growl = true;
      return this;
    };

    /**
     * Ignore `globals` array or string.
     *
     * @param {Array|String} globals
     * @return {Mocha}
     * @api public
     */

    Mocha.prototype.globals = function(globals){
      this.options.globals = (this.options.globals || []).concat(globals);
      return this;
    };

    /**
     * Set the timeout in milliseconds.
     *
     * @param {Number} timeout
     * @return {Mocha}
     * @api public
     */

    Mocha.prototype.timeout = function(timeout){
      this.suite.timeout(timeout);
      return this;
    };

    /**
     * Set slowness threshold in milliseconds.
     *
     * @param {Number} slow
     * @return {Mocha}
     * @api public
     */

    Mocha.prototype.slow = function(slow){
      this.suite.slow(slow);
      return this;
    };

    /**
     * Makes all tests async (accepting a callback)
     *
     * @return {Mocha}
     * @api public
     */

    Mocha.prototype.asyncOnly = function(){
      this.options.asyncOnly = true;
      return this;
    };

    /**
     * Run tests and invoke `fn()` when complete.
     *
     * @param {Function} fn
     * @return {Runner}
     * @api public
     */

    Mocha.prototype.run = function(fn){
      if (this.files.length) this.loadFiles();
      var suite = this.suite;
      var options = this.options;
      var runner = new exports.Runner(suite);
      var reporter = new this._reporter(runner);
      runner.ignoreLeaks = options.ignoreLeaks;
      runner.asyncOnly = options.asyncOnly;
      if (options.grep) runner.grep(options.grep, options.invert);
      if (options.globals) runner.globals(options.globals);
      if (options.growl) this._growl(runner, reporter);
      return runner.run(fn);
    };

  }); // module: mocha.js

  require.register("ms.js", function(module, exports, require){

    /**
     * Helpers.
     */

    var s = 1000;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;

    /**
     * Parse or format the given `val`.
     *
     * @param {String|Number} val
     * @return {String|Number}
     * @api public
     */

    module.exports = function(val){
      if ('string' == typeof val) return parse(val);
      return format(val);
    }

    /**
     * Parse the given `str` and return milliseconds.
     *
     * @param {String} str
     * @return {Number}
     * @api private
     */

    function parse(str) {
      var m = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
      if (!m) return;
      var n = parseFloat(m[1]);
      var type = (m[2] || 'ms').toLowerCase();
      switch (type) {
        case 'years':
        case 'year':
        case 'y':
          return n * 31557600000;
        case 'days':
        case 'day':
        case 'd':
          return n * 86400000;
        case 'hours':
        case 'hour':
        case 'h':
          return n * 3600000;
        case 'minutes':
        case 'minute':
        case 'm':
          return n * 60000;
        case 'seconds':
        case 'second':
        case 's':
          return n * 1000;
        case 'ms':
          return n;
      }
    }

    /**
     * Format the given `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api public
     */

    function format(ms) {
      if (ms == d) return Math.round(ms / d) + ' day';
      if (ms > d) return Math.round(ms / d) + ' days';
      if (ms == h) return Math.round(ms / h) + ' hour';
      if (ms > h) return Math.round(ms / h) + ' hours';
      if (ms == m) return Math.round(ms / m) + ' minute';
      if (ms > m) return Math.round(ms / m) + ' minutes';
      if (ms == s) return Math.round(ms / s) + ' second';
      if (ms > s) return Math.round(ms / s) + ' seconds';
      return ms + ' ms';
    }
  }); // module: ms.js

  require.register("reporters/base.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var tty = require('browser/tty')
        , diff = require('browser/diff')
        , ms = require('../ms');

    /**
     * Save timer references to avoid Sinon interfering (see GH-237).
     */

    var Date = global.Date
        , setTimeout = global.setTimeout
        , setInterval = global.setInterval
        , clearTimeout = global.clearTimeout
        , clearInterval = global.clearInterval;

    /**
     * Check if both stdio streams are associated with a tty.
     */

    var isatty = tty.isatty(1) && tty.isatty(2);

    /**
     * Expose `Base`.
     */

    exports = module.exports = Base;

    /**
     * Enable coloring by default.
     */

    exports.useColors = isatty;

    /**
     * Default color map.
     */

    exports.colors = {
      'pass': 90
      , 'fail': 31
      , 'bright pass': 92
      , 'bright fail': 91
      , 'bright yellow': 93
      , 'pending': 36
      , 'suite': 0
      , 'error title': 0
      , 'error message': 31
      , 'error stack': 90
      , 'checkmark': 32
      , 'fast': 90
      , 'medium': 33
      , 'slow': 31
      , 'green': 32
      , 'light': 90
      , 'diff gutter': 90
      , 'diff added': 42
      , 'diff removed': 41
    };

    /**
     * Default symbol map.
     */

    exports.symbols = {
      ok: '✓',
      err: '✖',
      dot: '․'
    };

// With node.js on Windows: use symbols available in terminal default fonts
    if ('win32' == process.platform) {
      exports.symbols.ok = '\u221A';
      exports.symbols.err = '\u00D7';
      exports.symbols.dot = '.';
    }

    /**
     * Color `str` with the given `type`,
     * allowing colors to be disabled,
     * as well as user-defined color
     * schemes.
     *
     * @param {String} type
     * @param {String} str
     * @return {String}
     * @api private
     */

    var color = exports.color = function(type, str) {
      if (!exports.useColors) return str;
      return '\u001b[' + exports.colors[type] + 'm' + str + '\u001b[0m';
    };

    /**
     * Expose term window size, with some
     * defaults for when stderr is not a tty.
     */

    exports.window = {
      width: isatty
          ? process.stdout.getWindowSize
          ? process.stdout.getWindowSize(1)[0]
          : tty.getWindowSize()[1]
          : 75
    };

    /**
     * Expose some basic cursor interactions
     * that are common among reporters.
     */

    exports.cursor = {
      hide: function(){
        process.stdout.write('\u001b[?25l');
      },

      show: function(){
        process.stdout.write('\u001b[?25h');
      },

      deleteLine: function(){
        process.stdout.write('\u001b[2K');
      },

      beginningOfLine: function(){
        process.stdout.write('\u001b[0G');
      },

      CR: function(){
        exports.cursor.deleteLine();
        exports.cursor.beginningOfLine();
      }
    };

    /**
     * Outut the given `failures` as a list.
     *
     * @param {Array} failures
     * @api public
     */

    exports.list = function(failures){
      console.error();
      failures.forEach(function(test, i){
        // format
        var fmt = color('error title', '  %s) %s:\n')
            + color('error message', '     %s')
            + color('error stack', '\n%s\n');

        // msg
        var err = test.err
            , message = err.message || ''
            , stack = err.stack || message
            , index = stack.indexOf(message) + message.length
            , msg = stack.slice(0, index)
            , actual = err.actual
            , expected = err.expected
            , escape = true;

        // explicitly show diff
        if (err.showDiff) {
          escape = false;
          err.actual = actual = JSON.stringify(actual, null, 2);
          err.expected = expected = JSON.stringify(expected, null, 2);
        }

        // actual / expected diff
        if ('string' == typeof actual && 'string' == typeof expected) {
          var len = Math.max(actual.length, expected.length);

          if (len < 20) msg = errorDiff(err, 'Chars', escape);
          else msg = errorDiff(err, 'Words', escape);

          // linenos
          var lines = msg.split('\n');
          if (lines.length > 4) {
            var width = String(lines.length).length;
            msg = lines.map(function(str, i){
              return pad(++i, width) + ' |' + ' ' + str;
            }).join('\n');
          }

          // legend
          msg = '\n'
              + color('diff removed', 'actual')
              + ' '
              + color('diff added', 'expected')
              + '\n\n'
              + msg
              + '\n';

          // indent
          msg = msg.replace(/^/gm, '      ');

          fmt = color('error title', '  %s) %s:\n%s')
              + color('error stack', '\n%s\n');
        }

        // indent stack trace without msg
        stack = stack.slice(index ? index + 1 : index)
            .replace(/^/gm, '  ');

        console.error(fmt, (i + 1), test.fullTitle(), msg, stack);
      });
    };

    /**
     * Initialize a new `Base` reporter.
     *
     * All other reporters generally
     * inherit from this reporter, providing
     * stats such as test duration, number
     * of tests passed / failed etc.
     *
     * @param {Runner} runner
     * @api public
     */

    function Base(runner) {
      var self = this
          , stats = this.stats = { suites: 0, tests: 0, passes: 0, pending: 0, failures: 0 }
          , failures = this.failures = [];

      if (!runner) return;
      this.runner = runner;

      runner.stats = stats;

      runner.on('start', function(){
        stats.start = new Date;
      });

      runner.on('suite', function(suite){
        stats.suites = stats.suites || 0;
        suite.root || stats.suites++;
      });

      runner.on('test end', function(test){
        stats.tests = stats.tests || 0;
        stats.tests++;
      });

      runner.on('pass', function(test){
        stats.passes = stats.passes || 0;

        var medium = test.slow() / 2;
        test.speed = test.duration > test.slow()
            ? 'slow'
            : test.duration > medium
            ? 'medium'
            : 'fast';

        stats.passes++;
      });

      runner.on('fail', function(test, err){
        stats.failures = stats.failures || 0;
        stats.failures++;
        test.err = err;
        failures.push(test);
      });

      runner.on('end', function(){
        stats.end = new Date;
        stats.duration = new Date - stats.start;
      });

      runner.on('pending', function(){
        stats.pending++;
      });
    }

    /**
     * Output common epilogue used by many of
     * the bundled reporters.
     *
     * @api public
     */

    Base.prototype.epilogue = function(){
      var stats = this.stats
          , fmt
          , tests;

      console.log();

      function pluralize(n) {
        return 1 == n ? 'test' : 'tests';
      }

      // failure
      if (stats.failures) {
        fmt = color('bright fail', '  ' + exports.symbols.err)
            + color('fail', ' %d of %d %s failed')
            + color('light', ':')

        console.error(fmt,
            stats.failures,
            this.runner.total,
            pluralize(this.runner.total));

        Base.list(this.failures);
        console.error();
        return;
      }

      // pass
      fmt = color('bright pass', ' ')
          + color('green', ' %d %s complete')
          + color('light', ' (%s)');

      console.log(fmt,
          stats.tests || 0,
          pluralize(stats.tests),
          ms(stats.duration));

      // pending
      if (stats.pending) {
        fmt = color('pending', ' ')
            + color('pending', ' %d %s pending');

        console.log(fmt, stats.pending, pluralize(stats.pending));
      }

      console.log();
    };

    /**
     * Pad the given `str` to `len`.
     *
     * @param {String} str
     * @param {String} len
     * @return {String}
     * @api private
     */

    function pad(str, len) {
      str = String(str);
      return Array(len - str.length + 1).join(' ') + str;
    }

    /**
     * Return a character diff for `err`.
     *
     * @param {Error} err
     * @return {String}
     * @api private
     */

    function errorDiff(err, type, escape) {
      return diff['diff' + type](err.actual, err.expected).map(function(str){
        if (escape) {
          str.value = str.value
              .replace(/\t/g, '<tab>')
              .replace(/\r/g, '<CR>')
              .replace(/\n/g, '<LF>\n');
        }
        if (str.added) return colorLines('diff added', str.value);
        if (str.removed) return colorLines('diff removed', str.value);
        return str.value;
      }).join('');
    }

    /**
     * Color lines for `str`, using the color `name`.
     *
     * @param {String} name
     * @param {String} str
     * @return {String}
     * @api private
     */

    function colorLines(name, str) {
      return str.split('\n').map(function(str){
        return color(name, str);
      }).join('\n');
    }

  }); // module: reporters/base.js

  require.register("reporters/doc.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Base = require('./base')
        , utils = require('../utils');

    /**
     * Expose `Doc`.
     */

    exports = module.exports = Doc;

    /**
     * Initialize a new `Doc` reporter.
     *
     * @param {Runner} runner
     * @api public
     */

    function Doc(runner) {
      Base.call(this, runner);

      var self = this
          , stats = this.stats
          , total = runner.total
          , indents = 2;

      function indent() {
        return Array(indents).join('  ');
      }

      runner.on('suite', function(suite){
        if (suite.root) return;
        ++indents;
        console.log('%s<section class="suite">', indent());
        ++indents;
        console.log('%s<h1>%s</h1>', indent(), utils.escape(suite.title));
        console.log('%s<dl>', indent());
      });

      runner.on('suite end', function(suite){
        if (suite.root) return;
        console.log('%s</dl>', indent());
        --indents;
        console.log('%s</section>', indent());
        --indents;
      });

      runner.on('pass', function(test){
        console.log('%s  <dt>%s</dt>', indent(), utils.escape(test.title));
        var code = utils.escape(utils.clean(test.fn.toString()));
        console.log('%s  <dd><pre><code>%s</code></pre></dd>', indent(), code);
      });
    }

  }); // module: reporters/doc.js

  require.register("reporters/dot.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Base = require('./base')
        , color = Base.color;

    /**
     * Expose `Dot`.
     */

    exports = module.exports = Dot;

    /**
     * Initialize a new `Dot` matrix test reporter.
     *
     * @param {Runner} runner
     * @api public
     */

    function Dot(runner) {
      Base.call(this, runner);

      var self = this
          , stats = this.stats
          , width = Base.window.width * .75 | 0
          , n = 0;

      runner.on('start', function(){
        process.stdout.write('\n  ');
      });

      runner.on('pending', function(test){
        process.stdout.write(color('pending', Base.symbols.dot));
      });

      runner.on('pass', function(test){
        if (++n % width == 0) process.stdout.write('\n  ');
        if ('slow' == test.speed) {
          process.stdout.write(color('bright yellow', Base.symbols.dot));
        } else {
          process.stdout.write(color(test.speed, Base.symbols.dot));
        }
      });

      runner.on('fail', function(test, err){
        if (++n % width == 0) process.stdout.write('\n  ');
        process.stdout.write(color('fail', Base.symbols.dot));
      });

      runner.on('end', function(){
        console.log();
        self.epilogue();
      });
    }

    /**
     * Inherit from `Base.prototype`.
     */

    Dot.prototype = new Base;
    Dot.prototype.constructor = Dot;

  }); // module: reporters/dot.js

  require.register("reporters/html-cov.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var JSONCov = require('./json-cov')
        , fs = require('browser/fs');

    /**
     * Expose `HTMLCov`.
     */

    exports = module.exports = HTMLCov;

    /**
     * Initialize a new `JsCoverage` reporter.
     *
     * @param {Runner} runner
     * @api public
     */

    function HTMLCov(runner) {
      var jade = require('jade')
          , file = __dirname + '/templates/coverage.jade'
          , str = fs.readFileSync(file, 'utf8')
          , fn = jade.compile(str, { filename: file })
          , self = this;

      JSONCov.call(this, runner, false);

      runner.on('end', function(){
        process.stdout.write(fn({
          cov: self.cov
          , coverageClass: coverageClass
        }));
      });
    }

    /**
     * Return coverage class for `n`.
     *
     * @return {String}
     * @api private
     */

    function coverageClass(n) {
      if (n >= 75) return 'high';
      if (n >= 50) return 'medium';
      if (n >= 25) return 'low';
      return 'terrible';
    }
  }); // module: reporters/html-cov.js

  require.register("reporters/html.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Base = require('./base')
        , utils = require('../utils')
        , Progress = require('../browser/progress')
        , escape = utils.escape;

    /**
     * Save timer references to avoid Sinon interfering (see GH-237).
     */

    var Date = global.Date
        , setTimeout = global.setTimeout
        , setInterval = global.setInterval
        , clearTimeout = global.clearTimeout
        , clearInterval = global.clearInterval;

    /**
     * Expose `Doc`.
     */

    exports = module.exports = HTML;

    /**
     * Stats template.
     */

    var statsTemplate = '<ul id="mocha-stats">'
        + '<li class="progress"><canvas width="40" height="40"></canvas></li>'
        + '<li class="passes"><a href="#">passes:</a> <em>0</em></li>'
        + '<li class="failures"><a href="#">failures:</a> <em>0</em></li>'
        + '<li class="duration">duration: <em>0</em>s</li>'
        + '</ul>';

    /**
     * Initialize a new `Doc` reporter.
     *
     * @param {Runner} runner
     * @api public
     */

    function HTML(runner, root) {
      Base.call(this, runner);

      var self = this
          , stats = this.stats
          , total = runner.total
          , stat = fragment(statsTemplate)
          , items = stat.getElementsByTagName('li')
          , passes = items[1].getElementsByTagName('em')[0]
          , passesLink = items[1].getElementsByTagName('a')[0]
          , failures = items[2].getElementsByTagName('em')[0]
          , failuresLink = items[2].getElementsByTagName('a')[0]
          , duration = items[3].getElementsByTagName('em')[0]
          , canvas = stat.getElementsByTagName('canvas')[0]
          , report = fragment('<ul id="mocha-report"></ul>')
          , stack = [report]
          , progress
          , ctx

      root = root || document.getElementById('mocha');

      if (canvas.getContext) {
        var ratio = window.devicePixelRatio || 1;
        canvas.style.width = canvas.width;
        canvas.style.height = canvas.height;
        canvas.width *= ratio;
        canvas.height *= ratio;
        ctx = canvas.getContext('2d');
        ctx.scale(ratio, ratio);
        progress = new Progress;
      }

      if (!root) return error('#mocha div missing, add it to your document');

      // pass toggle
      on(passesLink, 'click', function(){
        unhide();
        var name = /pass/.test(report.className) ? '' : ' pass';
        report.className = report.className.replace(/fail|pass/g, '') + name;
        if (report.className.trim()) hideSuitesWithout('test pass');
      });

      // failure toggle
      on(failuresLink, 'click', function(){
        unhide();
        var name = /fail/.test(report.className) ? '' : ' fail';
        report.className = report.className.replace(/fail|pass/g, '') + name;
        if (report.className.trim()) hideSuitesWithout('test fail');
      });

      root.appendChild(stat);
      root.appendChild(report);

      if (progress) progress.size(40);

      runner.on('suite', function(suite){
        if (suite.root) return;

        // suite
        var url = '?grep=' + encodeURIComponent(suite.fullTitle());
        var el = fragment('<li class="suite"><h1><a href="%s">%s</a></h1></li>', url, escape(suite.title));

        // container
        stack[0].appendChild(el);
        stack.unshift(document.createElement('ul'));
        el.appendChild(stack[0]);
      });

      runner.on('suite end', function(suite){
        if (suite.root) return;
        stack.shift();
      });

      runner.on('fail', function(test, err){
        if ('hook' == test.type) runner.emit('test end', test);
      });

      runner.on('test end', function(test){
        window.scrollTo(0, document.body.scrollHeight);

        // TODO: add to stats
        var percent = stats.tests / this.total * 100 | 0;
        if (progress) progress.update(percent).draw(ctx);

        // update stats
        var ms = new Date - stats.start;
        text(passes, stats.passes);
        text(failures, stats.failures);
        text(duration, (ms / 1000).toFixed(2));

        // test
        if ('passed' == test.state) {
          var el = fragment('<li class="test pass %e"><h2>%e<span class="duration">%ems</span> <a href="?grep=%e" class="replay">‣</a></h2></li>', test.speed, test.title, test.duration, encodeURIComponent(test.fullTitle()));
        } else if (test.pending) {
          var el = fragment('<li class="test pass pending"><h2>%e</h2></li>', test.title);
        } else {
          var el = fragment('<li class="test fail"><h2>%e <a href="?grep=%e" class="replay">‣</a></h2></li>', test.title, encodeURIComponent(test.fullTitle()));
          var str = test.err.stack || test.err.toString();

          // FF / Opera do not add the message
          if (!~str.indexOf(test.err.message)) {
            str = test.err.message + '\n' + str;
          }

          // <=IE7 stringifies to [Object Error]. Since it can be overloaded, we
          // check for the result of the stringifying.
          if ('[object Error]' == str) str = test.err.message;

          // Safari doesn't give you a stack. Let's at least provide a source line.
          if (!test.err.stack && test.err.sourceURL && test.err.line !== undefined) {
            str += "\n(" + test.err.sourceURL + ":" + test.err.line + ")";
          }

          el.appendChild(fragment('<pre class="error">%e</pre>', str));
        }

        // toggle code
        // TODO: defer
        if (!test.pending) {
          var h2 = el.getElementsByTagName('h2')[0];

          on(h2, 'click', function(){
            pre.style.display = 'none' == pre.style.display
                ? 'inline-block'
                : 'none';
          });

          var pre = fragment('<pre><code>%e</code></pre>', utils.clean(test.fn.toString()));
          el.appendChild(pre);
          pre.style.display = 'none';
        }

        // Don't call .appendChild if #mocha-report was already .shift()'ed off the stack.
        if (stack[0]) stack[0].appendChild(el);
      });
    }

    /**
     * Display error `msg`.
     */

    function error(msg) {
      document.body.appendChild(fragment('<div id="mocha-error">%s</div>', msg));
    }

    /**
     * Return a DOM fragment from `html`.
     */

    function fragment(html) {
      var args = arguments
          , div = document.createElement('div')
          , i = 1;

      div.innerHTML = html.replace(/%([se])/g, function(_, type){
        switch (type) {
          case 's': return String(args[i++]);
          case 'e': return escape(args[i++]);
        }
      });

      return div.firstChild;
    }

    /**
     * Check for suites that do not have elements
     * with `classname`, and hide them.
     */

    function hideSuitesWithout(classname) {
      var suites = document.getElementsByClassName('suite');
      for (var i = 0; i < suites.length; i++) {
        var els = suites[i].getElementsByClassName(classname);
        if (0 == els.length) suites[i].className += ' hidden';
      }
    }

    /**
     * Unhide .hidden suites.
     */

    function unhide() {
      var els = document.getElementsByClassName('suite hidden');
      for (var i = 0; i < els.length; ++i) {
        els[i].className = els[i].className.replace('suite hidden', 'suite');
      }
    }

    /**
     * Set `el` text to `str`.
     */

    function text(el, str) {
      if (el.textContent) {
        el.textContent = str;
      } else {
        el.innerText = str;
      }
    }

    /**
     * Listen on `event` with callback `fn`.
     */

    function on(el, event, fn) {
      if (el.addEventListener) {
        el.addEventListener(event, fn, false);
      } else {
        el.attachEvent('on' + event, fn);
      }
    }

  }); // module: reporters/html.js

  require.register("reporters/index.js", function(module, exports, require){

    exports.Base = require('./base');
    exports.Dot = require('./dot');
    exports.Doc = require('./doc');
    exports.TAP = require('./tap');
    exports.JSON = require('./json');
    exports.HTML = require('./html');
    exports.List = require('./list');
    exports.Min = require('./min');
    exports.Spec = require('./spec');
    exports.Nyan = require('./nyan');
    exports.XUnit = require('./xunit');
    exports.Markdown = require('./markdown');
    exports.Progress = require('./progress');
    exports.Landing = require('./landing');
    exports.JSONCov = require('./json-cov');
    exports.HTMLCov = require('./html-cov');
    exports.JSONStream = require('./json-stream');
    exports.Teamcity = require('./teamcity');

  }); // module: reporters/index.js

  require.register("reporters/json-cov.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Base = require('./base');

    /**
     * Expose `JSONCov`.
     */

    exports = module.exports = JSONCov;

    /**
     * Initialize a new `JsCoverage` reporter.
     *
     * @param {Runner} runner
     * @param {Boolean} output
     * @api public
     */

    function JSONCov(runner, output) {
      var self = this
          , output = 1 == arguments.length ? true : output;

      Base.call(this, runner);

      var tests = []
          , failures = []
          , passes = [];

      runner.on('test end', function(test){
        tests.push(test);
      });

      runner.on('pass', function(test){
        passes.push(test);
      });

      runner.on('fail', function(test){
        failures.push(test);
      });

      runner.on('end', function(){
        var cov = global._$jscoverage || {};
        var result = self.cov = map(cov);
        result.stats = self.stats;
        result.tests = tests.map(clean);
        result.failures = failures.map(clean);
        result.passes = passes.map(clean);
        if (!output) return;
        process.stdout.write(JSON.stringify(result, null, 2 ));
      });
    }

    /**
     * Map jscoverage data to a JSON structure
     * suitable for reporting.
     *
     * @param {Object} cov
     * @return {Object}
     * @api private
     */

    function map(cov) {
      var ret = {
        instrumentation: 'node-jscoverage'
        , sloc: 0
        , hits: 0
        , misses: 0
        , coverage: 0
        , files: []
      };

      for (var filename in cov) {
        var data = coverage(filename, cov[filename]);
        ret.files.push(data);
        ret.hits += data.hits;
        ret.misses += data.misses;
        ret.sloc += data.sloc;
      }

      ret.files.sort(function(a, b) {
        return a.filename.localeCompare(b.filename);
      });

      if (ret.sloc > 0) {
        ret.coverage = (ret.hits / ret.sloc) * 100;
      }

      return ret;
    };

    /**
     * Map jscoverage data for a single source file
     * to a JSON structure suitable for reporting.
     *
     * @param {String} filename name of the source file
     * @param {Object} data jscoverage coverage data
     * @return {Object}
     * @api private
     */

    function coverage(filename, data) {
      var ret = {
        filename: filename,
        coverage: 0,
        hits: 0,
        misses: 0,
        sloc: 0,
        source: {}
      };

      data.source.forEach(function(line, num){
        num++;

        if (data[num] === 0) {
          ret.misses++;
          ret.sloc++;
        } else if (data[num] !== undefined) {
          ret.hits++;
          ret.sloc++;
        }

        ret.source[num] = {
          source: line
          , coverage: data[num] === undefined
              ? ''
              : data[num]
        };
      });

      ret.coverage = ret.hits / ret.sloc * 100;

      return ret;
    }

    /**
     * Return a plain-object representation of `test`
     * free of cyclic properties etc.
     *
     * @param {Object} test
     * @return {Object}
     * @api private
     */

    function clean(test) {
      return {
        title: test.title
        , fullTitle: test.fullTitle()
        , duration: test.duration
      }
    }

  }); // module: reporters/json-cov.js

  require.register("reporters/json-stream.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Base = require('./base')
        , color = Base.color;

    /**
     * Expose `List`.
     */

    exports = module.exports = List;

    /**
     * Initialize a new `List` test reporter.
     *
     * @param {Runner} runner
     * @api public
     */

    function List(runner) {
      Base.call(this, runner);

      var self = this
          , stats = this.stats
          , total = runner.total;

      runner.on('start', function(){
        console.log(JSON.stringify(['start', { total: total }]));
      });

      runner.on('pass', function(test){
        console.log(JSON.stringify(['pass', clean(test)]));
      });

      runner.on('fail', function(test, err){
        console.log(JSON.stringify(['fail', clean(test)]));
      });

      runner.on('end', function(){
        process.stdout.write(JSON.stringify(['end', self.stats]));
      });
    }

    /**
     * Return a plain-object representation of `test`
     * free of cyclic properties etc.
     *
     * @param {Object} test
     * @return {Object}
     * @api private
     */

    function clean(test) {
      return {
        title: test.title
        , fullTitle: test.fullTitle()
        , duration: test.duration
      }
    }
  }); // module: reporters/json-stream.js

  require.register("reporters/json.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Base = require('./base')
        , cursor = Base.cursor
        , color = Base.color;

    /**
     * Expose `JSON`.
     */

    exports = module.exports = JSONReporter;

    /**
     * Initialize a new `JSON` reporter.
     *
     * @param {Runner} runner
     * @api public
     */

    function JSONReporter(runner) {
      var self = this;
      Base.call(this, runner);

      var tests = []
          , failures = []
          , passes = [];

      runner.on('test end', function(test){
        tests.push(test);
      });

      runner.on('pass', function(test){
        passes.push(test);
      });

      runner.on('fail', function(test){
        failures.push(test);
      });

      runner.on('end', function(){
        var obj = {
          stats: self.stats
          , tests: tests.map(clean)
          , failures: failures.map(clean)
          , passes: passes.map(clean)
        };

        process.stdout.write(JSON.stringify(obj, null, 2));
      });
    }

    /**
     * Return a plain-object representation of `test`
     * free of cyclic properties etc.
     *
     * @param {Object} test
     * @return {Object}
     * @api private
     */

    function clean(test) {
      return {
        title: test.title
        , fullTitle: test.fullTitle()
        , duration: test.duration
      }
    }
  }); // module: reporters/json.js

  require.register("reporters/landing.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Base = require('./base')
        , cursor = Base.cursor
        , color = Base.color;

    /**
     * Expose `Landing`.
     */

    exports = module.exports = Landing;

    /**
     * Airplane color.
     */

    Base.colors.plane = 0;

    /**
     * Airplane crash color.
     */

    Base.colors['plane crash'] = 31;

    /**
     * Runway color.
     */

    Base.colors.runway = 90;

    /**
     * Initialize a new `Landing` reporter.
     *
     * @param {Runner} runner
     * @api public
     */

    function Landing(runner) {
      Base.call(this, runner);

      var self = this
          , stats = this.stats
          , width = Base.window.width * .75 | 0
          , total = runner.total
          , stream = process.stdout
          , plane = color('plane', '✈')
          , crashed = -1
          , n = 0;

      function runway() {
        var buf = Array(width).join('-');
        return '  ' + color('runway', buf);
      }

      runner.on('start', function(){
        stream.write('\n  ');
        cursor.hide();
      });

      runner.on('test end', function(test){
        // check if the plane crashed
        var col = -1 == crashed
            ? width * ++n / total | 0
            : crashed;

        // show the crash
        if ('failed' == test.state) {
          plane = color('plane crash', '✈');
          crashed = col;
        }

        // render landing strip
        stream.write('\u001b[4F\n\n');
        stream.write(runway());
        stream.write('\n  ');
        stream.write(color('runway', Array(col).join('⋅')));
        stream.write(plane)
        stream.write(color('runway', Array(width - col).join('⋅') + '\n'));
        stream.write(runway());
        stream.write('\u001b[0m');
      });

      runner.on('end', function(){
        cursor.show();
        console.log();
        self.epilogue();
      });
    }

    /**
     * Inherit from `Base.prototype`.
     */

    Landing.prototype = new Base;
    Landing.prototype.constructor = Landing;

  }); // module: reporters/landing.js

  require.register("reporters/list.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Base = require('./base')
        , cursor = Base.cursor
        , color = Base.color;

    /**
     * Expose `List`.
     */

    exports = module.exports = List;

    /**
     * Initialize a new `List` test reporter.
     *
     * @param {Runner} runner
     * @api public
     */

    function List(runner) {
      Base.call(this, runner);

      var self = this
          , stats = this.stats
          , n = 0;

      runner.on('start', function(){
        console.log();
      });

      runner.on('test', function(test){
        process.stdout.write(color('pass', '    ' + test.fullTitle() + ': '));
      });

      runner.on('pending', function(test){
        var fmt = color('checkmark', '  -')
            + color('pending', ' %s');
        console.log(fmt, test.fullTitle());
      });

      runner.on('pass', function(test){
        var fmt = color('checkmark', '  '+Base.symbols.dot)
            + color('pass', ' %s: ')
            + color(test.speed, '%dms');
        cursor.CR();
        console.log(fmt, test.fullTitle(), test.duration);
      });

      runner.on('fail', function(test, err){
        cursor.CR();
        console.log(color('fail', '  %d) %s'), ++n, test.fullTitle());
      });

      runner.on('end', self.epilogue.bind(self));
    }

    /**
     * Inherit from `Base.prototype`.
     */

    List.prototype = new Base;
    List.prototype.constructor = List;


  }); // module: reporters/list.js

  require.register("reporters/markdown.js", function(module, exports, require){
    /**
     * Module dependencies.
     */

    var Base = require('./base')
        , utils = require('../utils');

    /**
     * Expose `Markdown`.
     */

    exports = module.exports = Markdown;

    /**
     * Initialize a new `Markdown` reporter.
     *
     * @param {Runner} runner
     * @api public
     */

    function Markdown(runner) {
      Base.call(this, runner);

      var self = this
          , stats = this.stats
          , total = runner.total
          , level = 0
          , buf = '';

      function title(str) {
        return Array(level).join('#') + ' ' + str;
      }

      function indent() {
        return Array(level).join('  ');
      }

      function mapTOC(suite, obj) {
        var ret = obj;
        obj = obj[suite.title] = obj[suite.title] || { suite: suite };
        suite.suites.forEach(function(suite){
          mapTOC(suite, obj);
        });
        return ret;
      }

      function stringifyTOC(obj, level) {
        ++level;
        var buf = '';
        var link;
        for (var key in obj) {
          if ('suite' == key) continue;
          if (key) link = ' - [' + key + '](#' + utils.slug(obj[key].suite.fullTitle()) + ')\n';
          if (key) buf += Array(level).join('  ') + link;
          buf += stringifyTOC(obj[key], level);
        }
        --level;
        return buf;
      }

      function generateTOC(suite) {
        var obj = mapTOC(suite, {});
        return stringifyTOC(obj, 0);
      }

      generateTOC(runner.suite);

      runner.on('suite', function(suite){
        ++level;
        var slug = utils.slug(suite.fullTitle());
        buf += '<a name="' + slug + '"></a>' + '\n';
        buf += title(suite.title) + '\n';
      });

      runner.on('suite end', function(suite){
        --level;
      });

      runner.on('pass', function(test){
        var code = utils.clean(test.fn.toString());
        buf += test.title + '.\n';
        buf += '\n```js\n';
        buf += code + '\n';
        buf += '```\n\n';
      });

      runner.on('end', function(){
        process.stdout.write('# TOC\n');
        process.stdout.write(generateTOC(runner.suite));
        process.stdout.write(buf);
      });
    }
  }); // module: reporters/markdown.js

  require.register("reporters/min.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Base = require('./base');

    /**
     * Expose `Min`.
     */

    exports = module.exports = Min;

    /**
     * Initialize a new `Min` minimal test reporter (best used with --watch).
     *
     * @param {Runner} runner
     * @api public
     */

    function Min(runner) {
      Base.call(this, runner);

      runner.on('start', function(){
        // clear screen
        process.stdout.write('\u001b[2J');
        // set cursor position
        process.stdout.write('\u001b[1;3H');
      });

      runner.on('end', this.epilogue.bind(this));
    }

    /**
     * Inherit from `Base.prototype`.
     */

    Min.prototype = new Base;
    Min.prototype.constructor = Min;

  }); // module: reporters/min.js

  require.register("reporters/nyan.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Base = require('./base')
        , color = Base.color;

    /**
     * Expose `Dot`.
     */

    exports = module.exports = NyanCat;

    /**
     * Initialize a new `Dot` matrix test reporter.
     *
     * @param {Runner} runner
     * @api public
     */

    function NyanCat(runner) {
      Base.call(this, runner);

      var self = this
          , stats = this.stats
          , width = Base.window.width * .75 | 0
          , rainbowColors = this.rainbowColors = self.generateColors()
          , colorIndex = this.colorIndex = 0
          , numerOfLines = this.numberOfLines = 4
          , trajectories = this.trajectories = [[], [], [], []]
          , nyanCatWidth = this.nyanCatWidth = 11
          , trajectoryWidthMax = this.trajectoryWidthMax = (width - nyanCatWidth)
          , scoreboardWidth = this.scoreboardWidth = 5
          , tick = this.tick = 0
          , n = 0;

      runner.on('start', function(){
        Base.cursor.hide();
        self.draw('start');
      });

      runner.on('pending', function(test){
        self.draw('pending');
      });

      runner.on('pass', function(test){
        self.draw('pass');
      });

      runner.on('fail', function(test, err){
        self.draw('fail');
      });

      runner.on('end', function(){
        Base.cursor.show();
        for (var i = 0; i < self.numberOfLines; i++) write('\n');
        self.epilogue();
      });
    }

    /**
     * Draw the nyan cat with runner `status`.
     *
     * @param {String} status
     * @api private
     */

    NyanCat.prototype.draw = function(status){
      this.appendRainbow();
      this.drawScoreboard();
      this.drawRainbow();
      this.drawNyanCat(status);
      this.tick = !this.tick;
    };

    /**
     * Draw the "scoreboard" showing the number
     * of passes, failures and pending tests.
     *
     * @api private
     */

    NyanCat.prototype.drawScoreboard = function(){
      var stats = this.stats;
      var colors = Base.colors;

      function draw(color, n) {
        write(' ');
        write('\u001b[' + color + 'm' + n + '\u001b[0m');
        write('\n');
      }

      draw(colors.green, stats.passes);
      draw(colors.fail, stats.failures);
      draw(colors.pending, stats.pending);
      write('\n');

      this.cursorUp(this.numberOfLines);
    };

    /**
     * Append the rainbow.
     *
     * @api private
     */

    NyanCat.prototype.appendRainbow = function(){
      var segment = this.tick ? '_' : '-';
      var rainbowified = this.rainbowify(segment);

      for (var index = 0; index < this.numberOfLines; index++) {
        var trajectory = this.trajectories[index];
        if (trajectory.length >= this.trajectoryWidthMax) trajectory.shift();
        trajectory.push(rainbowified);
      }
    };

    /**
     * Draw the rainbow.
     *
     * @api private
     */

    NyanCat.prototype.drawRainbow = function(){
      var self = this;

      this.trajectories.forEach(function(line, index) {
        write('\u001b[' + self.scoreboardWidth + 'C');
        write(line.join(''));
        write('\n');
      });

      this.cursorUp(this.numberOfLines);
    };

    /**
     * Draw the nyan cat with `status`.
     *
     * @param {String} status
     * @api private
     */

    NyanCat.prototype.drawNyanCat = function(status) {
      var self = this;
      var startWidth = this.scoreboardWidth + this.trajectories[0].length;

      [0, 1, 2, 3].forEach(function(index) {
        write('\u001b[' + startWidth + 'C');

        switch (index) {
          case 0:
            write('_,------,');
            write('\n');
            break;
          case 1:
            var padding = self.tick ? '  ' : '   ';
            write('_|' + padding + '/\\_/\\ ');
            write('\n');
            break;
          case 2:
            var padding = self.tick ? '_' : '__';
            var tail = self.tick ? '~' : '^';
            var face;
            switch (status) {
              case 'pass':
                face = '( ^ .^)';
                break;
              case 'fail':
                face = '( o .o)';
                break;
              default:
                face = '( - .-)';
            }
            write(tail + '|' + padding + face + ' ');
            write('\n');
            break;
          case 3:
            var padding = self.tick ? ' ' : '  ';
            write(padding + '""  "" ');
            write('\n');
            break;
        }
      });

      this.cursorUp(this.numberOfLines);
    };

    /**
     * Move cursor up `n`.
     *
     * @param {Number} n
     * @api private
     */

    NyanCat.prototype.cursorUp = function(n) {
      write('\u001b[' + n + 'A');
    };

    /**
     * Move cursor down `n`.
     *
     * @param {Number} n
     * @api private
     */

    NyanCat.prototype.cursorDown = function(n) {
      write('\u001b[' + n + 'B');
    };

    /**
     * Generate rainbow colors.
     *
     * @return {Array}
     * @api private
     */

    NyanCat.prototype.generateColors = function(){
      var colors = [];

      for (var i = 0; i < (6 * 7); i++) {
        var pi3 = Math.floor(Math.PI / 3);
        var n = (i * (1.0 / 6));
        var r = Math.floor(3 * Math.sin(n) + 3);
        var g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3);
        var b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3);
        colors.push(36 * r + 6 * g + b + 16);
      }

      return colors;
    };

    /**
     * Apply rainbow to the given `str`.
     *
     * @param {String} str
     * @return {String}
     * @api private
     */

    NyanCat.prototype.rainbowify = function(str){
      var color = this.rainbowColors[this.colorIndex % this.rainbowColors.length];
      this.colorIndex += 1;
      return '\u001b[38;5;' + color + 'm' + str + '\u001b[0m';
    };

    /**
     * Stdout helper.
     */

    function write(string) {
      process.stdout.write(string);
    }

    /**
     * Inherit from `Base.prototype`.
     */

    NyanCat.prototype = new Base;
    NyanCat.prototype.constructor = NyanCat;


  }); // module: reporters/nyan.js

  require.register("reporters/progress.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Base = require('./base')
        , cursor = Base.cursor
        , color = Base.color;

    /**
     * Expose `Progress`.
     */

    exports = module.exports = Progress;

    /**
     * General progress bar color.
     */

    Base.colors.progress = 90;

    /**
     * Initialize a new `Progress` bar test reporter.
     *
     * @param {Runner} runner
     * @param {Object} options
     * @api public
     */

    function Progress(runner, options) {
      Base.call(this, runner);

      var self = this
          , options = options || {}
          , stats = this.stats
          , width = Base.window.width * .50 | 0
          , total = runner.total
          , complete = 0
          , max = Math.max;

      // default chars
      options.open = options.open || '[';
      options.complete = options.complete || '▬';
      options.incomplete = options.incomplete || Base.symbols.dot;
      options.close = options.close || ']';
      options.verbose = false;

      // tests started
      runner.on('start', function(){
        console.log();
        cursor.hide();
      });

      // tests complete
      runner.on('test end', function(){
        complete++;
        var incomplete = total - complete
            , percent = complete / total
            , n = width * percent | 0
            , i = width - n;

        cursor.CR();
        process.stdout.write('\u001b[J');
        process.stdout.write(color('progress', '  ' + options.open));
        process.stdout.write(Array(n).join(options.complete));
        process.stdout.write(Array(i).join(options.incomplete));
        process.stdout.write(color('progress', options.close));
        if (options.verbose) {
          process.stdout.write(color('progress', ' ' + complete + ' of ' + total));
        }
      });

      // tests are complete, output some stats
      // and the failures if any
      runner.on('end', function(){
        cursor.show();
        console.log();
        self.epilogue();
      });
    }

    /**
     * Inherit from `Base.prototype`.
     */

    Progress.prototype = new Base;
    Progress.prototype.constructor = Progress;


  }); // module: reporters/progress.js

  require.register("reporters/spec.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Base = require('./base')
        , cursor = Base.cursor
        , color = Base.color;

    /**
     * Expose `Spec`.
     */

    exports = module.exports = Spec;

    /**
     * Initialize a new `Spec` test reporter.
     *
     * @param {Runner} runner
     * @api public
     */

    function Spec(runner) {
      Base.call(this, runner);

      var self = this
          , stats = this.stats
          , indents = 0
          , n = 0;

      function indent() {
        return Array(indents).join('  ')
      }

      runner.on('start', function(){
        console.log();
      });

      runner.on('suite', function(suite){
        ++indents;
        console.log(color('suite', '%s%s'), indent(), suite.title);
      });

      runner.on('suite end', function(suite){
        --indents;
        if (1 == indents) console.log();
      });

      runner.on('test', function(test){
        process.stdout.write(indent() + color('pass', '  ◦ ' + test.title + ': '));
      });

      runner.on('pending', function(test){
        var fmt = indent() + color('pending', '  - %s');
        console.log(fmt, test.title);
      });

      runner.on('pass', function(test){
        if ('fast' == test.speed) {
          var fmt = indent()
              + color('checkmark', '  ' + Base.symbols.ok)
              + color('pass', ' %s ');
          cursor.CR();
          console.log(fmt, test.title);
        } else {
          var fmt = indent()
              + color('checkmark', '  ' + Base.symbols.ok)
              + color('pass', ' %s ')
              + color(test.speed, '(%dms)');
          cursor.CR();
          console.log(fmt, test.title, test.duration);
        }
      });

      runner.on('fail', function(test, err){
        cursor.CR();
        console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
      });

      runner.on('end', self.epilogue.bind(self));
    }

    /**
     * Inherit from `Base.prototype`.
     */

    Spec.prototype = new Base;
    Spec.prototype.constructor = Spec;


  }); // module: reporters/spec.js

  require.register("reporters/tap.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Base = require('./base')
        , cursor = Base.cursor
        , color = Base.color;

    /**
     * Expose `TAP`.
     */

    exports = module.exports = TAP;

    /**
     * Initialize a new `TAP` reporter.
     *
     * @param {Runner} runner
     * @api public
     */

    function TAP(runner) {
      Base.call(this, runner);

      var self = this
          , stats = this.stats
          , n = 1
          , passes = 0
          , failures = 1;

      runner.on('start', function(){
        var total = runner.grepTotal(runner.suite);
        console.log('%d..%d', 1, total);
      });

      runner.on('test end', function(){
        ++n;
      });

      runner.on('pending', function(test){
        console.log('ok %d %s # SKIP -', n, title(test));
      });

      runner.on('pass', function(test){
        passes++;
        console.log('ok %d %s', n, title(test));
      });

      runner.on('fail', function(test, err){
        failures++;
        console.log('not ok %d %s', n, title(test));
        console.log(err.stack.replace(/^/gm, '  '));
      });

      runner.on('end', function(){
        console.log('# tests ' + (passes + failures));
        console.log('# pass ' + passes);
        console.log('# fail ' + failures);
      });
    }

    /**
     * Return a TAP-safe title of `test`
     *
     * @param {Object} test
     * @return {String}
     * @api private
     */

    function title(test) {
      return test.fullTitle().replace(/#/g, '');
    }

  }); // module: reporters/tap.js

  require.register("reporters/teamcity.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Base = require('./base');

    /**
     * Expose `Teamcity`.
     */

    exports = module.exports = Teamcity;

    /**
     * Initialize a new `Teamcity` reporter.
     *
     * @param {Runner} runner
     * @api public
     */

    function Teamcity(runner) {
      Base.call(this, runner);
      var stats = this.stats;

      runner.on('start', function() {
        console.log("##teamcity[testSuiteStarted name='mocha.suite']");
      });

      runner.on('test', function(test) {
        console.log("##teamcity[testStarted name='" + escape(test.fullTitle()) + "']");
      });

      runner.on('fail', function(test, err) {
        console.log("##teamcity[testFailed name='" + escape(test.fullTitle()) + "' message='" + escape(err.message) + "']");
      });

      runner.on('pending', function(test) {
        console.log("##teamcity[testIgnored name='" + escape(test.fullTitle()) + "' message='pending']");
      });

      runner.on('test end', function(test) {
        console.log("##teamcity[testFinished name='" + escape(test.fullTitle()) + "' duration='" + test.duration + "']");
      });

      runner.on('end', function() {
        console.log("##teamcity[testSuiteFinished name='mocha.suite' duration='" + stats.duration + "']");
      });
    }

    /**
     * Escape the given `str`.
     */

    function escape(str) {
      return str
          .replace(/\|/g, "||")
          .replace(/\n/g, "|n")
          .replace(/\r/g, "|r")
          .replace(/\[/g, "|[")
          .replace(/\]/g, "|]")
          .replace(/\u0085/g, "|x")
          .replace(/\u2028/g, "|l")
          .replace(/\u2029/g, "|p")
          .replace(/'/g, "|'");
    }

  }); // module: reporters/teamcity.js

  require.register("reporters/xunit.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Base = require('./base')
        , utils = require('../utils')
        , escape = utils.escape;

    /**
     * Save timer references to avoid Sinon interfering (see GH-237).
     */

    var Date = global.Date
        , setTimeout = global.setTimeout
        , setInterval = global.setInterval
        , clearTimeout = global.clearTimeout
        , clearInterval = global.clearInterval;

    /**
     * Expose `XUnit`.
     */

    exports = module.exports = XUnit;

    /**
     * Initialize a new `XUnit` reporter.
     *
     * @param {Runner} runner
     * @api public
     */

    function XUnit(runner) {
      Base.call(this, runner);
      var stats = this.stats
          , tests = []
          , self = this;

      runner.on('pass', function(test){
        tests.push(test);
      });

      runner.on('fail', function(test){
        tests.push(test);
      });

      runner.on('end', function(){
        console.log(tag('testsuite', {
          name: 'Mocha Tests'
          , tests: stats.tests
          , failures: stats.failures
          , errors: stats.failures
          , skip: stats.tests - stats.failures - stats.passes
          , timestamp: (new Date).toUTCString()
          , time: stats.duration / 1000
        }, false));

        tests.forEach(test);
        console.log('</testsuite>');
      });
    }

    /**
     * Inherit from `Base.prototype`.
     */

    XUnit.prototype = new Base;
    XUnit.prototype.constructor = XUnit;


    /**
     * Output tag for the given `test.`
     */

    function test(test) {
      var attrs = {
        classname: test.parent.fullTitle()
        , name: test.title
        , time: test.duration / 1000
      };

      if ('failed' == test.state) {
        var err = test.err;
        attrs.message = escape(err.message);
        console.log(tag('testcase', attrs, false, tag('failure', attrs, false, cdata(err.stack))));
      } else if (test.pending) {
        console.log(tag('testcase', attrs, false, tag('skipped', {}, true)));
      } else {
        console.log(tag('testcase', attrs, true) );
      }
    }

    /**
     * HTML tag helper.
     */

    function tag(name, attrs, close, content) {
      var end = close ? '/>' : '>'
          , pairs = []
          , tag;

      for (var key in attrs) {
        pairs.push(key + '="' + escape(attrs[key]) + '"');
      }

      tag = '<' + name + (pairs.length ? ' ' + pairs.join(' ') : '') + end;
      if (content) tag += content + '</' + name + end;
      return tag;
    }

    /**
     * Return cdata escaped CDATA `str`.
     */

    function cdata(str) {
      return '<![CDATA[' + escape(str) + ']]>';
    }

  }); // module: reporters/xunit.js

  require.register("runnable.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var EventEmitter = require('browser/events').EventEmitter
        , debug = require('browser/debug')('mocha:runnable')
        , milliseconds = require('./ms');

    /**
     * Save timer references to avoid Sinon interfering (see GH-237).
     */

    var Date = global.Date
        , setTimeout = global.setTimeout
        , setInterval = global.setInterval
        , clearTimeout = global.clearTimeout
        , clearInterval = global.clearInterval;

    /**
     * Object#toString().
     */

    var toString = Object.prototype.toString;

    /**
     * Expose `Runnable`.
     */

    module.exports = Runnable;

    /**
     * Initialize a new `Runnable` with the given `title` and callback `fn`.
     *
     * @param {String} title
     * @param {Function} fn
     * @api private
     */

    function Runnable(title, fn) {
      this.title = title;
      this.fn = fn;
      this.async = fn && fn.length;
      this.sync = ! this.async;
      this._timeout = 2000;
      this._slow = 75;
      this.timedOut = false;
    }

    /**
     * Inherit from `EventEmitter.prototype`.
     */

    Runnable.prototype = new EventEmitter;
    Runnable.prototype.constructor = Runnable;


    /**
     * Set & get timeout `ms`.
     *
     * @param {Number|String} ms
     * @return {Runnable|Number} ms or self
     * @api private
     */

    Runnable.prototype.timeout = function(ms){
      if (0 == arguments.length) return this._timeout;
      if ('string' == typeof ms) ms = milliseconds(ms);
      debug('timeout %d', ms);
      this._timeout = ms;
      if (this.timer) this.resetTimeout();
      return this;
    };

    /**
     * Set & get slow `ms`.
     *
     * @param {Number|String} ms
     * @return {Runnable|Number} ms or self
     * @api private
     */

    Runnable.prototype.slow = function(ms){
      if (0 === arguments.length) return this._slow;
      if ('string' == typeof ms) ms = milliseconds(ms);
      debug('timeout %d', ms);
      this._slow = ms;
      return this;
    };

    /**
     * Return the full title generated by recursively
     * concatenating the parent's full title.
     *
     * @return {String}
     * @api public
     */

    Runnable.prototype.fullTitle = function(){
      return this.parent.fullTitle() + ' ' + this.title;
    };

    /**
     * Clear the timeout.
     *
     * @api private
     */

    Runnable.prototype.clearTimeout = function(){
      clearTimeout(this.timer);
    };

    /**
     * Inspect the runnable void of private properties.
     *
     * @return {String}
     * @api private
     */

    Runnable.prototype.inspect = function(){
      return JSON.stringify(this, function(key, val){
        if ('_' == key[0]) return;
        if ('parent' == key) return '#<Suite>';
        if ('ctx' == key) return '#<Context>';
        return val;
      }, 2);
    };

    /**
     * Reset the timeout.
     *
     * @api private
     */

    Runnable.prototype.resetTimeout = function(){
      var self = this
          , ms = this.timeout();

      this.clearTimeout();
      if (ms) {
        this.timer = setTimeout(function(){
          self.callback(new Error('timeout of ' + ms + 'ms exceeded'));
          self.timedOut = true;
        }, ms);
      }
    };

    /**
     * Run the test and invoke `fn(err)`.
     *
     * @param {Function} fn
     * @api private
     */

    Runnable.prototype.run = function(fn){
      var self = this
          , ms = this.timeout()
          , start = new Date
          , ctx = this.ctx
          , finished
          , emitted;

      if (ctx) ctx.runnable(this);

      // timeout
      if (this.async) {
        if (ms) {
          this.timer = setTimeout(function(){
            done(new Error('timeout of ' + ms + 'ms exceeded'));
            self.timedOut = true;
          }, ms);
        }
      }

      // called multiple times
      function multiple(err) {
        if (emitted) return;
        emitted = true;
        self.emit('error', err || new Error('done() called multiple times'));
      }

      // finished
      function done(err) {
        if (self.timedOut) return;
        if (finished) return multiple(err);
        self.clearTimeout();
        self.duration = new Date - start;
        finished = true;
        fn(err);
      }

      // for .resetTimeout()
      this.callback = done;

      // async
      if (this.async) {
        try {
          this.fn.call(ctx, function(err){
            if (toString.call(err) === "[object Error]") return done(err);
            if (null != err) return done(new Error('done() invoked with non-Error: ' + err));
            done();
          });
        } catch (err) {
          done(err);
        }
        return;
      }

      if (this.asyncOnly) {
        return done(new Error('--async-only option in use without declaring `done()`'));
      }

      // sync
      try {
        if (!this.pending) this.fn.call(ctx);
        this.duration = new Date - start;
        fn();
      } catch (err) {
        fn(err);
      }
    };

  }); // module: runnable.js

  require.register("runner.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var EventEmitter = require('browser/events').EventEmitter
        , debug = require('browser/debug')('mocha:runner')
        , Test = require('./test')
        , utils = require('./utils')
        , filter = utils.filter
        , keys = utils.keys
        , noop = function(){};

    /**
     * Non-enumerable globals.
     */

    var globals = [
      'setTimeout',
      'clearTimeout',
      'setInterval',
      'clearInterval',
      'XMLHttpRequest',
      'Date'
    ];

    /**
     * Expose `Runner`.
     */

    module.exports = Runner;

    /**
     * Initialize a `Runner` for the given `suite`.
     *
     * Events:
     *
     *   - `start`  execution started
     *   - `end`  execution complete
     *   - `suite`  (suite) test suite execution started
     *   - `suite end`  (suite) all tests (and sub-suites) have finished
     *   - `test`  (test) test execution started
     *   - `test end`  (test) test completed
     *   - `hook`  (hook) hook execution started
     *   - `hook end`  (hook) hook complete
     *   - `pass`  (test) test passed
     *   - `fail`  (test, err) test failed
     *
     * @api public
     */

    function Runner(suite) {
      var self = this;
      this._globals = [];
      this.suite = suite;
      this.total = suite.total();
      this.failures = 0;
      this.on('test end', function(test){ self.checkGlobals(test); });
      this.on('hook end', function(hook){ self.checkGlobals(hook); });
      this.grep(/.*/);
      this.globals(this.globalProps().concat(['errno']));
    }

    /**
     * Inherit from `EventEmitter.prototype`.
     */

    Runner.prototype = new EventEmitter;
    Runner.prototype.constructor = Runner;


    /**
     * Run tests with full titles matching `re`. Updates runner.total
     * with number of tests matched.
     *
     * @param {RegExp} re
     * @param {Boolean} invert
     * @return {Runner} for chaining
     * @api public
     */

    Runner.prototype.grep = function(re, invert){
      debug('grep %s', re);
      this._grep = re;
      this._invert = invert;
      this.total = this.grepTotal(this.suite);
      return this;
    };

    /**
     * Returns the number of tests matching the grep search for the
     * given suite.
     *
     * @param {Suite} suite
     * @return {Number}
     * @api public
     */

    Runner.prototype.grepTotal = function(suite) {
      var self = this;
      var total = 0;

      suite.eachTest(function(test){
        var match = self._grep.test(test.fullTitle());
        if (self._invert) match = !match;
        if (match) total++;
      });

      return total;
    };

    /**
     * Return a list of global properties.
     *
     * @return {Array}
     * @api private
     */

    Runner.prototype.globalProps = function() {
      var props = utils.keys(global);

      // non-enumerables
      for (var i = 0; i < globals.length; ++i) {
        if (~utils.indexOf(props, globals[i])) continue;
        props.push(globals[i]);
      }

      return props;
    };

    /**
     * Allow the given `arr` of globals.
     *
     * @param {Array} arr
     * @return {Runner} for chaining
     * @api public
     */

    Runner.prototype.globals = function(arr){
      if (0 == arguments.length) return this._globals;
      debug('globals %j', arr);
      utils.forEach(arr, function(arr){
        this._globals.push(arr);
      }, this);
      return this;
    };

    /**
     * Check for global variable leaks.
     *
     * @api private
     */

    Runner.prototype.checkGlobals = function(test){
      if (this.ignoreLeaks) return;
      var ok = this._globals;
      var globals = this.globalProps();
      var isNode = process.kill;
      var leaks;

      // check length - 2 ('errno' and 'location' globals)
      if (isNode && 1 == ok.length - globals.length) return
      else if (2 == ok.length - globals.length) return;

      leaks = filterLeaks(ok, globals);
      this._globals = this._globals.concat(leaks);

      if (leaks.length > 1) {
        this.fail(test, new Error('global leaks detected: ' + leaks.join(', ') + ''));
      } else if (leaks.length) {
        this.fail(test, new Error('global leak detected: ' + leaks[0]));
      }
    };

    /**
     * Fail the given `test`.
     *
     * @param {Test} test
     * @param {Error} err
     * @api private
     */

    Runner.prototype.fail = function(test, err){
      ++this.failures;
      test.state = 'failed';

      if ('string' == typeof err) {
        err = new Error('the string "' + err + '" was thrown, throw an Error :)');
      }

      this.emit('fail', test, err);
    };

    /**
     * Fail the given `hook` with `err`.
     *
     * Hook failures (currently) hard-end due
     * to that fact that a failing hook will
     * surely cause subsequent tests to fail,
     * causing jumbled reporting.
     *
     * @param {Hook} hook
     * @param {Error} err
     * @api private
     */

    Runner.prototype.failHook = function(hook, err){
      this.fail(hook, err);
      this.emit('end');
    };

    /**
     * Run hook `name` callbacks and then invoke `fn()`.
     *
     * @param {String} name
     * @param {Function} function
     * @api private
     */

    Runner.prototype.hook = function(name, fn){
      var suite = this.suite
          , hooks = suite['_' + name]
          , self = this
          , timer;

      function next(i) {
        var hook = hooks[i];
        if (!hook) return fn();
        self.currentRunnable = hook;

        self.emit('hook', hook);

        hook.on('error', function(err){
          self.failHook(hook, err);
        });

        hook.run(function(err){
          hook.removeAllListeners('error');
          var testError = hook.error();
          if (testError) self.fail(self.test, testError);
          if (err) return self.failHook(hook, err);
          self.emit('hook end', hook);
          next(++i);
        });
      }

      process.nextTick(function(){
        next(0);
      });
    };

    /**
     * Run hook `name` for the given array of `suites`
     * in order, and callback `fn(err)`.
     *
     * @param {String} name
     * @param {Array} suites
     * @param {Function} fn
     * @api private
     */

    Runner.prototype.hooks = function(name, suites, fn){
      var self = this
          , orig = this.suite;

      function next(suite) {
        self.suite = suite;

        if (!suite) {
          self.suite = orig;
          return fn();
        }

        self.hook(name, function(err){
          if (err) {
            self.suite = orig;
            return fn(err);
          }

          next(suites.pop());
        });
      }

      next(suites.pop());
    };

    /**
     * Run hooks from the top level down.
     *
     * @param {String} name
     * @param {Function} fn
     * @api private
     */

    Runner.prototype.hookUp = function(name, fn){
      var suites = [this.suite].concat(this.parents()).reverse();
      this.hooks(name, suites, fn);
    };

    /**
     * Run hooks from the bottom up.
     *
     * @param {String} name
     * @param {Function} fn
     * @api private
     */

    Runner.prototype.hookDown = function(name, fn){
      var suites = [this.suite].concat(this.parents());
      this.hooks(name, suites, fn);
    };

    /**
     * Return an array of parent Suites from
     * closest to furthest.
     *
     * @return {Array}
     * @api private
     */

    Runner.prototype.parents = function(){
      var suite = this.suite
          , suites = [];
      while (suite = suite.parent) suites.push(suite);
      return suites;
    };

    /**
     * Run the current test and callback `fn(err)`.
     *
     * @param {Function} fn
     * @api private
     */

    Runner.prototype.runTest = function(fn){
      var test = this.test
          , self = this;

      if (this.asyncOnly) test.asyncOnly = true;

      try {
        test.on('error', function(err){
          self.fail(test, err);
        });
        test.run(fn);
      } catch (err) {
        fn(err);
      }
    };

    /**
     * Run tests in the given `suite` and invoke
     * the callback `fn()` when complete.
     *
     * @param {Suite} suite
     * @param {Function} fn
     * @api private
     */

    Runner.prototype.runTests = function(suite, fn){
      var self = this
          , tests = suite.tests.slice()
          , test;

      function next(err) {
        // if we bail after first err
        if (self.failures && suite._bail) return fn();

        // next test
        test = tests.shift();

        // all done
        if (!test) return fn();

        // grep
        var match = self._grep.test(test.fullTitle());
        if (self._invert) match = !match;
        if (!match) return next();

        // pending
        if (test.pending) {
          self.emit('pending', test);
          self.emit('test end', test);
          return next();
        }

        // execute test and hook(s)
        self.emit('test', self.test = test);
        self.hookDown('beforeEach', function(){
          self.currentRunnable = self.test;
          self.runTest(function(err){
            test = self.test;

            if (err) {
              self.fail(test, err);
              self.emit('test end', test);
              return self.hookUp('afterEach', next);
            }

            test.state = 'passed';
            self.emit('pass', test);
            self.emit('test end', test);
            self.hookUp('afterEach', next);
          });
        });
      }

      this.next = next;
      next();
    };

    /**
     * Run the given `suite` and invoke the
     * callback `fn()` when complete.
     *
     * @param {Suite} suite
     * @param {Function} fn
     * @api private
     */

    Runner.prototype.runSuite = function(suite, fn){
      var total = this.grepTotal(suite)
          , self = this
          , i = 0;

      debug('run suite %s', suite.fullTitle());

      if (!total) return fn();

      this.emit('suite', this.suite = suite);

      function next() {
        var curr = suite.suites[i++];
        if (!curr) return done();
        self.runSuite(curr, next);
      }

      function done() {
        self.suite = suite;
        self.hook('afterAll', function(){
          self.emit('suite end', suite);
          fn();
        });
      }

      this.hook('beforeAll', function(){
        self.runTests(suite, next);
      });
    };

    /**
     * Handle uncaught exceptions.
     *
     * @param {Error} err
     * @api private
     */

    Runner.prototype.uncaught = function(err){
      debug('uncaught exception %s', err.message);
      var runnable = this.currentRunnable;
      if (!runnable || 'failed' == runnable.state) return;
      runnable.clearTimeout();
      err.uncaught = true;
      this.fail(runnable, err);

      // recover from test
      if ('test' == runnable.type) {
        this.emit('test end', runnable);
        this.hookUp('afterEach', this.next);
        return;
      }

      // bail on hooks
      this.emit('end');
    };

    /**
     * Run the root suite and invoke `fn(failures)`
     * on completion.
     *
     * @param {Function} fn
     * @return {Runner} for chaining
     * @api public
     */

    Runner.prototype.run = function(fn){
      var self = this
          , fn = fn || function(){};

      debug('start');

      // callback
      this.on('end', function(){
        debug('end');
        process.removeListener('uncaughtException', function(err){
          self.uncaught(err);
        });
        fn(self.failures);
      });

      // run suites
      this.emit('start');
      this.runSuite(this.suite, function(){
        debug('finished running');
        self.emit('end');
      });

      // uncaught exception
      process.on('uncaughtException', function(err){
        self.uncaught(err);
      });

      return this;
    };

    /**
     * Filter leaks with the given globals flagged as `ok`.
     *
     * @param {Array} ok
     * @param {Array} globals
     * @return {Array}
     * @api private
     */

    function filterLeaks(ok, globals) {
      return filter(globals, function(key){
        var matched = filter(ok, function(ok){
          if (~ok.indexOf('*')) return 0 == key.indexOf(ok.split('*')[0]);
          // Opera and IE expose global variables for HTML element IDs (issue #243)
          if (/^mocha-/.test(key)) return true;
          return key == ok;
        });
        return matched.length == 0 && (!global.navigator || 'onerror' !== key);
      });
    }

  }); // module: runner.js

  require.register("suite.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var EventEmitter = require('browser/events').EventEmitter
        , debug = require('browser/debug')('mocha:suite')
        , milliseconds = require('./ms')
        , utils = require('./utils')
        , Hook = require('./hook');

    /**
     * Expose `Suite`.
     */

    exports = module.exports = Suite;

    /**
     * Create a new `Suite` with the given `title`
     * and parent `Suite`. When a suite with the
     * same title is already present, that suite
     * is returned to provide nicer reporter
     * and more flexible meta-testing.
     *
     * @param {Suite} parent
     * @param {String} title
     * @return {Suite}
     * @api public
     */

    exports.create = function(parent, title){
      var suite = new Suite(title, parent.ctx);
      suite.parent = parent;
      if (parent.pending) suite.pending = true;
      title = suite.fullTitle();
      parent.addSuite(suite);
      return suite;
    };

    /**
     * Initialize a new `Suite` with the given
     * `title` and `ctx`.
     *
     * @param {String} title
     * @param {Context} ctx
     * @api private
     */

    function Suite(title, ctx) {
      this.title = title;
      this.ctx = ctx;
      this.suites = [];
      this.tests = [];
      this.pending = false;
      this._beforeEach = [];
      this._beforeAll = [];
      this._afterEach = [];
      this._afterAll = [];
      this.root = !title;
      this._timeout = 2000;
      this._slow = 75;
      this._bail = false;
    }

    /**
     * Inherit from `EventEmitter.prototype`.
     */

    Suite.prototype = new EventEmitter;
    Suite.prototype.constructor = Suite;


    /**
     * Return a clone of this `Suite`.
     *
     * @return {Suite}
     * @api private
     */

    Suite.prototype.clone = function(){
      var suite = new Suite(this.title);
      debug('clone');
      suite.ctx = this.ctx;
      suite.timeout(this.timeout());
      suite.slow(this.slow());
      suite.bail(this.bail());
      return suite;
    };

    /**
     * Set timeout `ms` or short-hand such as "2s".
     *
     * @param {Number|String} ms
     * @return {Suite|Number} for chaining
     * @api private
     */

    Suite.prototype.timeout = function(ms){
      if (0 == arguments.length) return this._timeout;
      if ('string' == typeof ms) ms = milliseconds(ms);
      debug('timeout %d', ms);
      this._timeout = parseInt(ms, 10);
      return this;
    };

    /**
     * Set slow `ms` or short-hand such as "2s".
     *
     * @param {Number|String} ms
     * @return {Suite|Number} for chaining
     * @api private
     */

    Suite.prototype.slow = function(ms){
      if (0 === arguments.length) return this._slow;
      if ('string' == typeof ms) ms = milliseconds(ms);
      debug('slow %d', ms);
      this._slow = ms;
      return this;
    };

    /**
     * Sets whether to bail after first error.
     *
     * @parma {Boolean} bail
     * @return {Suite|Number} for chaining
     * @api private
     */

    Suite.prototype.bail = function(bail){
      if (0 == arguments.length) return this._bail;
      debug('bail %s', bail);
      this._bail = bail;
      return this;
    };

    /**
     * Run `fn(test[, done])` before running tests.
     *
     * @param {Function} fn
     * @return {Suite} for chaining
     * @api private
     */

    Suite.prototype.beforeAll = function(fn){
      if (this.pending) return this;
      var hook = new Hook('"before all" hook', fn);
      hook.parent = this;
      hook.timeout(this.timeout());
      hook.slow(this.slow());
      hook.ctx = this.ctx;
      this._beforeAll.push(hook);
      this.emit('beforeAll', hook);
      return this;
    };

    /**
     * Run `fn(test[, done])` after running tests.
     *
     * @param {Function} fn
     * @return {Suite} for chaining
     * @api private
     */

    Suite.prototype.afterAll = function(fn){
      if (this.pending) return this;
      var hook = new Hook('"after all" hook', fn);
      hook.parent = this;
      hook.timeout(this.timeout());
      hook.slow(this.slow());
      hook.ctx = this.ctx;
      this._afterAll.push(hook);
      this.emit('afterAll', hook);
      return this;
    };

    /**
     * Run `fn(test[, done])` before each test case.
     *
     * @param {Function} fn
     * @return {Suite} for chaining
     * @api private
     */

    Suite.prototype.beforeEach = function(fn){
      if (this.pending) return this;
      var hook = new Hook('"before each" hook', fn);
      hook.parent = this;
      hook.timeout(this.timeout());
      hook.slow(this.slow());
      hook.ctx = this.ctx;
      this._beforeEach.push(hook);
      this.emit('beforeEach', hook);
      return this;
    };

    /**
     * Run `fn(test[, done])` after each test case.
     *
     * @param {Function} fn
     * @return {Suite} for chaining
     * @api private
     */

    Suite.prototype.afterEach = function(fn){
      if (this.pending) return this;
      var hook = new Hook('"after each" hook', fn);
      hook.parent = this;
      hook.timeout(this.timeout());
      hook.slow(this.slow());
      hook.ctx = this.ctx;
      this._afterEach.push(hook);
      this.emit('afterEach', hook);
      return this;
    };

    /**
     * Add a test `suite`.
     *
     * @param {Suite} suite
     * @return {Suite} for chaining
     * @api private
     */

    Suite.prototype.addSuite = function(suite){
      suite.parent = this;
      suite.timeout(this.timeout());
      suite.slow(this.slow());
      suite.bail(this.bail());
      this.suites.push(suite);
      this.emit('suite', suite);
      return this;
    };

    /**
     * Add a `test` to this suite.
     *
     * @param {Test} test
     * @return {Suite} for chaining
     * @api private
     */

    Suite.prototype.addTest = function(test){
      test.parent = this;
      test.timeout(this.timeout());
      test.slow(this.slow());
      test.ctx = this.ctx;
      this.tests.push(test);
      this.emit('test', test);
      return this;
    };

    /**
     * Return the full title generated by recursively
     * concatenating the parent's full title.
     *
     * @return {String}
     * @api public
     */

    Suite.prototype.fullTitle = function(){
      if (this.parent) {
        var full = this.parent.fullTitle();
        if (full) return full + ' ' + this.title;
      }
      return this.title;
    };

    /**
     * Return the total number of tests.
     *
     * @return {Number}
     * @api public
     */

    Suite.prototype.total = function(){
      return utils.reduce(this.suites, function(sum, suite){
        return sum + suite.total();
      }, 0) + this.tests.length;
    };

    /**
     * Iterates through each suite recursively to find
     * all tests. Applies a function in the format
     * `fn(test)`.
     *
     * @param {Function} fn
     * @return {Suite}
     * @api private
     */

    Suite.prototype.eachTest = function(fn){
      utils.forEach(this.tests, fn);
      utils.forEach(this.suites, function(suite){
        suite.eachTest(fn);
      });
      return this;
    };

  }); // module: suite.js

  require.register("test.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var Runnable = require('./runnable');

    /**
     * Expose `Test`.
     */

    module.exports = Test;

    /**
     * Initialize a new `Test` with the given `title` and callback `fn`.
     *
     * @param {String} title
     * @param {Function} fn
     * @api private
     */

    function Test(title, fn) {
      Runnable.call(this, title, fn);
      this.pending = !fn;
      this.type = 'test';
    }

    /**
     * Inherit from `Runnable.prototype`.
     */

    Test.prototype = new Runnable;
    Test.prototype.constructor = Test;


  }); // module: test.js

  require.register("utils.js", function(module, exports, require){

    /**
     * Module dependencies.
     */

    var fs = require('browser/fs')
        , path = require('browser/path')
        , join = path.join
        , debug = require('browser/debug')('mocha:watch');

    /**
     * Ignored directories.
     */

    var ignore = ['node_modules', '.git'];

    /**
     * Escape special characters in the given string of html.
     *
     * @param  {String} html
     * @return {String}
     * @api private
     */

    exports.escape = function(html){
      return String(html)
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
    };

    /**
     * Array#forEach (<=IE8)
     *
     * @param {Array} array
     * @param {Function} fn
     * @param {Object} scope
     * @api private
     */

    exports.forEach = function(arr, fn, scope){
      for (var i = 0, l = arr.length; i < l; i++)
        fn.call(scope, arr[i], i);
    };

    /**
     * Array#indexOf (<=IE8)
     *
     * @parma {Array} arr
     * @param {Object} obj to find index of
     * @param {Number} start
     * @api private
     */

    exports.indexOf = function(arr, obj, start){
      for (var i = start || 0, l = arr.length; i < l; i++) {
        if (arr[i] === obj)
          return i;
      }
      return -1;
    };

    /**
     * Array#reduce (<=IE8)
     *
     * @param {Array} array
     * @param {Function} fn
     * @param {Object} initial value
     * @api private
     */

    exports.reduce = function(arr, fn, val){
      var rval = val;

      for (var i = 0, l = arr.length; i < l; i++) {
        rval = fn(rval, arr[i], i, arr);
      }

      return rval;
    };

    /**
     * Array#filter (<=IE8)
     *
     * @param {Array} array
     * @param {Function} fn
     * @api private
     */

    exports.filter = function(arr, fn){
      var ret = [];

      for (var i = 0, l = arr.length; i < l; i++) {
        var val = arr[i];
        if (fn(val, i, arr)) ret.push(val);
      }

      return ret;
    };

    /**
     * Object.keys (<=IE8)
     *
     * @param {Object} obj
     * @return {Array} keys
     * @api private
     */

    exports.keys = Object.keys || function(obj) {
      var keys = []
          , has = Object.prototype.hasOwnProperty // for `window` on <=IE8

      for (var key in obj) {
        if (has.call(obj, key)) {
          keys.push(key);
        }
      }

      return keys;
    };

    /**
     * Watch the given `files` for changes
     * and invoke `fn(file)` on modification.
     *
     * @param {Array} files
     * @param {Function} fn
     * @api private
     */

    exports.watch = function(files, fn){
      var options = { interval: 100 };
      files.forEach(function(file){
        debug('file %s', file);
        fs.watchFile(file, options, function(curr, prev){
          if (prev.mtime < curr.mtime) fn(file);
        });
      });
    };

    /**
     * Ignored files.
     */

    function ignored(path){
      return !~ignore.indexOf(path);
    }

    /**
     * Lookup files in the given `dir`.
     *
     * @return {Array}
     * @api private
     */

    exports.files = function(dir, ret){
      ret = ret || [];

      fs.readdirSync(dir)
          .filter(ignored)
          .forEach(function(path){
            path = join(dir, path);
            if (fs.statSync(path).isDirectory()) {
              exports.files(path, ret);
            } else if (path.match(/\.(js|coffee)$/)) {
              ret.push(path);
            }
          });

      return ret;
    };

    /**
     * Compute a slug from the given `str`.
     *
     * @param {String} str
     * @return {String}
     * @api private
     */

    exports.slug = function(str){
      return str
          .toLowerCase()
          .replace(/ +/g, '-')
          .replace(/[^-\w]/g, '');
    };

    /**
     * Strip the function definition from `str`,
     * and re-indent for pre whitespace.
     */

    exports.clean = function(str) {
      str = str
          .replace(/^function *\(.*\) *{/, '')
          .replace(/\s+\}$/, '');

      var spaces = str.match(/^\n?( *)/)[1].length
          , re = new RegExp('^ {' + spaces + '}', 'gm');

      str = str.replace(re, '');

      return exports.trim(str);
    };

    /**
     * Escape regular expression characters in `str`.
     *
     * @param {String} str
     * @return {String}
     * @api private
     */

    exports.escapeRegexp = function(str){
      return str.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
    };

    /**
     * Trim the given `str`.
     *
     * @param {String} str
     * @return {String}
     * @api private
     */

    exports.trim = function(str){
      return str.replace(/^\s+|\s+$/g, '');
    };

    /**
     * Parse the given `qs`.
     *
     * @param {String} qs
     * @return {Object}
     * @api private
     */

    exports.parseQuery = function(qs){
      return exports.reduce(qs.replace('?', '').split('&'), function(obj, pair){
        var i = pair.indexOf('=')
            , key = pair.slice(0, i)
            , val = pair.slice(++i);

        obj[key] = decodeURIComponent(val);
        return obj;
      }, {});
    };

    /**
     * Highlight the given string of `js`.
     *
     * @param {String} js
     * @return {String}
     * @api private
     */

    function highlight(js) {
      return js
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\/\/(.*)/gm, '<span class="comment">//$1</span>')
          .replace(/('.*?')/gm, '<span class="string">$1</span>')
          .replace(/(\d+\.\d+)/gm, '<span class="number">$1</span>')
          .replace(/(\d+)/gm, '<span class="number">$1</span>')
          .replace(/\bnew *(\w+)/gm, '<span class="keyword">new</span> <span class="init">$1</span>')
          .replace(/\b(function|new|throw|return|var|if|else)\b/gm, '<span class="keyword">$1</span>')
    }

    /**
     * Highlight the contents of tag `name`.
     *
     * @param {String} name
     * @api private
     */

    exports.highlightTags = function(name) {
      var code = document.getElementsByTagName(name);
      for (var i = 0, len = code.length; i < len; ++i) {
        code[i].innerHTML = highlight(code[i].innerHTML);
      }
    };

  }); // module: utils.js
  /**
   * Node shims.
   *
   * These are meant only to allow
   * mocha.js to run untouched, not
   * to allow running node code in
   * the browser.
   */

  process = {};
  process.exit = function(status){};
  process.stdout = {};
  global = window;

  /**
   * next tick implementation.
   */

  process.nextTick = (function(){
    // postMessage behaves badly on IE8
    if (window.ActiveXObject || !window.postMessage) {
      return function(fn){ fn() };
    }

    // based on setZeroTimeout by David Baron
    // - http://dbaron.org/log/20100309-faster-timeouts
    var timeouts = []
        , name = 'mocha-zero-timeout'

    window.addEventListener('message', function(e){
      if (e.source == window && e.data == name) {
        if (e.stopPropagation) e.stopPropagation();
        if (timeouts.length) timeouts.shift()();
      }
    }, true);

    return function(fn){
      timeouts.push(fn);
      window.postMessage(name, '*');
    }
  })();

  /**
   * Remove uncaughtException listener.
   */

  process.removeListener = function(e){
    if ('uncaughtException' == e) {
      window.onerror = null;
    }
  };

  /**
   * Implements uncaughtException listener.
   */

  process.on = function(e, fn){
    if ('uncaughtException' == e) {
      window.onerror = function(err, url, line){
        fn(new Error(err + ' (' + url + ':' + line + ')'));
      };
    }
  };

// boot
  ;(function(){

    /**
     * Expose mocha.
     */

    var Mocha = window.Mocha = require('mocha'),
        mocha = window.mocha = new Mocha({ reporter: 'html' });

    /**
     * Override ui to ensure that the ui functions are initialized.
     * Normally this would happen in Mocha.prototype.loadFiles.
     */

    mocha.ui = function(ui){
      Mocha.prototype.ui.call(this, ui);
      this.suite.emit('pre-require', window, null, this);
      return this;
    };

    /**
     * Setup mocha with the given setting options.
     */

    mocha.setup = function(opts){
      if ('string' == typeof opts) opts = { ui: opts };
      for (var opt in opts) this[opt](opts[opt]);
      return this;
    };

    /**
     * Run mocha, returning the Runner.
     */

    mocha.run = function(fn){
      var options = mocha.options;
      mocha.globals('location');

      var query = Mocha.utils.parseQuery(window.location.search || '');
      if (query.grep) mocha.grep(query.grep);
      if (query.invert) mocha.invert();

      return Mocha.prototype.run.call(mocha, function(){
        Mocha.utils.highlightTags('code');
        if (fn) fn();
      });
    };
  })();
})();
(function() {

  this.Teabag = (function() {

    function Teabag() {}

    Teabag.defer = false;

    Teabag.slow = 75;

    Teabag.root = null;

    Teabag.started = false;

    Teabag.finished = false;

    Teabag.Reporters = {};

    Teabag.Date = Date;

    Teabag.location = window.location;

    Teabag.console = window.console;

    Teabag.messages = [];

    Teabag.execute = function() {
      if (this.defer) {
        this.defer = false;
        return;
      }
      this.started = true;
      return new Teabag.Runner();
    };

    Teabag.log = function() {
      var _ref;
      this.messages.push(arguments[0]);
      return (_ref = this.console).log.apply(_ref, arguments);
    };

    Teabag.getMessages = function() {
      var messages;
      messages = this.messages;
      this.messages = [];
      return messages;
    };

    return Teabag;

  })();

}).call(this);
(function() {

  Teabag.Runner = (function() {

    Runner.run = false;

    function Runner() {
      if (this.constructor.run) {
        return;
      }
      this.constructor.run = true;
      this.fixturePath = "" + Teabag.root + "/fixtures";
      this.params = this.getParams();
      this.setup();
    }

    Runner.prototype.getParams = function() {
      var name, param, params, value, _i, _len, _ref, _ref1;
      params = {};
      _ref = Teabag.location.search.substring(1).split("&");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        param = _ref[_i];
        _ref1 = param.split("="), name = _ref1[0], value = _ref1[1];
        params[decodeURIComponent(name)] = decodeURIComponent(value);
      }
      return params;
    };

    Runner.prototype.getReporter = function() {
      if (this.params["reporter"]) {
        return Teabag.Reporters[this.params["reporter"]];
      } else {
        if (window.navigator.userAgent.match(/PhantomJS/)) {
          return Teabag.Reporters.Console;
        } else {
          return Teabag.Reporters.HTML;
        }
      }
    };

    Runner.prototype.setup = function() {};

    return Runner;

  })();

}).call(this);
(function() {
  var __slice = [].slice;

  Teabag.fixture = (function() {
    var addContent, cleanup, create, load, loadComplete, preload, putContent, set, xhr, xhrRequest,
      _this = this;

    fixture.cache = {};

    fixture.el = null;

    fixture.json = [];

    fixture.preload = function() {
      var url, urls, _i, _len, _results;
      urls = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = urls.length; _i < _len; _i++) {
        url = urls[_i];
        _results.push(preload(url));
      }
      return _results;
    };

    fixture.load = function() {
      var append, index, url, urls, _i, _j, _len, _results;
      urls = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), append = arguments[_i++];
      if (append == null) {
        append = false;
      }
      if (typeof append !== "boolean") {
        urls.push(append);
        append = false;
      }
      _results = [];
      for (index = _j = 0, _len = urls.length; _j < _len; index = ++_j) {
        url = urls[index];
        _results.push(load(url, append || index > 0));
      }
      return _results;
    };

    fixture.set = function() {
      var append, html, htmls, index, _i, _j, _len, _results;
      htmls = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), append = arguments[_i++];
      if (append == null) {
        append = false;
      }
      if (typeof append !== "boolean") {
        htmls.push(append);
        append = false;
      }
      _results = [];
      for (index = _j = 0, _len = htmls.length; _j < _len; index = ++_j) {
        html = htmls[index];
        _results.push(set(html, append || index > 0));
      }
      return _results;
    };

    fixture.cleanup = function() {
      return cleanup();
    };

    function fixture() {
      Teabag.fixture.load.apply(window, arguments);
    }

    xhr = null;

    preload = function(url) {
      return load(url, false, true);
    };

    load = function(url, append, preload) {
      var cached, value;
      if (preload == null) {
        preload = false;
      }
      if (cached = Teabag.fixture.cache[url]) {
        return loadComplete(url, cached.type, cached.content, append, preload);
      }
      value = null;
      xhrRequest(url, function() {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          throw "Unable to load fixture \"" + url + "\".";
        }
        return value = loadComplete(url, xhr.getResponseHeader("content-type"), xhr.responseText, append, preload);
      });
      return value;
    };

    loadComplete = function(url, type, content, append, preload) {
      Teabag.fixture.cache[url] = {
        type: type,
        content: content
      };
      if (type.match(/application\/json;/)) {
        return fixture.json[fixture.json.push(JSON.parse(content)) - 1];
      }
      if (preload) {
        return content;
      }
      if (append) {
        addContent(content);
      } else {
        putContent(content);
      }
      return Teabag.fixture.el;
    };

    set = function(content, append) {
      if (append) {
        return addContent(content);
      } else {
        return putContent(content);
      }
    };

    putContent = function(content) {
      cleanup();
      create();
      return Teabag.fixture.el.innerHTML = content;
    };

    addContent = function(content) {
      if (!Teabag.fixture.el) {
        create();
      }
      return Teabag.fixture.el.innerHTML += content;
    };

    create = function() {
      var _ref;
      Teabag.fixture.el = document.createElement("div");
      Teabag.fixture.el.id = "teabag-fixtures";
      return (_ref = document.body) != null ? _ref.appendChild(Teabag.fixture.el) : void 0;
    };

    cleanup = function() {
      var _base, _ref, _ref1;
      (_base = Teabag.fixture).el || (_base.el = document.getElementById("teabag-fixtures"));
      if ((_ref = Teabag.fixture.el) != null) {
        if ((_ref1 = _ref.parentNode) != null) {
          _ref1.removeChild(Teabag.fixture.el);
        }
      }
      return Teabag.fixture.el = null;
    };

    xhrRequest = function(url, callback) {
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        try {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
          try {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (e) {

          }
        }
      }
      if (!xhr) {
        throw "Unable to make Ajax Request";
      }
      xhr.onreadystatechange = callback;
      xhr.open("GET", "" + Teabag.root + "/fixtures/" + url, false);
      return xhr.send();
    };

    return fixture;

  }).call(this);

}).call(this);
(function() {

  Teabag.Reporters.BaseView = (function() {

    function BaseView() {
      this.elements = {};
      this.build();
    }

    BaseView.prototype.build = function(className) {
      return this.el = this.createEl("li", className);
    };

    BaseView.prototype.appendTo = function(el) {
      return el.appendChild(this.el);
    };

    BaseView.prototype.append = function(el) {
      return this.el.appendChild(el);
    };

    BaseView.prototype.createEl = function(type, className) {
      var el;
      if (className == null) {
        className = "";
      }
      el = document.createElement(type);
      el.className = className;
      return el;
    };

    BaseView.prototype.findEl = function(id) {
      var _base;
      this.elements || (this.elements = {});
      return (_base = this.elements)[id] || (_base[id] = document.getElementById("teabag-" + id));
    };

    BaseView.prototype.setText = function(id, value) {
      var el;
      el = this.findEl(id);
      return el.innerHTML = value;
    };

    BaseView.prototype.setHtml = function(id, value, add) {
      var el;
      if (add == null) {
        add = false;
      }
      el = this.findEl(id);
      if (add) {
        return el.innerHTML += value;
      } else {
        return el.innerHTML = value;
      }
    };

    BaseView.prototype.setClass = function(id, value) {
      var el;
      el = this.findEl(id);
      return el.className = value;
    };

    BaseView.prototype.htmlSafe = function(str) {
      var el;
      el = document.createElement("div");
      el.appendChild(document.createTextNode(str));
      return el.innerHTML;
    };

    return BaseView;

  })();

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Teabag.Reporters.HTML = (function(_super) {

    __extends(HTML, _super);

    function HTML() {
      this.toggleConfig = __bind(this.toggleConfig, this);

      this.reportRunnerResults = __bind(this.reportRunnerResults, this);
      this.start = new Teabag.Date().getTime();
      this.config = {
        "use-catch": true,
        "build-full-report": false,
        "display-progress": true
      };
      this.total = {
        exist: 0,
        run: 0,
        passes: 0,
        failures: 0,
        skipped: 0
      };
      this.views = {
        specs: {},
        suites: {}
      };
      this.filter = false;
      this.readConfig();
      HTML.__super__.constructor.apply(this, arguments);
    }

    HTML.prototype.build = function() {
      var _ref;
      this.buildLayout();
      this.el = this.findEl("report-all");
      this.setText("env-info", this.envInfo());
      this.setText("version", Teabag.version);
      this.findEl("toggles").onclick = this.toggleConfig;
      if ((_ref = this.findEl("suite-select")) != null) {
        _ref.onchange = this.changeSuite;
      }
      this.showConfiguration();
      return this.buildProgress();
    };

    HTML.prototype.buildLayout = function() {
      var el;
      el = this.createEl("div");
      document.body.appendChild(el);
      return el.innerHTML = "<div id=\"teabag-html-reporter\">\n  <div class=\"teabag-clearfix\">\n    <div id=\"teabag-title\">\n      <h1>Teabag</h1>\n      <ul>\n        <li>version: <b id=\"teabag-version\"></b></li>\n        <li id=\"teabag-env-info\"></li>\n      </ul>\n    </div>\n    <div id=\"teabag-progress\"></div>\n    <ul id=\"teabag-stats\">\n      <li>passes: <b id=\"teabag-stats-passes\">0</b></li>\n      <li>failures: <b id=\"teabag-stats-failures\">0</b></li>\n      <li>skipped: <b id=\"teabag-stats-skipped\">0</b></li>\n      <li>duration: <b id=\"teabag-stats-duration\">&infin;</b></li>\n    </ul>\n  </div>\n\n  <div id=\"teabag-controls\" class=\"teabag-clearfix\">\n    <div id=\"teabag-toggles\">\n      <button id=\"teabag-use-catch\" title=\"Toggle using try/catch wrappers when possible\">Try/Catch</button>\n      <button id=\"teabag-build-full-report\" title=\"Toggle building the full report\">Full Report</button>\n      <button id=\"teabag-display-progress\" title=\"Toggle displaying progress as tests run\">Progress</button>\n    </div>\n    <div id=\"teabag-filter\">\n      " + (this.buildSuiteSelect()) + "\n      <button onclick=\"window.location.href = window.location.pathname\">Run All</button>\n      <span id=\"teabag-filter-info\">\n    </div>\n  </div>\n\n  <hr/>\n\n  <div id=\"teabag-report\">\n    <ol id=\"teabag-report-failures\"></ol>\n    <ol id=\"teabag-report-all\"></ol>\n  </div>\n</div>";
    };

    HTML.prototype.buildSuiteSelect = function() {
      var options, suite, _i, _len, _ref;
      if (Teabag.suites.all.length === 1) {
        return "";
      }
      options = [];
      _ref = Teabag.suites.all;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        suite = _ref[_i];
        options.push("<option" + (Teabag.suites.active === suite ? " selected='selected'" : "") + " value=\"" + suite + "\">" + suite + " suite</option>");
      }
      return "<select id=\"teabag-suite-select\">" + (options.join("")) + "</select>";
    };

    HTML.prototype.buildProgress = function() {
      this.progress = Teabag.Reporters.HTML.ProgressView.create(this.config["display-progress"]);
      return this.progress.appendTo(this.findEl("progress"));
    };

    HTML.prototype.reportRunnerStarting = function(runner) {
      this.total.exist = runner.total || runner.specs().length;
      if (this.total.exist) {
        return this.setText("stats-duration", "...");
      }
    };

    HTML.prototype.reportSpecStarting = function(spec) {
      spec = new Teabag.Spec(spec);
      if (this.config["build-full-report"]) {
        this.reportView = new Teabag.Reporters.HTML.SpecView(spec, this);
      }
      return this.specStart = new Teabag.Date().getTime();
    };

    HTML.prototype.reportSpecResults = function(spec) {
      this.total.run += 1;
      this.updateProgress();
      return this.updateStatus(spec);
    };

    HTML.prototype.reportRunnerResults = function() {
      if (!this.total.run) {
        return;
      }
      this.setText("stats-duration", this.elapsedTime());
      if (!this.total.failures) {
        this.setStatus("passed");
      }
      this.setText("stats-passes", this.total.passes);
      this.setText("stats-failures", this.total.failures);
      if (this.total.run < this.total.exist) {
        this.total.skipped = this.total.exist - this.total.run;
        this.total.run = this.total.exist;
      }
      this.setText("stats-skipped", this.total.skipped);
      return this.updateProgress();
    };

    HTML.prototype.elapsedTime = function() {
      return "" + (((new Teabag.Date().getTime() - this.start) / 1000).toFixed(3)) + "s";
    };

    HTML.prototype.updateStat = function(name, value) {
      if (!this.config["display-progress"]) {
        return;
      }
      return this.setText("stats-" + name, value);
    };

    HTML.prototype.updateStatus = function(spec) {
      var elapsed, result, _ref, _ref1;
      spec = new Teabag.Spec(spec);
      result = spec.result();
      if (result.skipped || result.status === "pending") {
        this.updateStat("skipped", this.total.skipped += 1);
        return;
      }
      elapsed = new Teabag.Date().getTime() - this.specStart;
      if (result.status === "passed") {
        this.updateStat("passes", this.total.passes += 1);
        return (_ref = this.reportView) != null ? _ref.updateState("passed", elapsed) : void 0;
      } else {
        this.updateStat("failures", this.total.failures += 1);
        if ((_ref1 = this.reportView) != null) {
          _ref1.updateState("failed", elapsed);
        }
        if (!this.config["build-full-report"]) {
          new Teabag.Reporters.HTML.FailureView(spec).appendTo(this.findEl("report-failures"));
        }
        return this.setStatus("failed");
      }
    };

    HTML.prototype.updateProgress = function() {
      return this.progress.update(this.total.exist, this.total.run);
    };

    HTML.prototype.showConfiguration = function() {
      var key, value, _ref, _results;
      _ref = this.config;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(this.setClass(key, value ? "active" : ""));
      }
      return _results;
    };

    HTML.prototype.setStatus = function(status) {
      return document.body.className = "teabag-" + status;
    };

    HTML.prototype.setFilter = function(filter) {
      if (!filter) {
        return;
      }
      this.setClass("filter", "teabag-filtered");
      return this.setHtml("filter-info", "" + filter, true);
    };

    HTML.prototype.readConfig = function() {
      var config;
      if (config = this.cookie("teabag")) {
        return this.config = config;
      }
    };

    HTML.prototype.toggleConfig = function(e) {
      var button, name;
      button = e.target;
      if (button.tagName.toLowerCase() !== "button") {
        return;
      }
      name = button.getAttribute("id").replace(/^teabag-/, "");
      this.config[name] = !this.config[name];
      this.cookie("teabag", this.config);
      return this.refresh();
    };

    HTML.prototype.changeSuite = function() {
      return window.location.href = "/teabag/" + this.options[this.options.selectedIndex].value;
    };

    HTML.prototype.refresh = function() {
      return window.location.href = window.location.href;
    };

    HTML.prototype.cookie = function(name, value) {
      var date, match;
      if (value == null) {
        value = void 0;
      }
      if (value === void 0) {
        name = name.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
        match = document.cookie.match(new RegExp("(?:^|;)\\s?" + name + "=(.*?)(?:;|$)", "i"));
        return match && JSON.parse(unescape(match[1]).split(" ")[0]);
      } else {
        date = new Teabag.Date();
        date.setDate(date.getDate() + 365);
        return document.cookie = "" + name + "=" + (escape(JSON.stringify(value))) + "; path=\"/\"; expires=" + (date.toUTCString()) + ";";
      }
    };

    return HTML;

  })(Teabag.Reporters.BaseView);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Teabag.Reporters.HTML.ProgressView = (function(_super) {

    __extends(ProgressView, _super);

    function ProgressView() {
      return ProgressView.__super__.constructor.apply(this, arguments);
    }

    ProgressView.create = function(displayProgress) {
      if (displayProgress == null) {
        displayProgress = true;
      }
      if (!displayProgress) {
        return new Teabag.Reporters.HTML.ProgressView();
      }
      if (Teabag.Reporters.HTML.RadialProgressView.supported) {
        return new Teabag.Reporters.HTML.RadialProgressView();
      } else {
        return Teabag.Reporters.HTML.SimpleProgressView();
      }
    };

    ProgressView.prototype.build = function() {
      return this.el = this.createEl("div", "teabag-indicator modeset-logo");
    };

    ProgressView.prototype.update = function() {};

    return ProgressView;

  })(Teabag.Reporters.BaseView);

  Teabag.Reporters.HTML.SimpleProgressView = (function(_super) {

    __extends(SimpleProgressView, _super);

    function SimpleProgressView() {
      return SimpleProgressView.__super__.constructor.apply(this, arguments);
    }

    SimpleProgressView.prototype.build = function() {
      this.el = this.createEl("div", "simple-progress");
      return this.el.innerHTML = "<em id=\"teabag-progress-percent\">0%</em>\n<span id=\"teabag-progress-span\" class=\"teabag-indicator\"></span>";
    };

    SimpleProgressView.prototype.update = function(total, run) {
      var percent;
      percent = total ? Math.ceil((run * 100) / total) : 0;
      return this.setHtml("progress-percent", "" + percent + "%");
    };

    return SimpleProgressView;

  })(Teabag.Reporters.HTML.ProgressView);

  Teabag.Reporters.HTML.RadialProgressView = (function(_super) {

    __extends(RadialProgressView, _super);

    function RadialProgressView() {
      return RadialProgressView.__super__.constructor.apply(this, arguments);
    }

    RadialProgressView.supported = !!document.createElement("canvas").getContext;

    RadialProgressView.prototype.build = function() {
      this.el = this.createEl("div", "teabag-indicator radial-progress");
      return this.el.innerHTML = "<canvas id=\"teabag-progress-canvas\"></canvas>\n<em id=\"teabag-progress-percent\">0%</em>";
    };

    RadialProgressView.prototype.appendTo = function() {
      var canvas;
      RadialProgressView.__super__.appendTo.apply(this, arguments);
      this.size = 80;
      try {
        canvas = this.findEl("progress-canvas");
        canvas.width = canvas.height = canvas.style.width = canvas.style.height = this.size;
        this.ctx = canvas.getContext("2d");
        this.ctx.strokeStyle = "#fff";
        return this.ctx.lineWidth = 1.5;
      } catch (e) {

      }
    };

    RadialProgressView.prototype.update = function(total, run) {
      var half, percent;
      percent = total ? Math.ceil((run * 100) / total) : 0;
      this.setHtml("progress-percent", "" + percent + "%");
      if (!this.ctx) {
        return;
      }
      half = this.size / 2;
      this.ctx.clearRect(0, 0, this.size, this.size);
      this.ctx.beginPath();
      this.ctx.arc(half, half, half - 1, 0, Math.PI * 2 * (percent / 100), false);
      return this.ctx.stroke();
    };

    return RadialProgressView;

  })(Teabag.Reporters.HTML.ProgressView);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Teabag.Reporters.HTML.SpecView = (function(_super) {
    var viewId;

    __extends(SpecView, _super);

    viewId = 0;

    function SpecView(spec, reporter) {
      this.spec = spec;
      this.reporter = reporter;
      this.views = this.reporter.views;
      this.spec.viewId = viewId += 1;
      this.views.specs[this.spec.viewId] = this;
      SpecView.__super__.constructor.apply(this, arguments);
    }

    SpecView.prototype.build = function() {
      var classes;
      classes = ["spec"];
      if (this.spec.pending) {
        classes.push("state-pending");
      }
      SpecView.__super__.build.call(this, classes.join(" "));
      this.el.innerHTML = "<a href=\"" + this.spec.link + "\">" + this.spec.description + "</a>";
      this.parentView = this.buildParent();
      return this.parentView.append(this.el);
    };

    SpecView.prototype.buildParent = function() {
      var parent, view;
      parent = this.spec.parent;
      if (parent.viewId) {
        return this.views.suites[parent.viewId];
      } else {
        view = new Teabag.Reporters.HTML.SuiteView(parent, this.reporter);
        return this.views.suites[view.suite.viewId] = view;
      }
    };

    SpecView.prototype.buildErrors = function() {
      var div, error, html, _i, _len, _ref;
      div = this.createEl("div");
      html = "";
      _ref = this.spec.errors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        error = _ref[_i];
        html += "<strong>" + (this.htmlSafe(error.message)) + "</strong><br/>" + (this.htmlSafe(error.stack || "Stack trace unavailable"));
      }
      div.innerHTML = html;
      return this.append(div);
    };

    SpecView.prototype.updateState = function(state, elapsed) {
      var classes, result, _base;
      result = this.spec.result();
      classes = ["state-" + state];
      if (elapsed > Teabag.slow) {
        classes.push("slow");
      }
      if (state !== "failed") {
        this.el.innerHTML += "<span>" + elapsed + "ms</span>";
      }
      this.el.className = classes.join(" ");
      if (result.status !== "passed") {
        this.buildErrors();
      }
      return typeof (_base = this.parentView).updateState === "function" ? _base.updateState(state) : void 0;
    };

    return SpecView;

  })(Teabag.Reporters.BaseView);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Teabag.Reporters.HTML.FailureView = (function(_super) {

    __extends(FailureView, _super);

    function FailureView(spec) {
      this.spec = spec;
      FailureView.__super__.constructor.apply(this, arguments);
    }

    FailureView.prototype.build = function() {
      var error, html, _i, _len, _ref;
      FailureView.__super__.build.call(this, "spec");
      html = "<h1 class=\"teabag-clearfix\"><a href=\"" + this.spec.link + "\">" + this.spec.fullDescription + "</a></h1>";
      _ref = this.spec.errors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        error = _ref[_i];
        html += "<div><strong>" + (this.htmlSafe(error.message)) + "</strong><br/>" + (this.htmlSafe(error.stack || "Stack trace unavailable")) + "</div>";
      }
      return this.el.innerHTML = html;
    };

    return FailureView;

  })(Teabag.Reporters.BaseView);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Teabag.Reporters.HTML.SuiteView = (function(_super) {
    var viewId;

    __extends(SuiteView, _super);

    viewId = 0;

    function SuiteView(suite, reporter) {
      this.suite = suite;
      this.reporter = reporter;
      this.views = this.reporter.views;
      this.suite.viewId = viewId += 1;
      this.views.suites[this.suite.viewId] = this;
      this.suite = new Teabag.Suite(suite);
      SuiteView.__super__.constructor.apply(this, arguments);
    }

    SuiteView.prototype.build = function() {
      SuiteView.__super__.build.call(this, "suite");
      this.el.innerHTML = "<h1><a href=\"" + this.suite.link + "\">" + this.suite.description + "</a></h1>";
      this.parentView = this.buildParent();
      return this.parentView.append(this.el);
    };

    SuiteView.prototype.buildParent = function() {
      var parent, view;
      parent = this.suite.parent;
      if (!parent) {
        return this.reporter;
      }
      if (parent.viewId) {
        return this.views.suites[parent.viewId];
      } else {
        view = new Teabag.Reporters.HTML.SuiteView(parent, this.reporter);
        return this.views.suites[view.suite.viewId] = view;
      }
    };

    SuiteView.prototype.append = function(el) {
      if (!this.ol) {
        SuiteView.__super__.append.call(this, this.ol = this.createEl("ol"));
      }
      return this.ol.appendChild(el);
    };

    SuiteView.prototype.updateState = function(state) {
      var _base;
      if (this.state === "failed") {
        return;
      }
      this.el.className = "" + (this.el.className.replace(/\s?state-\w+/, "")) + " state-" + state;
      if (typeof (_base = this.parentView).updateState === "function") {
        _base.updateState(state);
      }
      return this.state = state;
    };

    return SuiteView;

  })(Teabag.Reporters.BaseView);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Teabag.Reporters.Console = (function() {

    function Console() {
      this.reportRunnerResults = __bind(this.reportRunnerResults, this);
      this.start = new Teabag.Date();
      this.suites = {};
    }

    Console.prototype.reportRunnerStarting = function(runner) {
      return this.log({
        type: "runner",
        total: runner.total || runner.specs().length,
        start: JSON.parse(JSON.stringify(this.start))
      });
    };

    Console.prototype.reportSuites = function() {
      var index, suite, _i, _len, _ref, _results;
      _ref = this.spec.getParents();
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        suite = _ref[index];
        if (this.suites[suite.fullDescription]) {
          continue;
        }
        this.suites[suite.fullDescription] = true;
        _results.push(this.log({
          type: "suite",
          label: suite.description,
          level: index
        }));
      }
      return _results;
    };

    Console.prototype.reportSpecResults = function(spec) {
      var result;
      this.spec = new Teabag.Spec(spec);
      result = this.spec.result();
      this.reportSuites();
      switch (result.status) {
        case "pending":
          return this.trackPending();
        case "failed":
          return this.trackFailure();
        default:
          return this.log({
            type: "spec",
            suite: this.spec.suiteName,
            label: this.spec.description,
            status: result.status,
            skipped: result.skipped
          });
      }
    };

    Console.prototype.trackPending = function() {
      var result;
      result = this.spec.result();
      return this.log({
        type: "spec",
        suite: this.spec.suiteName,
        label: this.spec.description,
        status: result.status,
        skipped: result.skipped
      });
    };

    Console.prototype.trackFailure = function() {
      var error, result, _i, _len, _ref, _results;
      result = this.spec.result();
      _ref = this.spec.errors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        error = _ref[_i];
        _results.push(this.log({
          type: "spec",
          suite: this.spec.suiteName,
          label: this.spec.description,
          status: result.status,
          skipped: result.skipped,
          link: this.spec.link,
          message: error.message,
          trace: error.stack || error.message || "Stack Trace Unavailable"
        }));
      }
      return _results;
    };

    Console.prototype.reportRunnerResults = function() {
      this.log({
        type: "result",
        elapsed: ((new Teabag.Date().getTime() - this.start.getTime()) / 1000).toFixed(5)
      });
      return Teabag.finished = true;
    };

    Console.prototype.log = function(obj) {
      if (obj == null) {
        obj = {};
      }
      obj["_teabag"] = true;
      return Teabag.log(JSON.stringify(obj));
    };

    return Console;

  })();

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Teabag.Reporters.Console = (function(_super) {

    __extends(Console, _super);

    function Console(runner) {
      this.reportSpecResults = __bind(this.reportSpecResults, this);
      Console.__super__.constructor.apply(this, arguments);
      this.reportRunnerStarting(runner);
      runner.on("fail", this.reportSpecResults);
      runner.on("test end", this.reportSpecResults);
      runner.on("end", this.reportRunnerResults);
    }

    Console.prototype.reportSpecResults = function(spec, err) {
      if (err) {
        spec.err = err;
        return;
      }
      return Console.__super__.reportSpecResults.apply(this, arguments);
    };

    return Console;

  })(Teabag.Reporters.Console);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Teabag.Reporters.HTML = (function(_super) {

    __extends(HTML, _super);

    function HTML(runner) {
      this.reportSpecResults = __bind(this.reportSpecResults, this);
      HTML.__super__.constructor.apply(this, arguments);
      this.setFilter(Teabag.Reporters.HTML.filter);
      this.reportRunnerStarting(runner);
      runner.on("fail", this.reportSpecResults);
      runner.on("test end", this.reportSpecResults);
      runner.on("end", this.reportRunnerResults);
    }

    HTML.prototype.reportSpecResults = function(spec, err) {
      if (err) {
        spec.err = err;
        return;
      }
      this.reportSpecStarting(spec);
      return HTML.__super__.reportSpecResults.apply(this, arguments);
    };

    HTML.prototype.envInfo = function() {
      return "mocha 1.7.4";
    };

    return HTML;

  })(Teabag.Reporters.HTML);

  Teabag.Reporters.HTML.SpecView = (function(_super) {

    __extends(SpecView, _super);

    function SpecView() {
      return SpecView.__super__.constructor.apply(this, arguments);
    }

    SpecView.prototype.updateState = function(state) {
      return SpecView.__super__.updateState.call(this, state, this.spec.spec.duration);
    };

    return SpecView;

  })(Teabag.Reporters.HTML.SpecView);

}).call(this);
(function() {
  var env,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Teabag.Runner = (function(_super) {

    __extends(Runner, _super);

    function Runner() {
      Runner.__super__.constructor.apply(this, arguments);
      env.run();
      env.started = true;
      afterEach(function() {
        return Teabag.fixture.cleanup();
      });
    }

    Runner.prototype.setup = function() {
      var reporter;
      reporter = this.getReporter();
      reporter.filter = this.params["grep"];
      return env.setup({
        reporter: reporter
      });
    };

    return Runner;

  })(Teabag.Runner);

  Teabag.Spec = (function() {

    function Spec(spec) {
      this.spec = spec;
      this.fullDescription = this.spec.fullTitle();
      this.description = this.spec.title;
      this.link = "?grep=" + (encodeURIComponent(this.fullDescription));
      this.parent = this.spec.parent;
      this.suiteName = this.parent.fullTitle();
      this.viewId = this.spec.viewId;
      this.pending = this.spec.pending;
    }

    Spec.prototype.errors = function() {
      if (!this.spec.err) {
        return [];
      }
      return [this.spec.err];
    };

    Spec.prototype.getParents = function() {
      var parent;
      if (this.parents) {
        return this.parents;
      }
      this.parents || (this.parents = []);
      parent = this.parent;
      while (parent) {
        parent = new Teabag.Suite(parent);
        this.parents.unshift(parent);
        parent = parent.parent;
      }
      return this.parents;
    };

    Spec.prototype.result = function() {
      var status;
      status = "failed";
      if (this.spec.state === "passed" || this.spec.state === "skipped") {
        status = "passed";
      }
      if (this.spec.pending) {
        status = "pending";
      }
      return {
        status: status,
        skipped: this.spec.state === "skipped"
      };
    };

    return Spec;

  })();

  Teabag.Suite = (function() {

    function Suite(suite) {
      this.suite = suite;
      this.fullDescription = this.suite.fullTitle();
      this.description = this.suite.title;
      this.link = "?grep=" + (encodeURIComponent(this.fullDescription));
      this.parent = this.suite.parent.root ? null : this.suite.parent;
      this.viewId = this.suite.viewId;
    }

    return Suite;

  })();

  Teabag.fixture = (function(_super) {

    __extends(fixture, _super);

    function fixture() {
      return fixture.__super__.constructor.apply(this, arguments);
    }

    window.fixture = fixture;

    fixture.load = function() {
      var args,
        _this = this;
      args = arguments;
      if (env.started) {
        return fixture.__super__.constructor.load.apply(this, arguments);
      } else {
        return beforeEach(function() {
          return fixture.__super__.constructor.load.apply(_this, args);
        });
      }
    };

    fixture.set = function() {
      var args,
        _this = this;
      args = arguments;
      if (env.started) {
        return fixture.__super__.constructor.set.apply(this, arguments);
      } else {
        return beforeEach(function() {
          return fixture.__super__.constructor.set.apply(_this, args);
        });
      }
    };

    return fixture;

  })(Teabag.fixture);

  env = mocha.setup("bdd");

}).call(this);
