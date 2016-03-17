'use strict';
if (typeof app === 'undefined') { throw new Error('This application\'s requires site.js.'); }

app.start(function () {
    var
        format = kendo.format,
        ObservableObject = kendo.data.ObservableObject,
        handler = function (args) {
            console.log(format("{0}: {1}={2}", args.eventName, args.field, this.get(args.field)));
        }
    ;
    var o = new ObservableObject({
        "value": "Hello",
        "counter": 0
    });
    // setup event listener
    o.on("change", ["value", "counter"], handler);
    o.set("value", "Hello my friend!");
    o.set("counter", 23);
    // disable event listener
    o.off("change", "value");
    // no event will be triggered for this change
    o.set("value", "Hello there!");
    // change event triggered here
    o.set("counter", 2);
    // disable event listener
    o.off("change", "counter");
    // no event will be triggered for this change
    o.set("counter", 24);
    // restore filter
    o.on("change", ["value", "counter"], handler);
    // change event is triggered
    o.set("counter", 345);
});