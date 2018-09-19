(function() {
    "use strict";
    var ItObject = function() {
        this.id = -1;
        this.name = "_name";
        this.label = "_label";
        this.type = "_type";
        this.status = "_status";
        this.version = "_version";
        this.validityStart = "_start";
        this.validityEnd = "_end";
    }
    ItObject.prototype.getLabel = function() {
        return "it_object";
    }
    ItObject.prototype.getClass = function () {
        return this.__proto__.constructor;
        //return ItObject;
    }

    ItObject.prototype.setId = function(id) {
        this.id = id;
    };
    ItObject.prototype.setName = function(name) {
        this.name = name;
    };

    ItObject.prototype.setType = function(type) {
        this.type = type;
    };
    ItObject.prototype.setStatus = function(status) {
        this.status = status;
    };
    ItObject.prototype.setValidityStart = function(date) {
        this.validityStart = date;
    };
    ItObject.prototype.setValidityEnd = function(date) {
        this.validityEnd = date;
    };


    ItObject.prototype.setFromJson = function(jsonAppObj) {
        for (var k in jsonAppObj) {
            this[k] = jsonAppObj[k];
        }
    }
    ItObject.prototype.toJsonString = function() {
        return JSON.stringify(this);
    }
    ItObject.prototype.prettyString = function() {
        var str;
        str = this.__proto__.constructor.name + ': ';
        for (var k in this) {
            if (typeof this[k] !== "function")
                str += ', ' + k + '=' + this[k];
        }
        return str;
    }
    module.exports = ItObject;
})();