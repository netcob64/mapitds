(function() {
    // ItMap herite de ItObject
    "use strict";
    const ItObject = require('./ItObject');
    var ItMap = function() {
        // this = instance de ItApplication
        // this.__proto__ === ItApplication.prototype (classe)
        // this.__proto__.__proto__ === ItObject.prototype (classe parente)
        // this.__proto__.__proto__.constructor (constructeur parent)
        // super(nom):
        this.__proto__.__proto__.constructor.apply(this, arguments);
        
       this.assetID = "_graphData";
       this.assetClass = "_graphData";
        this.graphData ="_graphData";

    }

    ItMap.prototype.getLabel = function() {
        return "map";
    }

    // le "extends" est ici
    ItMap.prototype.__proto__ = ItObject.prototype;


    ItMap.prototype.setOnServiceSince = function(date) {
        this.onServiceSince = date;
    };
    
    module.exports = ItMap;
})();