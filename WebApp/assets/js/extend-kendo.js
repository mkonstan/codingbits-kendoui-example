'use strict';
if (typeof jQuery === 'undefined') { throw new Error('This application\'s requires jQuery framework.'); }
if (typeof kendo === 'undefined') { throw new Error('This application\'s requires kendoui framework.'); }
/*
 * Kendo UI v2014.2.1008 (http://www.telerik.com/kendo-ui)
 * Copyright 2014 Telerik AD. All rights reserved.
 *
 * Kendo UI commercial licenses may be obtained at
 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete
 * If you do not own a commercial license, this file shall be governed by the trial license terms.
 */
(function (f, define) {
    define(["kendo"], f);
})(function () {

    (function ($, undefined) {
        var
            isFunction = $.isFunction,
            extend = $.extend,
            callbacks = $.Callbacks,
            isArray = $.isArray
        ;

        (function (ObservableObject) {
            var baseInit = ObservableObject.fn.init;
            if (!ObservableObject.fn.on) {
                ObservableObject.fn.init = function (value) {
                    baseInit.call(this, value);
                    this._atomicEvents = { "change": null, "set": null, "get": null };
                };
                ObservableObject.fn.on = function (eventName, fieldName, handler) {
                    var that = this;
                    // intialize event synck
                    var event = that._atomicEvents[eventName] = that._atomicEvents[eventName] || {};
                    // process incomming list of fields and bind them to callbacks
                    var fields = isArray(fieldName) ? fieldName : [fieldName];
                    for (var i = 0; i < fields.length; i++) {
                        var callbacksList = event[fieldName] = event[fieldName] || [];
                        callbacksList.push(handler);
                    }

                    // if no event binder setup we will do it now
                    if (!event.isBound) {
                        // create one global event sync for this type of events
                        that.bind(eventName, function (args) {
                            // get callback list
                            var callbacks = event[args.field];
                            if (!callbacks) return;
                            var length = callbacks.length;
                            for (var i = 0; i < length; i++) {
                                callbacks[i].call(this, args)
                            }
                        });
                        event["isBound"] = true;
                    }
                    return that;
                };
            }
        }(kendo.data.ObservableObject));

        (function (DataSource) {
            var CRUD = ["read", "create", "update", "destroy"];

            if (!DataSource.define) {
                DataSource.define = (function () {
                    var attachBubbleHandlers = (function () {
                        var ERROR = "error";
                        return function () {
                            var that = this;
                            that._data.bind(ERROR, function (e) {
                                that.trigger(ERROR, e);
                            });
                        }
                    }());

                    return function (options) {
                        var optionsBase = !isFunction(options) ? options : options();
                        return DataSource.extend({
                            init: function (options) {
                                var that = this;
                                var op = (!isFunction(options) ? options : options()) || {};
                                op = extend(true, {}, optionsBase, options);
                                op["error"] = op["error"] || function (e) {
                                    alert(e.status);
                                };

                                op.transport.parameterMap = function (data, type) {
                                    var args = { "source": that, "data": data, "type": type };
                                    that.trigger("parameterMap", args);
                                    return args.data || data;
                                };

                                CRUD.forEach(function (entry) {
                                    var obj = op.transport[entry];
                                    if (!obj) return;

                                    if (!obj["url"]) {
                                        obj["url"] = function (options) {
                                            var args = { "options": options };
                                            that.trigger(entry + ":url", args);
                                            return args.url;
                                        };
                                    }

                                    if (!obj["data"]) {
                                        obj["data"] = function () {
                                            var args = { data: op.data };
                                            that.trigger(entry + ":data", args);
                                            return args.data;
                                        }
                                    };
                                });
                                DataSource.fn.init.call(that, op);
                                attachBubbleHandlers.call(that);
                            },
                            on: function (eventName, handler) {
                                var that = this;
                                that.bind(eventName, handler);
                                return that;
                            }
                        });
                    };
                }());
            };
        }(kendo.data.DataSource));

    })(window.kendo.jQuery);

    return window.kendo;

}, typeof define == 'function' && define.amd ? define : function (_, f) { f(); });
