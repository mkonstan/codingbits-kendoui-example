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
            isArray = $.isArray,
            format = kendo.format,
            ObservableObject = kendo.data.ObservableObject
        ;

        if (!ObservableObject.fn.on) {
            ObservableObject.fn.on = function (eventName, fieldNames, handler) {
                var that = this;
                // intialize event pipeline
                var pipeline = that._eventPipeline;
                if (!pipeline) {
                    pipeline = that._eventPipeline = {};
                }
                var event = pipeline[eventName] = pipeline[eventName] || { "refCounter": 0 };
                // process incomming list of fields and bind them to callbacks
                var fields = isArray(fieldNames) ? fieldNames : [fieldNames];
                for (var i = 0; i < fields.length; i++) {
                    var fieldName = fields[i];
                    var callbacksList = event[fieldName] = event[fieldName] || [];
                    callbacksList.push(handler);
                }

                // if no event binder setup we will do it now
                if (event.refCounter === 0) {
                    // create one global event sync for this type of events
                    //console.log("Event filter eanbled");
                    that.bind(eventName, (event.handler = function (args) {
                        // get callback list
                        //console.log(format("Reference counter {0}", event.refCounter));
                        var callbacks = event[args.field];
                        if (!callbacks) return;
                        var length = callbacks.length;
                        args["eventName"] = eventName;
                        for (var i = 0; i < length; i++) {
                            callbacks[i].call(this, args);
                        }
                    }));
                }
                event.refCounter += fields.length;
                return that;
            };
        }

        if (!ObservableObject.fn.off) {
            ObservableObject.fn.off = function (eventName, fieldNames) {
                var that = this;
                var pipeline = that._eventPipeline;

                // see if event pipeline exists if it does not we will exit
                if (!pipeline) return;

                // see if event exists in pipline if it does not we will exit
                var event = pipeline[eventName];
                if (!event) return;

                // process incomming list of fields and bind them to callbacks
                var fields = isArray(fieldNames) ? fieldNames : [fieldNames];
                for (var i = 0; i < fields.length; i++) {
                    var fieldName = fields[i];
                    if (event.hasOwnProperty(fieldName)) {
                        //console.log(format("Removing filter for {0} field", fieldName));
                        delete event[fieldName];
                    }
                }
                event.refCounter -= fields.length;
                if (event.refCounter <= 0) {
                    //console.log(format("Reference counter reached {0}. Event filter disabled. ", event.refCounter));
                    that.unbind(eventName, event.handler);
                }
                return that;
            };
        }

        if (!ObservableObject.fn.debug) {
            ObservableObject.fn.debug = (function () {
                var
                    stringify = kendo.stringify,
                    DataSource = kendo.data.DataSource
                ;
                function replacer(key, value) {
                    if (key === "_eventPipeline" || value instanceof DataSource) {
                        return undefined;
                    }
                    return value;
                };
                return function (id) {
                    var that = this;
                    var uid = id || ("__D" + that.uid + "D__");
                    var out = $(uid);
                    if (out.length === 0) {
                        out = $("<pre id=" + uid + "></pre>").appendTo("body");
                    }
                    that.bind("change", function (e) {
                        out.text(stringify(that, replacer, 2));
                    });
                    out.text(stringify(that, replacer, 2));
                    return that;
                };
            }());
        }

    })(window.kendo.jQuery);

    return window.kendo;

}, typeof define == 'function' && define.amd ? define : function (_, f) { f(); });
