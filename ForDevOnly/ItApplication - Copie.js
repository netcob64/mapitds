(function() {

    "use strict";
    var ItApplication = function() {
        this.id = -1;
        this.name = "_app-name";
        this.type = "_app-type";
        this.status = "_status";
    }

    ItApplication.prototype.setName = function(name) {
        this.name = name;
    };
    ItApplication.prototype.setId = function(id) {
        this.id = id;
    };
    ItApplication.prototype.setType = function(type) {
        this.type = type;
    };
    ItApplication.prototype.setStatus = function(status) {
        this.status = status;
    };
    ItApplication.prototype.setFromJson = function(jsonAppObj) {
        for (var k in jsonAppObj) {
            this[k] = jsonAppObj[k];
        }
    }
    ItApplication.prototype.toJsonString = function() {
        return JSON.stringify(this);
    }
    ItApplication.prototype.prettyString = function() {
        var str;
        str='ItApplication: ';
        for (var k in this){
            if (typeof this[k] !== "function")
            str+=', '+k+'='+this[k];
        }
        return str;
    }
    module.exports = ItApplication;
})();