'use strict';
if (typeof jQuery === 'undefined') { throw new Error('This application\'s requires jQuery framework.'); }
if (typeof kendo === 'undefined') { throw new Error('This application\'s requires kendoui framework.'); }

var console = console || { log: function () { } };

(function ($, kendo) {
    var
		app = window.app = window.app || {},
		document = window.document,
		map = $.map,
		isArray = $.isArray,
		isString = function (value) { return $.type(value) === "string"; },
		isFunction = $.isFunction,
		extend = $.extend,
		proxy = $.proxy
    ;
    function set(field, value) {
        var
            that = this,
            paths = field.split("."),
            length = paths.length
        ;
        for (var i = 0; i < (length - 1) ; i++) {
            var path = paths.shift();
            that = that[path] = that[path] || {};
        }
        that[paths.shift()] = value;
    };
    if (!app.set)
        app.set = proxy(set, app);


    /** Application pipeline */
    (function () {
        var callbacksPipeline = [];

        var pipelineInit = function () {
            var that = this;
            var callbacks = $.Callbacks("once");
            callbacksPipeline.push(callbacks);
            return function (delegate) {
                callbacks.add(function () {
                    delegate.call(that, that, app);
                });
            }
        };
        app.ctor = pipelineInit.call(app);
        app.init = pipelineInit.call(app);
        app.start = pipelineInit.call(app);
        $(function () {
            while (callbacksPipeline.length > 0) {
                callbacksPipeline.shift().fire();
            }
        });
    }());

}(jQuery, kendo));
