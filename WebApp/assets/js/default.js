'use strict';
if (typeof app === 'undefined') { throw new Error('This application\'s requires site.js.'); }

app.start(function () {
    var
        DataSource = kendo.data.DataSource,
        ObservableObject = kendo.data.ObservableObject
    ;

    var States = DataSource.define({
        transport: {
            read: {
                dataType: "json"
                //url: "http://api.guerrillaeconomics.net/states"
            }
        },
        schema: {
            model: { id: "id" },
            parse: function (response) {
                return (response || []).map(function (item) {
                    return { id: item.Id, value: item.Id, text: item.Text, mapid: item.mapid };
                });
            }
        }
    });
    var Counties = DataSource.define({
        //{"Value":"Atlantic","StateId":"NJ","Text":"Atlantic","mapid":"us_nj_34001","Body":"County","Order":31}
        //data: [{ id: "-", value: "", text: "Select County" }]
        transport: {
            read: {
                dataType: "json"
            }
        },
        schema: {
            model: { id: "id" },
            parse: function(response) {
                return [{ id: "-", value: "", text: "Select County" }]
                    .concat((response || []).map(function(item) {
                        return { id: item.rec_id, value: item.Value, text: item.Text, mapid: item.mapid };
                    }));
            }
        }
    });

    var Report = ObservableObject.extend({
        init: function () {
            var that = this;

            ObservableObject.fn.init.call(that, {
                states: new States(),
                counties: new Counties()
            });

            that.states.on("read:url", function (args) {
                console.log("states:read:url");
                args.url = "http://api.guerrillaeconomics.net/states";
            }).on("change", function () {
                console.log("states:change");
                that.set("state", this.at(0));
            });

            that.counties.on("read:url", function (args) {
                console.log("counties:read:url");
                args.url = "http://api.guerrillaeconomics.net/districts";
            }).on("change", function () {
                console.log("counties:change");
                that.set("county", this.at(0));
            });

            // monitor propery change 
            that.on("change", "state", function (args) {
                console.log("state:change");
                that.counties.read({
                    state: this.get("state.value"),
                    body: "county"
                });
            });
        }
    });

    kendo.bind("#test", new Report());
});