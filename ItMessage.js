(function() {
    // ItMessage herite de ItObject
    "use strict";
    const ItObject = require('./ItObject');
    var ItMessage = function() {
        // this = instance de ItApplication
        // this.__proto__ === ItApplication.prototype (classe)
        // this.__proto__.__proto__ === ItObject.prototype (classe parente)
        // this.__proto__.__proto__.constructor (constructeur parent)
        // super(nom):
        this.__proto__.__proto__.constructor.apply(this, arguments);
        
        this.onServiceSince = "_on_service_since";
        this.source ="_from";
        this.target ="_to";
        this.data ="_to";
        this.frequency ="_frequency";
        this.media ="_media";
        this.protocol ="_media";
    }

    ItMessage.prototype.getLabel = function() {
        return "message";
    }

    // le "extends" est ici
    ItMessage.prototype.__proto__ = ItObject.prototype;


    ItMessage.prototype.setOnServiceSince = function(date) {
        this.onServiceSince = date;
    };
    
    module.exports = ItMessage;
})();