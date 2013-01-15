(function() {

  this.App = {
    modules: {}
  };

  this.require = function(m) {
    return this.App.modules[m.toLowerCase()];
  };

}).call(this);
;(function(){var module={},am=App.modules;module.exports=null;(function() {
  var $, Controller, Events, Log, Model, Module, Spine, createObject, isArray, isBlank, makeArray, moduleKeywords,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Events = {
    bind: function(ev, callback) {
      var calls, evs, name, _i, _len;
      evs = ev.split(' ');
      calls = this.hasOwnProperty('_callbacks') && this._callbacks || (this._callbacks = {});
      for (_i = 0, _len = evs.length; _i < _len; _i++) {
        name = evs[_i];
        calls[name] || (calls[name] = []);
        calls[name].push(callback);
      }
      return this;
    },
    one: function(ev, callback) {
      return this.bind(ev, function() {
        this.unbind(ev, arguments.callee);
        return callback.apply(this, arguments);
      });
    },
    trigger: function() {
      var args, callback, ev, list, _i, _len, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      ev = args.shift();
      list = this.hasOwnProperty('_callbacks') && ((_ref = this._callbacks) != null ? _ref[ev] : void 0);
      if (!list) {
        return;
      }
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        callback = list[_i];
        if (callback.apply(this, args) === false) {
          break;
        }
      }
      return true;
    },
    unbind: function(ev, callback) {
      var cb, i, list, _i, _len, _ref;
      if (!ev) {
        this._callbacks = {};
        return this;
      }
      list = (_ref = this._callbacks) != null ? _ref[ev] : void 0;
      if (!list) {
        return this;
      }
      if (!callback) {
        delete this._callbacks[ev];
        return this;
      }
      for (i = _i = 0, _len = list.length; _i < _len; i = ++_i) {
        cb = list[i];
        if (!(cb === callback)) {
          continue;
        }
        list = list.slice();
        list.splice(i, 1);
        this._callbacks[ev] = list;
        break;
      }
      return this;
    }
  };

  Log = {
    trace: true,
    logPrefix: '(App)',
    log: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (!this.trace) {
        return;
      }
      if (this.logPrefix) {
        args.unshift(this.logPrefix);
      }
      if (typeof console !== "undefined" && console !== null) {
        if (typeof console.log === "function") {
          console.log.apply(console, args);
        }
      }
      return this;
    }
  };

  moduleKeywords = ['included', 'extended'];

  Module = (function() {

    Module.include = function(obj) {
      var key, value, _ref;
      if (!obj) {
        throw new Error('include(obj) requires obj');
      }
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this.prototype[key] = value;
        }
      }
      if ((_ref = obj.included) != null) {
        _ref.apply(this);
      }
      return this;
    };

    Module.extend = function(obj) {
      var key, value, _ref;
      if (!obj) {
        throw new Error('extend(obj) requires obj');
      }
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this[key] = value;
        }
      }
      if ((_ref = obj.extended) != null) {
        _ref.apply(this);
      }
      return this;
    };

    Module.proxy = function(func) {
      var _this = this;
      return function() {
        return func.apply(_this, arguments);
      };
    };

    Module.prototype.proxy = function(func) {
      var _this = this;
      return function() {
        return func.apply(_this, arguments);
      };
    };

    function Module() {
      if (typeof this.init === "function") {
        this.init.apply(this, arguments);
      }
    }

    return Module;

  })();

  Model = (function(_super) {

    __extends(Model, _super);

    Model.extend(Events);

    Model.records = {};

    Model.crecords = {};

    Model.attributes = [];

    Model.configure = function() {
      var attributes, name;
      name = arguments[0], attributes = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this.className = name;
      this.records = {};
      this.crecords = {};
      if (attributes.length) {
        this.attributes = attributes;
      }
      this.attributes && (this.attributes = makeArray(this.attributes));
      this.attributes || (this.attributes = []);
      this.unbind();
      return this;
    };

    Model.toString = function() {
      return "" + this.className + "(" + (this.attributes.join(", ")) + ")";
    };

    Model.find = function(id) {
      var record;
      record = this.records[id];
      if (!record && ("" + id).match(/c-\d+/)) {
        return this.findCID(id);
      }
      if (!record) {
        throw new Error('Unknown record');
      }
      return record.clone();
    };

    Model.findCID = function(cid) {
      var record;
      record = this.crecords[cid];
      if (!record) {
        throw new Error('Unknown record');
      }
      return record.clone();
    };

    Model.exists = function(id) {
      try {
        return this.find(id);
      } catch (e) {
        return false;
      }
    };

    Model.refresh = function(values, options) {
      var record, records, _i, _len;
      if (options == null) {
        options = {};
      }
      if (options.clear) {
        this.records = {};
        this.crecords = {};
      }
      records = this.fromJSON(values);
      if (!isArray(records)) {
        records = [records];
      }
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        record.id || (record.id = record.cid);
        this.records[record.id] = record;
        this.crecords[record.cid] = record;
      }
      this.trigger('refresh', this.cloneArray(records));
      return this;
    };

    Model.select = function(callback) {
      var id, record, result;
      result = (function() {
        var _ref, _results;
        _ref = this.records;
        _results = [];
        for (id in _ref) {
          record = _ref[id];
          if (callback(record)) {
            _results.push(record);
          }
        }
        return _results;
      }).call(this);
      return this.cloneArray(result);
    };

    Model.findByAttribute = function(name, value) {
      var id, record, _ref;
      _ref = this.records;
      for (id in _ref) {
        record = _ref[id];
        if (record[name] === value) {
          return record.clone();
        }
      }
      return null;
    };

    Model.findAllByAttribute = function(name, value) {
      return this.select(function(item) {
        return item[name] === value;
      });
    };

    Model.each = function(callback) {
      var key, value, _ref, _results;
      _ref = this.records;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(callback(value.clone()));
      }
      return _results;
    };

    Model.all = function() {
      return this.cloneArray(this.recordsValues());
    };

    Model.first = function() {
      var record;
      record = this.recordsValues()[0];
      return record != null ? record.clone() : void 0;
    };

    Model.last = function() {
      var record, values;
      values = this.recordsValues();
      record = values[values.length - 1];
      return record != null ? record.clone() : void 0;
    };

    Model.count = function() {
      return this.recordsValues().length;
    };

    Model.deleteAll = function() {
      var key, value, _ref, _results;
      _ref = this.records;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(delete this.records[key]);
      }
      return _results;
    };

    Model.destroyAll = function() {
      var key, value, _ref, _results;
      _ref = this.records;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(this.records[key].destroy());
      }
      return _results;
    };

    Model.update = function(id, atts, options) {
      return this.find(id).updateAttributes(atts, options);
    };

    Model.create = function(atts, options) {
      var record;
      record = new this(atts);
      return record.save(options);
    };

    Model.destroy = function(id, options) {
      return this.find(id).destroy(options);
    };

    Model.change = function(callbackOrParams) {
      if (typeof callbackOrParams === 'function') {
        return this.bind('change', callbackOrParams);
      } else {
        return this.trigger('change', callbackOrParams);
      }
    };

    Model.fetch = function(callbackOrParams) {
      if (typeof callbackOrParams === 'function') {
        return this.bind('fetch', callbackOrParams);
      } else {
        return this.trigger('fetch', callbackOrParams);
      }
    };

    Model.toJSON = function() {
      return this.recordsValues();
    };

    Model.fromJSON = function(objects) {
      var value, _i, _len, _results;
      if (!objects) {
        return;
      }
      if (typeof objects === 'string') {
        objects = JSON.parse(objects);
      }
      if (isArray(objects)) {
        _results = [];
        for (_i = 0, _len = objects.length; _i < _len; _i++) {
          value = objects[_i];
          _results.push(new this(value));
        }
        return _results;
      } else {
        return new this(objects);
      }
    };

    Model.fromForm = function() {
      var _ref;
      return (_ref = new this).fromForm.apply(_ref, arguments);
    };

    Model.recordsValues = function() {
      var key, result, value, _ref;
      result = [];
      _ref = this.records;
      for (key in _ref) {
        value = _ref[key];
        result.push(value);
      }
      return result;
    };

    Model.cloneArray = function(array) {
      var value, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        _results.push(value.clone());
      }
      return _results;
    };

    Model.idCounter = 0;

    Model.uid = function(prefix) {
      var uid;
      if (prefix == null) {
        prefix = '';
      }
      uid = prefix + this.idCounter++;
      if (this.exists(uid)) {
        uid = this.uid(prefix);
      }
      return uid;
    };

    function Model(atts) {
      Model.__super__.constructor.apply(this, arguments);
      if (atts) {
        this.load(atts);
      }
      this.cid = this.constructor.uid('c-');
    }

    Model.prototype.isNew = function() {
      return !this.exists();
    };

    Model.prototype.isValid = function() {
      return !this.validate();
    };

    Model.prototype.validate = function() {};

    Model.prototype.load = function(atts) {
      var key, value;
      for (key in atts) {
        value = atts[key];
        if (typeof this[key] === 'function') {
          this[key](value);
        } else {
          this[key] = value;
        }
      }
      return this;
    };

    Model.prototype.attributes = function() {
      var key, result, _i, _len, _ref;
      result = {};
      _ref = this.constructor.attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (key in this) {
          if (typeof this[key] === 'function') {
            result[key] = this[key]();
          } else {
            result[key] = this[key];
          }
        }
      }
      if (this.id) {
        result.id = this.id;
      }
      return result;
    };

    Model.prototype.eql = function(rec) {
      return !!(rec && rec.constructor === this.constructor && (rec.cid === this.cid) || (rec.id && rec.id === this.id));
    };

    Model.prototype.save = function(options) {
      var error, record;
      if (options == null) {
        options = {};
      }
      if (options.validate !== false) {
        error = this.validate();
        if (error) {
          this.trigger('error', error);
          return false;
        }
      }
      this.trigger('beforeSave', options);
      record = this.isNew() ? this.create(options) : this.update(options);
      this.trigger('save', options);
      return record;
    };

    Model.prototype.updateAttribute = function(name, value, options) {
      this[name] = value;
      return this.save(options);
    };

    Model.prototype.updateAttributes = function(atts, options) {
      this.load(atts);
      return this.save(options);
    };

    Model.prototype.changeID = function(id) {
      var records;
      records = this.constructor.records;
      records[id] = records[this.id];
      delete records[this.id];
      this.id = id;
      return this.save();
    };

    Model.prototype.destroy = function(options) {
      if (options == null) {
        options = {};
      }
      this.trigger('beforeDestroy', options);
      delete this.constructor.records[this.id];
      delete this.constructor.crecords[this.cid];
      this.destroyed = true;
      this.trigger('destroy', options);
      this.trigger('change', 'destroy', options);
      this.unbind();
      return this;
    };

    Model.prototype.dup = function(newRecord) {
      var result;
      result = new this.constructor(this.attributes());
      if (newRecord === false) {
        result.cid = this.cid;
      } else {
        delete result.id;
      }
      return result;
    };

    Model.prototype.clone = function() {
      return createObject(this);
    };

    Model.prototype.reload = function() {
      var original;
      if (this.isNew()) {
        return this;
      }
      original = this.constructor.find(this.id);
      this.load(original.attributes());
      return original;
    };

    Model.prototype.toJSON = function() {
      return this.attributes();
    };

    Model.prototype.toString = function() {
      return "<" + this.constructor.className + " (" + (JSON.stringify(this)) + ")>";
    };

    Model.prototype.fromForm = function(form) {
      var key, result, _i, _len, _ref;
      result = {};
      _ref = $(form).serializeArray();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        result[key.name] = key.value;
      }
      return this.load(result);
    };

    Model.prototype.exists = function() {
      return this.id && this.id in this.constructor.records;
    };

    Model.prototype.update = function(options) {
      var clone, records;
      this.trigger('beforeUpdate', options);
      records = this.constructor.records;
      records[this.id].load(this.attributes());
      clone = records[this.id].clone();
      clone.trigger('update', options);
      clone.trigger('change', 'update', options);
      return clone;
    };

    Model.prototype.create = function(options) {
      var clone, record;
      this.trigger('beforeCreate', options);
      if (!this.id) {
        this.id = this.cid;
      }
      record = this.dup(false);
      this.constructor.records[this.id] = record;
      this.constructor.crecords[this.cid] = record;
      clone = record.clone();
      clone.trigger('create', options);
      clone.trigger('change', 'create', options);
      return clone;
    };

    Model.prototype.bind = function(events, callback) {
      var binder, unbinder,
        _this = this;
      this.constructor.bind(events, binder = function(record) {
        if (record && _this.eql(record)) {
          return callback.apply(_this, arguments);
        }
      });
      this.constructor.bind('unbind', unbinder = function(record) {
        if (record && _this.eql(record)) {
          _this.constructor.unbind(events, binder);
          return _this.constructor.unbind('unbind', unbinder);
        }
      });
      return binder;
    };

    Model.prototype.one = function(events, callback) {
      var binder,
        _this = this;
      return binder = this.bind(events, function() {
        _this.constructor.unbind(events, binder);
        return callback.apply(_this, arguments);
      });
    };

    Model.prototype.trigger = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      args.splice(1, 0, this);
      return (_ref = this.constructor).trigger.apply(_ref, args);
    };

    Model.prototype.unbind = function() {
      return this.trigger('unbind');
    };

    return Model;

  })(Module);

  Controller = (function(_super) {

    __extends(Controller, _super);

    Controller.include(Events);

    Controller.include(Log);

    Controller.prototype.eventSplitter = /^(\S+)\s*(.*)$/;

    Controller.prototype.tag = 'div';

    function Controller(options) {
      this.release = __bind(this.release, this);

      var key, value, _ref;
      this.options = options;
      _ref = this.options;
      for (key in _ref) {
        value = _ref[key];
        this[key] = value;
      }
      if (!this.el) {
        this.el = document.createElement(this.tag);
      }
      this.el = $(this.el);
      this.$el = this.el;
      if (this.className) {
        this.el.addClass(this.className);
      }
      if (this.attributes) {
        this.el.attr(this.attributes);
      }
      if (!this.events) {
        this.events = this.constructor.events;
      }
      if (!this.elements) {
        this.elements = this.constructor.elements;
      }
      if (this.events) {
        this.delegateEvents(this.events);
      }
      if (this.elements) {
        this.refreshElements();
      }
      Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.release = function() {
      this.trigger('release');
      this.el.remove();
      return this.unbind();
    };

    Controller.prototype.$ = function(selector) {
      return $(selector, this.el);
    };

    Controller.prototype.delegateEvents = function(events) {
      var eventName, key, match, method, selector, _results,
        _this = this;
      _results = [];
      for (key in events) {
        method = events[key];
        if (typeof method === 'function') {
          method = (function(method) {
            return function() {
              method.apply(_this, arguments);
              return true;
            };
          })(method);
        } else {
          if (!this[method]) {
            throw new Error("" + method + " doesn't exist");
          }
          method = (function(method) {
            return function() {
              _this[method].apply(_this, arguments);
              return true;
            };
          })(method);
        }
        match = key.match(this.eventSplitter);
        eventName = match[1];
        selector = match[2];
        if (selector === '') {
          _results.push(this.el.bind(eventName, method));
        } else {
          _results.push(this.el.delegate(selector, eventName, method));
        }
      }
      return _results;
    };

    Controller.prototype.refreshElements = function() {
      var key, value, _ref, _results;
      _ref = this.elements;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(this[value] = this.$(key));
      }
      return _results;
    };

    Controller.prototype.delay = function(func, timeout) {
      return setTimeout(this.proxy(func), timeout || 0);
    };

    Controller.prototype.html = function(element) {
      this.el.html(element.el || element);
      this.refreshElements();
      return this.el;
    };

    Controller.prototype.append = function() {
      var e, elements, _ref;
      elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      elements = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          e = elements[_i];
          _results.push(e.el || e);
        }
        return _results;
      })();
      (_ref = this.el).append.apply(_ref, elements);
      this.refreshElements();
      return this.el;
    };

    Controller.prototype.appendTo = function(element) {
      this.el.appendTo(element.el || element);
      this.refreshElements();
      return this.el;
    };

    Controller.prototype.prepend = function() {
      var e, elements, _ref;
      elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      elements = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          e = elements[_i];
          _results.push(e.el || e);
        }
        return _results;
      })();
      (_ref = this.el).prepend.apply(_ref, elements);
      this.refreshElements();
      return this.el;
    };

    Controller.prototype.replace = function(element) {
      var previous, _ref;
      _ref = [this.el, $(element.el || element)], previous = _ref[0], this.el = _ref[1];
      previous.replaceWith(this.el);
      this.delegateEvents(this.events);
      this.refreshElements();
      return this.el;
    };

    return Controller;

  })(Module);

  $ = (typeof window !== "undefined" && window !== null ? window.jQuery : void 0) || (typeof window !== "undefined" && window !== null ? window.Zepto : void 0) || function(element) {
    return element;
  };

  createObject = Object.create || function(o) {
    var Func;
    Func = function() {};
    Func.prototype = o;
    return new Func();
  };

  isArray = function(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  };

  isBlank = function(value) {
    var key;
    if (!value) {
      return true;
    }
    for (key in value) {
      return false;
    }
    return true;
  };

  makeArray = function(args) {
    return Array.prototype.slice.call(args, 0);
  };

  Spine = this.Spine = {};

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Spine;
  }

  Spine.version = '1.0.8';

  Spine.isArray = isArray;

  Spine.isBlank = isBlank;

  Spine.$ = $;

  Spine.Events = Events;

  Spine.Log = Log;

  Spine.Module = Module;

  Spine.Controller = Controller;

  Spine.Model = Model;

  Module.extend.call(Spine, Events);

  Module.create = Module.sub = Controller.create = Controller.sub = Model.sub = function(instances, statics) {
    var result;
    result = (function(_super) {

      __extends(result, _super);

      function result() {
        return result.__super__.constructor.apply(this, arguments);
      }

      return result;

    })(this);
    if (instances) {
      result.include(instances);
    }
    if (statics) {
      result.extend(statics);
    }
    if (typeof result.unbind === "function") {
      result.unbind();
    }
    return result;
  };

  Model.setup = function(name, attributes) {
    var Instance;
    if (attributes == null) {
      attributes = [];
    }
    Instance = (function(_super) {

      __extends(Instance, _super);

      function Instance() {
        return Instance.__super__.constructor.apply(this, arguments);
      }

      return Instance;

    })(this);
    Instance.configure.apply(Instance, [name].concat(__slice.call(attributes)));
    return Instance;
  };

  Spine.Class = Module;

}).call(this);
am['spine']=module.exports;
module.exports=null;(function() {
  var tpl;

  tpl = {};

  tpl['di_emptyblock'] = "<div class=\"image-upload__in\">\n<div class=\"image-upload__icon\"></div>\n<input type=\"file\" class=\"image-upload_file\" accept=\"image/*\">\n<div class=\"image-upload__text\">Click or drug’n’drop to upload header image</div>\n</div>";

  tpl['di_sliderblock'] = "<div class=\"image-manag\"></div>\n<div class=\"image-manag image-cancel\">Cancel</div>\n<div class=\"image-manag image-save\">Save</div>";

  tpl['di_editblock'] = "<div class=\"image-manag\">\n<div><span class=\"image-remove\"></span></div>\n<div><span class=\"image-move\"></span></div>\n</div>";

  tpl['figure11'] = "<div class=\"image-border\">\n<div class=\"image-upload image-container image-upload-1\" style=\"height:550px; width:500px;\"></div>\n<div class=\"image-upload image-container image-upload-2\" style=\"height:550px; width:500px;\"></div>\n</div>";

  tpl['figure12'] = "<div class=\"image-border\">\n<div class=\"image-upload image-container image-upload-1\" style=\"height:500px; width:500px;\"></div>\n<div class=\"image-container\">\n<div class=\"image-upload image-container image-upload-2\" style=\"height:250px; width:500px;\"></div>\n</div>\n<div class=\"image-container\">\n<div class=\"image-upload image-container image-upload-3\" style=\"height:250px; width:500px;\"></div>\n</div>\n</div>";

  tpl['figure31'] = "<div class=\"image-border\">\n<div class=\"image-upload image-container image-upload-1\" style=\"height:550px; width:334px;\"></div>\n<div class=\"image-upload image-container image-upload-2\" style=\"height:550px; width:333px;\"></div>\n<div class=\"image-upload image-container image-upload-3\" style=\"height:550px; width:333px;\"></div>\n</div>";

  tpl['figuresingle'] = "<div class=\"image-border\">\n<div class=\"image-upload image-container\" style=\"height:456px; width:640px;\"></div>\n</div>";

  tpl['figureslider'] = "<div class=\"slider-content\">\n<div class=\"slider__next\"><span></span></div>\n<div class=\"slider__prev\"><span></span></div>\n<div class=\"slider__slides\"></div>\n<div class=\"slider__info\"></div>\n<div class=\"slider__descr\"></div>\n</div>\n\n<div class=\"slider-builder\">\n<div class=\"image-border\"><div class=\"ul\"></div></div>\n</div>";

  tpl['figureslider_mangblock'] = "<div class=\"image-manag\">\n<div><span class=\"image-remove\"></span></div>\n<div><span class=\"image-order\"></span></div>\n<div><span class=\"image-move\"></span></div>\n</div>\n<div class=\"image-manag\">\n<div><span class=\"image-size-m\"></span></div>\n<div><span class=\"image-size-l\"></span></div>\n</div>";

  tpl['figureslider_slidesource'] = "<div class=\"slider__slide\" id=\"#slideId#\">\n<div class=\"image-upload\" style=\"width: 1000px; height: 456px;\"></div>\n</div>";

  tpl['figureslider_order_item'] = "<div class=\"image-m li\" style=\"width: 116px; height: 83px;\" id=\"#blId#\" data-slide-id=\"#slideId#\">\n<div></div>\n<span>&nbsp;</span>\n</div>";

  tpl['figureslider_order_managblock'] = "<div class=\"image-manag image-cancel\">Cancel</div>\n<div class=\"image-manag image-save\">Save</div>";

  module.exports = function(name, vars) {
    var k, t, v;
    if (vars == null) {
      vars = {};
    }
    t = tpl[name];
    for (k in vars) {
      v = vars[k];
      t = t.replace("#" + k + "#", v);
    }
    return t;
  };

}).call(this);
am['templates']=module.exports;
module.exports=null;(function() {
  var utils;

  utils = {
    doSeveralTimes: function(cb, resultCb, times, interval) {
      var func, tm;
      if (times == null) {
        times = 10;
      }
      if (interval == null) {
        interval = 300;
      }
      tm = null;
      func = function() {
        var res;
        res = cb();
        if (res || times < 1) {
          clearInterval(tm);
          return typeof resultCb === "function" ? resultCb(!res) : void 0;
        } else {
          return times--;
        }
      };
      return tm = setInterval(func, interval);
    },
    uniqueId: (function() {
      var c;
      c = 0;
      return function(prefix) {
        if (prefix == null) {
          prefix = 'uniq';
        }
        return prefix + (c++);
      };
    })()
  };

  module.exports = utils;

}).call(this);
am['utils']=module.exports;
module.exports=null;(function() {
  var DragImage, doSeveralTimes, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  doSeveralTimes = require('utils').doSeveralTimes;

  template = require('templates');

  DragImage = (function(_super) {

    __extends(DragImage, _super);

    DragImage.prototype.editMode = true;

    DragImage.prototype.hasImage = false;

    DragImage.prototype.savedSliderValue = 0;

    DragImage.prototype.savedImageTop = 0;

    DragImage.prototype.savedImageLeft = 0;

    DragImage.prototype.fisrtUpload = true;

    DragImage.prototype.useManage = true;

    DragImage.prototype.elements = {
      'img': 'image',
      '.imageDrag': 'dragdiv',
      '.manag-block': 'managBlock',
      '.image-upload_file': 'uploadFile'
    };

    DragImage.prototype.events = {
      'click .manag-block .image-save': 'clickSave',
      'click .manag-block .image-cancel': 'clickCancel',
      'click .manag-block .image-remove': 'makeEmpty',
      'click .manag-block .image-move': function() {
        this.createManagSliderBlock();
        return this.setEditMode(true);
      },
      'click .image-upload__icon': function() {
        if (!this.editMode) {
          return;
        }
        return this.uploadFile.click();
      },
      'change .image-upload_file': 'userSelectFile',
      drop: 'drop',
      dragover: function(event) {
        if (!this.editMode) {
          return;
        }
        event.preventDefault();
        if (this.dragUploadedImage) {
          return this.cursorInArea = true;
        } else {
          return this.setDragOver();
        }
      },
      dragleave: function(event) {
        if (!this.editMode) {
          return;
        }
        event.preventDefault();
        if (this.dragUploadedImage) {
          return this.cursorInArea = false;
        } else {
          return this.setDragLeave();
        }
      },
      'dragstart .imageDrag': 'dragstart',
      'dragend .imageDrag': function() {
        if (!this.editMode) {
          return;
        }
        return this.dragUploadedImage = false;
      },
      'drag .imageDrag': 'drag'
    };

    function DragImage() {
      DragImage.__super__.constructor.apply(this, arguments);
    }

    DragImage.prototype.init = function() {
      return this.makeEmpty();
    };

    DragImage.prototype.makeEmpty = function() {
      this.savedSliderValue = 0;
      this.savedImageTop = 0;
      this.savedImageLeft = 0;
      this.removeManagBlock();
      this.html(template('di_emptyblock'));
      this.editMode = true;
      return this.hasImage = false;
    };

    DragImage.prototype.makeDragImage = function(imageSrc) {
      var $draggableDiv, image,
        _this = this;
      image = new Image();
      image.src = imageSrc;
      this.imgOrigWidth = this.imgOrigHeight = 0;
      this.$el.empty();
      $draggableDiv = $('<div class="imageDrag"></div>');
      $draggableDiv.html(image);
      return doSeveralTimes(function() {
        if (image.height > 0 || image.width > 0) {
          _this.imgOrigWidth = image.width;
          _this.imgOrigHeight = image.height;
          $draggableDiv.append('<div class="topOfImage"></div>');
          $draggableDiv.find('.topOfImage').css({
            width: _this.imgOrigWidth + 'px',
            height: _this.imgOrigHeight + 'px'
          });
          return true;
        } else {
          return false;
        }
      }, function() {
        _this.imageSrc = imageSrc;
        _this.html($draggableDiv);
        _this.createManagSliderBlock();
        _this.setEditMode(true);
        _this.hasImage = true;
        _this.trigger('imageUpdated', {
          fisrtUpload: _this.fisrtUpload,
          width: _this.imgOrigWidth,
          height: _this.imgOrigHeight
        });
        if (_this.fisrtUpload) {
          return _this.fisrtUpload = false;
        }
      });
    };

    DragImage.prototype.readImageFile = function(imgFile) {
      var reader,
        _this = this;
      if (imgFile) {
        reader = new FileReader();
        reader.onload = function(frEvent) {
          return _this.makeDragImage(frEvent.target.result);
        };
        return reader.readAsDataURL(imgFile);
      }
    };

    DragImage.prototype.createManagBlock = function(remove) {
      if (remove == null) {
        remove = true;
      }
      if (remove) {
        this.removeManagBlock();
      }
      return $("<div class=\"manag-block\"></div>");
    };

    DragImage.prototype.removeManagBlock = function() {
      if (this.slider) {
        this.slider.release();
      }
      return this.managBlock.remove();
    };

    DragImage.prototype.createManagSliderBlock = function() {
      var UISlider, blockSource,
        _this = this;
      blockSource = this.createManagBlock().html(template('di_sliderblock'));
      UISlider = require('controllers/UISlider');
      this.slider = new UISlider({
        el: blockSource.find('.image-manag').first()
      });
      this.slider.bind('value', function(value) {
        var nv;
        if (!_this.imgOrigHeight) {
          _this.imgOrigHeight = _this.image.height();
        }
        nv = _this.imgOrigHeight / _this.slider.maxValue * value;
        if (nv) {
          return _this.image.css({
            height: nv + 'px'
          });
        }
      });
      this.slider.setValue(this.savedSliderValue);
      return this.append(blockSource);
    };

    DragImage.prototype.createManagEditBlock = function() {
      var blockSource;
      blockSource = this.createManagBlock().html(template('di_editblock'));
      return this.append(blockSource);
    };

    DragImage.prototype.setDragOver = function() {
      if (!this.$el.hasClass('dragover')) {
        return this.$el.addClass('dragover');
      }
    };

    DragImage.prototype.setDragLeave = function() {
      return this.$el.removeClass('dragover');
    };

    DragImage.prototype.setEditMode = function(b) {
      this.editMode = !!b;
      if (this.editMode) {
        (this.$('.imageDrag')).addClass('edit').attr('draggable', 'true');
        this.createManagSliderBlock();
      } else {
        (this.$('.imageDrag')).removeClass('edit').attr('draggable', 'false');
        this.removeManagBlock();
      }
      return this.trigger('editmode', this.editMode);
    };

    DragImage.prototype.userSelectFile = function() {
      var _base;
      if (this.uploadFile[0]) {
        return this.readImageFile(typeof (_base = this.uploadFile.get(0).files).item === "function" ? _base.item(0) : void 0);
      }
    };

    DragImage.prototype.dragstart = function(event) {
      var dataTransfer, originalEvent;
      if (!this.editMode) {
        return;
      }
      originalEvent = event.originalEvent;
      dataTransfer = originalEvent.dataTransfer;
      if (!this.dragImage) {
        this.dragImage = document.createElement('span');
      }
      dataTransfer.setData('Text', '');
      if (dataTransfer.setDragImage) {
        dataTransfer.setDragImage(this.dragImage, 1, 1);
      }
      this.startDragX = originalEvent.pageX;
      this.startDragY = originalEvent.pageY;
      this.startPositionCoords = this.dragdiv.position();
      return this.dragUploadedImage = true;
    };

    DragImage.prototype.drag = function(event) {
      if (!this.editMode) {
        return;
      }
      event.preventDefault();
      if (this.cursorInArea) {
        return this.dragdiv.css({
          left: this.startPositionCoords.left + (event.originalEvent.pageX - this.startDragX) + 'px',
          top: this.startPositionCoords.top + (event.originalEvent.pageY - this.startDragY) + 'px'
        });
      }
    };

    DragImage.prototype.drop = function(event) {
      var _ref;
      if (!this.editMode) {
        return;
      }
      event.preventDefault();
      this.readImageFile((_ref = event.originalEvent.dataTransfer) != null ? _ref.files[0] : void 0);
      return this.setDragLeave();
    };

    DragImage.prototype.clickSave = function() {
      var pos;
      this.savedSliderValue = this.slider.getValue();
      pos = this.dragdiv.position();
      this.savedImageTop = pos.top;
      this.savedImageLeft = pos.left;
      this.setEditMode(false);
      if (!this.useManage) {
        this.removeManagBlock();
      } else {
        this.createManagEditBlock();
      }
      return this.trigger('save');
    };

    DragImage.prototype.clickCancel = function() {
      var _ref;
      if (this.hasImage) {
        if ((_ref = this.slider) != null) {
          if (typeof _ref.setValue === "function") {
            _ref.setValue(this.savedSliderValue);
          }
        }
        this.dragdiv.css({
          left: this.savedImageLeft,
          top: this.savedImageTop
        });
        if (!this.useManage) {
          this.removeManagBlock();
        } else {
          this.createManagEditBlock();
        }
      } else {
        this.makeEmpty();
      }
      this.setEditMode(false);
      return this.trigger('cancel');
    };

    return DragImage;

  })(Spine.Controller);

  module.exports = DragImage;

}).call(this);
am['controllers/dragimage']=module.exports;
module.exports=null;(function() {
  var Editor, editorOnChange, forCommandsBind, forFiguresBind, uniqueId,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  uniqueId = require('utils').uniqueId;

  forFiguresBind = {
    image_single: {
      idPrefix: 'image_single',
      tpl: "<div id=\"##id##\"></div>",
      controller: 'controllers/FigureSingleImage'
    },
    image_12: {
      idPrefix: 'image_12',
      tpl: "<figure id=\"##id##\"></figure>",
      controller: 'controllers/Figure12Image'
    },
    image_slider: {
      idPrefix: 'image_slider',
      tpl: "<div id=\"##id##\"></div>",
      controller: 'controllers/FigureSlider'
    },
    image_11: {
      idPrefix: 'image_11',
      tpl: "<figure id=\"##id##\"></figure>",
      controller: 'controllers/Figure11Image'
    },
    image_31: {
      idPrefix: 'image_31',
      tpl: "<figure id=\"##id##\"></figure>",
      controller: 'controllers/Figure31Image'
    }
  };

  forCommandsBind = {
    'bold': {
      cmd: 'bold'
    },
    'italic': {
      cmd: 'italic'
    },
    'listnum': {
      cmd: 'insertOrderedList'
    },
    'list': {
      cmd: 'insertUnorderedList'
    }
  };

  editorOnChange = function(event) {
    return this.onChange(event);
  };

  Editor = (function(_super) {

    __extends(Editor, _super);

    Editor.prototype.events = {
      'keyup .compose__text': editorOnChange,
      'paste .compose__text': editorOnChange,
      'click .compose__text': editorOnChange
    };

    Editor.prototype.elements = {
      '.compose__text': 'text',
      '.compose__pretextin': 'pretext',
      '.compose__titlein': 'title'
    };

    function Editor() {
      var _this = this;
      Editor.__super__.constructor.apply(this, arguments);
      this.figures = {};
      this.panel.bind('execCommand', function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return _this.execCommand.apply(_this, args);
      });
      this.panel.bind('insertFigure', function(figureName) {
        return _this.insertFigure(forFiguresBind[figureName]);
      });
      this.initPlaceholder(this.text);
      this.initPlaceholder(this.pretext);
      this.initPlaceholder(this.title);
    }

    Editor.prototype.initPlaceholder = function($elem) {
      $elem.html($elem.data('placeholder'));
      $elem.on('focus', function() {
        if (!$elem.data('changed')) {
          return $elem.html(' ');
        }
      });
      $elem.on('blur', function() {
        if (!$elem.data('changed')) {
          return $elem.html($elem.data('placeholder'));
        }
      });
      return $elem.on('paste keyup', function() {
        return $elem.data('changed', true);
      });
    };

    Editor.prototype.execCommand = function(cmd, params) {
      var command, h2Div, h2DivId;
      this.restoreCursorPositon();
      switch (cmd) {
        case 'h2':
          h2DivId = uniqueId('h2_compose__pretext');
          h2Div = document.createElement('h2');
          h2Div.id = h2DivId;
          return this.range.surroundContents(h2Div);
        case 'link':
          return document.execCommand('createLink', false, params);
        default:
          if (command = forCommandsBind[cmd]) {
            return document.execCommand(command.cmd, false, params || command.params || null);
          }
      }
    };

    Editor.prototype.insertFigure = function(options) {
      var Obj, figureId, node;
      this.restoreCursorPositon();
      figureId = uniqueId(options.idPrefix);
      node = this.range.createContextualFragment("<div>" + (options.tpl.replace('##id##', figureId)) + "</div><div>&nbsp;</div>");
      this.range.insertNode(node);
      Obj = require(options.controller);
      this.figures[figureId] = new Obj({
        el: this.$('#' + figureId)
      });
      return this.text.data('changed', true);
    };

    Editor.prototype.onChange = function(event) {
      var selection;
      if ($(event.srcElement).parents('.no-edit').length < 1) {
        selection = window.getSelection();
        return this.range = selection.getRangeAt(0);
      }
    };

    Editor.prototype.restoreCursorPositon = function() {
      var selection;
      this.text.focus();
      if (!this.range) {
        this.range = document.createRange();
        this.range.selectNodeContents(this.text.get(0));
        this.range.collapse(false);
      }
      selection = window.getSelection();
      selection.removeAllRanges();
      return selection.addRange(this.range);
    };

    return Editor;

  })(Spine.Controller);

  module.exports = Editor;

}).call(this);
am['controllers/editor']=module.exports;
module.exports=null;(function() {
  var Figure,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Figure = (function(_super) {

    __extends(Figure, _super);

    function Figure() {
      var _ref;
      this.dragImages = {};
      this.elements || (this.elements = {});
      if (!((_ref = this.elements) != null ? _ref['.manag-block-figure'] : void 0)) {
        this.elements['.manag-block-figure'] = 'managBlock';
      }
      Figure.__super__.constructor.apply(this, arguments);
    }

    Figure.prototype.getDragImagesSrc = function() {
      var k, ob, _ref, _results;
      _ref = this.dragImages;
      _results = [];
      for (k in _ref) {
        ob = _ref[k];
        if (ob.imageSrc) {
          _results.push(ob.imageSrc);
        }
      }
      return _results;
    };

    Figure.prototype.setDragImagesEditMode = function(editMode) {
      var k, ob, _ref;
      _ref = this.dragImages;
      for (k in _ref) {
        ob = _ref[k];
        ob.setEditMode(editMode);
      }
      return this;
    };

    Figure.prototype.createManagBlock = function(remove) {
      if (remove == null) {
        remove = true;
      }
      if (remove) {
        this.removeManagBlock();
      }
      return $("<div class=\"manag-block manag-block-figure\"></div>");
    };

    Figure.prototype.removeManagBlock = function() {
      if (this.managBlock) {
        return this.managBlock.remove();
      }
    };

    return Figure;

  })(Spine.Controller);

  module.exports = Figure;

}).call(this);
am['controllers/figure']=module.exports;
module.exports=null;(function() {
  var Figure, Figure11Image,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Figure = require('controllers/Figure');

  Figure11Image = (function(_super) {

    __extends(Figure11Image, _super);

    function Figure11Image() {
      Figure11Image.__super__.constructor.apply(this, arguments);
    }

    Figure11Image.prototype.init = function() {
      var DragImage;
      this.el.addClass('figure_many figure_wide no-edit').attr('contenteditable', 'false');
      this.html(require('templates')('figure11'));
      DragImage = require('controllers/DragImage');
      this.dragImages[1] = new DragImage({
        el: this.$('.image-upload-1')
      });
      return this.dragImages[2] = new DragImage({
        el: this.$('.image-upload-2')
      });
    };

    return Figure11Image;

  })(Figure);

  module.exports = Figure11Image;

}).call(this);
am['controllers/figure11image']=module.exports;
module.exports=null;(function() {
  var Figure, Figure12Image,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Figure = require('controllers/Figure');

  Figure12Image = (function(_super) {

    __extends(Figure12Image, _super);

    function Figure12Image() {
      Figure12Image.__super__.constructor.apply(this, arguments);
    }

    Figure12Image.prototype.init = function() {
      var DragImage;
      this.el.addClass('figure_many figure_wide no-edit').attr('contenteditable', 'false');
      this.html(require('templates')('figure12'));
      DragImage = require('controllers/DragImage');
      this.dragImages[1] = new DragImage({
        el: this.$('.image-upload-1')
      });
      this.dragImages[2] = new DragImage({
        el: this.$('.image-upload-2')
      });
      return this.dragImages[3] = new DragImage({
        el: this.$('.image-upload-3')
      });
    };

    return Figure12Image;

  })(Figure);

  module.exports = Figure12Image;

}).call(this);
am['controllers/figure12image']=module.exports;
module.exports=null;(function() {
  var Figure, Figure31Image,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Figure = require('controllers/Figure');

  Figure31Image = (function(_super) {

    __extends(Figure31Image, _super);

    function Figure31Image() {
      Figure31Image.__super__.constructor.apply(this, arguments);
    }

    Figure31Image.prototype.init = function() {
      var DragImage;
      this.el.addClass('figure_many figure_wide no-edit').attr('contenteditable', 'false');
      this.html(require('templates')('figure31'));
      DragImage = require('controllers/DragImage');
      this.dragImages[1] = new DragImage({
        el: this.$('.image-upload-1')
      });
      this.dragImages[2] = new DragImage({
        el: this.$('.image-upload-2')
      });
      return this.dragImages[3] = new DragImage({
        el: this.$('.image-upload-3')
      });
    };

    return Figure31Image;

  })(Figure);

  module.exports = Figure31Image;

}).call(this);
am['controllers/figure31image']=module.exports;
module.exports=null;(function() {
  var Figure, FigureSingeImage,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Figure = require('controllers/Figure');

  FigureSingeImage = (function(_super) {

    __extends(FigureSingeImage, _super);

    function FigureSingeImage() {
      FigureSingeImage.__super__.constructor.apply(this, arguments);
    }

    FigureSingeImage.prototype.init = function() {
      var DragImage, cdi,
        _this = this;
      this.el.addClass('no-edit').attr('contenteditable', 'false');
      this.html(require('templates')('figuresingle'));
      DragImage = require('controllers/DragImage');
      cdi = this.dragImages[1] = new DragImage({
        el: this.$('.image-upload')
      });
      return cdi.bind('imageUpdated', function(ob) {
        return _this.$('.image-upload').css({
          height: ob.height + 'px'
        });
      });
    };

    return FigureSingeImage;

  })(Figure);

  module.exports = FigureSingeImage;

}).call(this);
am['controllers/figuresingleimage']=module.exports;
module.exports=null;(function() {
  var Figure, FigureSlider, template, uniqueId,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Figure = require('controllers/Figure');

  uniqueId = require('utils').uniqueId;

  template = require('templates');

  FigureSlider = (function(_super) {

    __extends(FigureSlider, _super);

    FigureSlider.prototype.canAddNewSlide = false;

    FigureSlider.prototype.elements = {
      '.slider__next': 'nextButton',
      '.slider__prev': 'prevButton',
      '.slider__slides': 'slides',
      '.slider__info': 'info',
      '.slider__descr': 'descr',
      '.slider-builder': 'builder',
      '.slider-content': 'content',
      '.slider-builder .image-border .ul': 'builderList'
    };

    FigureSlider.prototype.events = {
      'drop .slider__slides': 'drop',
      'click .manag-block-figure .image-move': function() {
        return this.setSliderEdit(true);
      },
      'click .manag-block-figure .image-order': 'orderItems',
      'click .slider-builder .image-save': function() {
        var elem, idx, prevSlideId, slideId, _i, _len, _ref;
        prevSlideId = null;
        _ref = this.builderList.find('.li');
        for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
          elem = _ref[idx];
          slideId = $(elem).data('slide-id');
          if (idx > 0) {
            this.$("#" + prevSlideId).after(this.$("#" + slideId));
          } else {
            this.slides.prepend(this.$("#" + slideId));
          }
          prevSlideId = slideId;
        }
        this.builder.hide();
        this.content.show();
        this.initSlider({
          startSlideId: 0
        });
        return this.setSliderEdit(false);
      },
      'click .slider-builder .image-cancel': function() {
        this.builder.hide();
        this.content.show();
        return this.setSliderEdit(false);
      }
    };

    function FigureSlider() {
      this.slidecache = {};
      FigureSlider.__super__.constructor.apply(this, arguments);
    }

    FigureSlider.prototype.setSliderEdit = function(edit) {
      var blockSource;
      edit = !!edit;
      this.canAddNewSlide = !edit;
      this.setDragImagesEditMode(edit);
      if (edit) {
        this.nextButton.hide();
        this.prevButton.hide();
        return this.removeManagBlock();
      } else {
        this.nextButton.show();
        this.prevButton.show();
        blockSource = this.createManagBlock().html(template('figureslider_mangblock'));
        return this.append(blockSource);
      }
    };

    FigureSlider.prototype.addSlide = function(image) {
      var $imageUpload, $slideSource, DragImage, cdi, slideId,
        _this = this;
      slideId = uniqueId('slide');
      $slideSource = $(template('figureslider_slidesource', {
        slideId: slideId
      }));
      this.slides.append($slideSource);
      $imageUpload = $slideSource.find('.image-upload');
      DragImage = require('controllers/DragImage');
      cdi = this.dragImages[slideId] = new DragImage({
        el: $imageUpload,
        useManage: false
      });
      if (image) {
        cdi.readImageFile(image);
      } else {
        cdi.bind('imageUpdated', function(ob) {
          if (ob.fisrtUpload) {
            return _this.addSlide();
          }
        });
      }
      cdi.bind('save', function() {
        return _this.setSliderEdit(false);
      });
      cdi.bind('cancel', function() {
        return _this.setSliderEdit(false);
      });
      return this.initSlider();
    };

    FigureSlider.prototype.initSlider = function(options) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      this.slides.cycle('destroy');
      return this.slides.cycle({
        startingSlide: options.startSlideId != null ? options.startSlideId : this.currSlideId || 0,
        fx: 'scrollHorz',
        speed: 'fast',
        timeout: 0,
        next: this.nextButton,
        prev: this.prevButton,
        after: function(curr, next, opts) {
          _this.descr.html((opts.currSlide + 1) + " / " + opts.slideCount + "");
          return _this.currSlideId = opts.currSlide;
        }
      });
    };

    FigureSlider.prototype.init = function() {
      this.el.addClass('slider slider_wide no-edit').attr('contenteditable', 'false');
      this.html(template('figureslider'));
      this.builder.hide();
      this.slides.css({
        height: '460px'
      });
      this.addSlide();
      return this.setSliderEdit(false);
    };

    FigureSlider.prototype.drop = function(event) {
      var im, _i, _len, _ref;
      if (!this.canAddNewSlide) {
        return;
      }
      event.preventDefault();
      if (event.originalEvent.dataTransfer) {
        _ref = event.originalEvent.dataTransfer.files;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          im = _ref[_i];
          this.addSlide(im);
        }
      }
      return true;
    };

    FigureSlider.prototype.orderItems = function() {
      var slide, _fn, _i, _len, _ref,
        _this = this;
      this.content.hide();
      this.builderList.empty();
      _ref = this.slides.find('.slider__slide');
      _fn = function(slide) {
        var $obSlide, blId, img, imgSrc, ob, slideId;
        $obSlide = $(slide);
        slideId = $obSlide.attr('id');
        ob = _this.dragImages[slideId];
        imgSrc = ob.imageSrc;
        if (!imgSrc) {
          return;
        }
        blId = uniqueId('li-image-m');
        _this.builderList.append(template('figureslider_order_item', {
          blId: blId,
          slideId: slideId
        }));
        img = new Image();
        img.src = imgSrc;
        _this.$("#" + blId + " div").html(img);
        return _this.$("#" + blId + " div img").css({
          width: '116px',
          height: '83px'
        });
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        slide = _ref[_i];
        _fn(slide);
      }
      this.builder.show();
      this.builderList.sortable();
      this.$('.slider-builder .image-border').append(this.createManagBlock().html(template('figureslider_order_managblock')));
      return this.refreshElements();
    };

    return FigureSlider;

  })(Figure);

  module.exports = FigureSlider;

}).call(this);
am['controllers/figureslider']=module.exports;
module.exports=null;(function() {
  var Panel, eventsMapCommands, eventsMapFigures,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  eventsMapCommands = {
    '.wyswyg__bold': 'bold',
    '.wyswyg__italic': 'italic',
    '.wyswyg__listnum': 'listnum',
    '.wyswyg__list': 'list',
    '.wyswyg__h2': 'h2'
  };

  eventsMapFigures = {
    '.photo_1': 'image_single',
    '.photo_12': 'image_12',
    '.photo_11': 'image_11',
    '.photo_31': 'image_31',
    '.photo_g': 'image_slider'
  };

  Panel = (function(_super) {

    __extends(Panel, _super);

    Panel.prototype.events = {
      'submit .wyswyg__link form': 'insertLink'
    };

    function Panel() {
      var cl, command, evName,
        _this = this;
      this._cloneEvents();
      for (cl in eventsMapCommands) {
        command = eventsMapCommands[cl];
        this.events['click ' + cl] = (function(command) {
          return function(event) {
            event.preventDefault();
            event.stopPropagation();
            return _this.execCommand(command);
          };
        })(command);
      }
      for (cl in eventsMapFigures) {
        evName = eventsMapFigures[cl];
        this.events["click " + cl + "_handler"] = (function(evName) {
          return function(event) {
            console.log(evName);
            event.preventDefault();
            event.stopPropagation();
            return _this.trigger('insertFigure', evName);
          };
        })(evName);
      }
      Panel.__super__.constructor.apply(this, arguments);
    }

    Panel.prototype.execCommand = function() {
      return this.trigger.apply(this, ['execCommand'].concat(__slice.call(arguments)));
    };

    Panel.prototype.insertLink = function(event) {
      var val;
      event.preventDefault();
      event.stopPropagation();
      val = (this.$('.wyswyg__link .input')).val();
      this.execCommand('link', val);
      (this.$('.wyswyg__link .wyswyg__drop')).fadeOut();
      return (this.$('.wyswyg__link .input')).val('http://');
    };

    Panel.prototype._cloneEvents = function() {
      return this.events = (function(events) {
        var ev, func, result;
        result = {};
        for (ev in events) {
          func = events[ev];
          result[ev] = func;
        }
        return result;
      })(this.events);
    };

    return Panel;

  })(Spine.Controller);

  module.exports = Panel;

}).call(this);
am['controllers/panel']=module.exports;
module.exports=null;(function() {
  var Spine, UISlider,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Spine = require('spine');

  UISlider = (function(_super) {

    __extends(UISlider, _super);

    UISlider.prototype.maxValue = 20;

    UISlider.prototype.elements = {
      '.idslider': 'slider'
    };

    UISlider.prototype.events = {
      'click .slider-m': 'clickMinus',
      'click .slider-p': 'clickPlus'
    };

    function UISlider() {
      var _this = this;
      UISlider.__super__.constructor.apply(this, arguments);
      this.html("<span class=\"slider-m\"></span><div class=\"idslider\"></div><span class=\"slider-p\"></span>");
      this.slider.slider({
        min: 1,
        max: this.maxValue,
        value: this.maxValue,
        change: function() {
          return _this.trigger('value', _this.slider.slider('value'));
        }
      });
    }

    UISlider.prototype.setValue = function(value) {
      return this.slider.slider('value', value || this.maxValue);
    };

    UISlider.prototype.getValue = function() {
      return this.slider.slider('value');
    };

    UISlider.prototype.clickMinus = function() {
      var val;
      val = this.slider.slider('value');
      if (val > 1) {
        val -= 1;
        this.slider.slider('value', val);
        return this.trigger('value', val);
      }
    };

    UISlider.prototype.clickPlus = function() {
      var val;
      val = this.slider.slider('value');
      if (val < this.maxValue) {
        val += 1;
        this.slider.slider('value', val);
        return this.trigger('value', val);
      }
    };

    UISlider.prototype._release = function() {
      this.slider.slider('destroy');
      return UISlider.__super__._release.apply(this, arguments);
    };

    return UISlider;

  })(Spine.Controller);

  module.exports = UISlider;

}).call(this);
am['controllers/uislider']=module.exports;
}).call(this);(function() {
  var DragImage, Editor, Panel;

  Editor = require('controllers/Editor');

  Panel = require('controllers/Panel');

  DragImage = require('controllers/DragImage');

  $(function() {
    var editor, panel, topimage,
      _this = this;
    topimage = new DragImage({
      el: $('.top-image')
    });
    topimage.bind('imageUpdated', function(ob) {
      var h;
      if (ob.width < topimage.el.width()) {
        alert("Ширина мала");
        topimage.makeEmpty();
      } else {
        h = ob.height > 500 ? 500 : ob.height;
        $('.top-image').css({
          height: h + 'px'
        });
      }
      return false;
    });
    panel = new Panel({
      el: $('.wyswyg')
    });
    return editor = new Editor({
      el: $('.post__content'),
      panel: panel
    });
  });

}).call(this);
