'use strict';
if (typeof app === 'undefined') { throw new Error('This application\'s requires site.js.'); }

app.start(function () {
    var
        ObservableObject = kendo.data.ObservableObject,
        DataSource = kendo.data.DataSource
    ;

    var Users = DataSource.define(function () {
        return {
            name: "",
            transport: {
                read: {
                    "url": "http://jsonplaceholder.typicode.com/users",
                    "dataType": "json",
                    data: function () {
                        return {};
                    }
                }
            }
        };
    });

    var Posts = DataSource.define(function () {
        return {
            name: "",
            transport: {
                read: {
                    "url": "http://jsonplaceholder.typicode.com/posts",
                    "dataType": "json"
                }
            }
        };
    });

    var MVVM = ObservableObject.extend({
        init: function () {
            var that = this;
            ObservableObject.fn.init.call(that, {
                "users": new Users(),
                "posts": new Posts()
            });

            that.posts.bind("read:data", function (args) {
                args["data"] = { "userId": that.get("user.id") || 0 };
                console.log(args);
            });

            that.on("change", "user", function () {
                that.posts.read();
            });

            that.debug();
        }
    });

    kendo.bind("#test", new MVVM());
});
