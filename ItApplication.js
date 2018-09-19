(function() {
    // ItApplication herite de ItObject
    "use strict";
    const ItObject = require('./ItObject');
    var ItApplication = function() {
        this.__proto__.__proto__.constructor.apply(this, arguments);
        this.onServiceSince = "_on_service_since";        
    }
    ItApplication.prototype.getLabel = function() {
        return "application";
    }
    // le "extends" est ici
    ItApplication.prototype.__proto__ = ItObject.prototype;


    ItApplication.prototype.setOnServiceSince = function(date) {
        this.onServiceSince = date;
    };
    
    module.exports = ItApplication;
})();
