(function() {
    "use strict";
    //const JsonDB = require('node-json-db');
    const ItApplication = require('./ItApplication');

    var ItApplicationDB = function(database) {
        this.db = database;
        this.byNamePath = "/application/names";
        this.byIdPath = "/application/ids";
    }

    ItApplicationDB.prototype.save = function(app) {
        // store all data by name
        this.db.push(this.byNamePath + '/' + app.name, app);
        // store id index just with name
        this.db.push(this.byIdPath + '/' + app.id, app.name);
    };

    ItApplicationDB.prototype.getAll = function() {
        var data = null;
        try {
            data = this.db.getData(this.byNamePath);
        } catch (error) {
            console.error('### ERROR: ' + error.message);
        }
        var app = null;
        if (data != null) {
            var apps = new Array();
            for (var k in data) {
                app = new ItApplication();
                app.setFromJson(data[k]);
                apps.push(app);
            }
            data = apps;
        }
        return data;
    };

    ItApplicationDB.prototype.getForName = function(name) {
        var data = null;
        try {
            data = this.db.getData(this.byNamePath + '/' + name);
        } catch (error) {
            console.error('### ERROR: ' + error.message);
        }
        var app = null;
        if (data != null) {
            app = new ItApplication();
            app.setFromJson(data);
            data = app;
        }
        return data;
    };
    /**
     * Get the Name stored in the data base for the given Application id
     * @param id of the searched application
     * @returns name
     */
    ItApplicationDB.prototype.getNameForId = function(id) {
        var data = null;
        try {
            data = this.db.getData(this.byIdPath + '/' + id);
        } catch (error) {
            console.error('### ERROR: ' + error.message);
        }
        return data;
    };

    ItApplicationDB.prototype.getForId = function(id) {
        var data = null;
        try {
            data = this.getNameForId(id);
            if (data != null) {
                data = this.db.getData(this.byNamePath + '/' + data);
            }
        } catch (error) {
            data = null;
            console.error('### ERROR: ' + error.message);
        }
        var app = null;
        if (data != null) {
            app = new ItApplication();
            app.setFromJson(data);
            data = app;
        }
        return data;
    };

    module.exports = ItApplicationDB;
})();