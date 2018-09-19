(function() {
    // ItMessage herite de ItObject
    "use strict";
    const ItObject = require('./ItObject');
    var ItMetamodel = function() {
        this.__proto__.__proto__.constructor.apply(this, arguments);
        
        //this.onServiceSince = "_on_service_since";

    }

    ItMetamodel.prototype.getLabel = function() {
        return "meta-model";
    }

    // le "extends" est ici
    ItMetamodel.prototype.__proto__ = ItObject.prototype;


    //ItMetamodel.prototype.setOnServiceSince = function(date) {
    //    this.onServiceSince = date;
    //};
    
    module.exports = ItMetamodel;
})();