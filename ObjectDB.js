(function() {
    "use strict";

    let ObjectDB = function(database, objectClass, debug) {
        this.db = database;
        this.setClass(objectClass);
        this.debugMode = debug || false;
    }

    ObjectDB.prototype.setClass = function(aClass) {
        this.objectClass = aClass;
        this.objectClassName = (new aClass()).getLabel();
        this.byNamePath = '/' + this.objectClassName + '/names';
        this.byIdPath = '/' + this.objectClassName + '/ids';
        this.nextIdPath = '/' + this.objectClassName + '/nextid';
        this.uniqueIdPath = '/' + this.objectClassName + '/unique';
        this.debug('setClass(aClass=' + aClass.name + '): this.byIdPath=' + this.byIdPath);
    }

    ObjectDB.prototype.debug = function(msg) {
        if (this.debugMode) console.log('DEBUG ObjectDB::' + msg);
    }

    ObjectDB.prototype.setUnique = function(attrNames) {
        this.db.push(this.uniqueIdPath + '/', attrNames);
        this.debug('setUnique(' + attrNames + ') -> ' + this.uniqueIdPath + '/');
    }

    /*
     *
     */
    ObjectDB.prototype.save = function(obj) {
        var uniqueConstraint = null;
        var reqStatus = 'success';
        var reqStatusReason = null;
        var prevName;

        // Check object ID / must be provided even for a creation
        if (obj.id == null || obj.id == undefined) {
            // No ID is provided
            reqStatus = 'error'
            reqStatusReason = "data without id : " + obj.name + " - id is mandatory even for object creation;";
            this.debug('save(obj name=' + obj.name + ') NO ID PROVIDED');
        } else {
            // ID is provided
            // Check if another object exist with the same name and a different ID
            try {
                var data = this.getForName(obj.name);
            } catch (error) {
                console.error('### ERROR: getIdForName - ' + error.message);
            }
            try {
                if (data != null && data.id != undefined && obj.id != data.id) {
                    // Another Object found with different ID
                    reqStatus = 'error';
                    reqStatusReason = 'data with name: ' + obj.name + ', ID: ' + data.id + ' already exists.';
                    this.debug('save(obj name=' + obj.name + ', id=' + data.id + ') NAME ALREADY EXISTS');
                } else {
                    data = this.getForId(obj.id);
                    if (data != null) {
                        // Update case
                        // Check for object version integrity : 
                        //    given object version and database version must be equal
                        if (data.version != obj.version) {
                            // Version integrity issue
                            reqStatus = 'error';
                            reqStatusReason = 'version: ' + obj.version + ' for data with name: ' + obj.name + ', ID: ' + data.id + ' doesn\'t match database one :' + data.version;
                            this.debug('save(obj name=' + obj.name + ', id=' + data.id + ') VERSION INTEGRITY ISSUE');
                        } else {
                            // Remove existing name index
                            obj.version = obj.version + 1;
                            this.db.delete(this.byNamePath + '/' + data.name);
                            this.debug('save(obj name=' + obj.name + ') UPDATE (Version=' + obj.version + ')');
                        }
                    } else {
                        // Create case
                        this.debug('save(obj name=' + obj.name + ') CREATE');
                    }
                    this.db.push(this.byIdPath + '/' + obj.id, obj);
                    this.db.push(this.byNamePath + '/' + obj.name, obj.id);
                }
            } catch (error) {
                console.error('### ERROR: getIdForName - ' + error.message);
            }
        }
        return {
            status: reqStatus,
            message: reqStatusReason,
            id: obj.id,
            version: obj.version
        };
    }


    /*
     *
     */
    ObjectDB.prototype.getAll = function() {
        var data = null;
        try {
            this.debug('this.db.getData(' + this.byIdPath + ')');
            data = this.db.getData(this.byIdPath);
        } catch (error) {
            this.debug('### ERROR: getAll - ' + error.message);
        }
        var obj = null;
        if (data != null) {
            var objs = new Array();
            for (var k in data) {
                obj = new this.objectClass();
                obj.setFromJson(data[k]);
                objs.push(obj);
            }
            data = objs;
        }

        this.debug('getAll()' + (data == null ? ' NOT FOUND' : ' OK ' + data.length + ' FOUND'));
        //this.debug(JSON.stringify(data));

        return data;
    };

    ObjectDB.prototype.getForId = function(id) {
        var data = null;
        try {
            data = this.db.getData(this.byIdPath + '/' + id);
        } catch (error) {
            console.debug('### ERROR: getForId - ' + error.message);
        }
        var obj = null;
        if (data != null) {
            obj = new this.objectClass();
            obj.setFromJson(data);
            data = obj;
        }

        this.debug('getForId(' + id + ')' + (data == null ? ' NOT FOUND' : ' OK'));
        return data;
    };

    /*
     * Get the Name stored in the data base for the given Application id
     * @param id of the searched application
     * @returns name
     */
    ObjectDB.prototype.getIdForName = function(name) {
        var data = null;
        try {
            data = this.db.getData(this.byNamePath + '/' + name);
        } catch (error) {
            console.debug('### ERROR: getIdForName - ' + error.message);
        }
        this.debug('getForIdName(' + name + ')' + (data == null ? ' NOT FOUND' : ' OK'));
        return data;
    };

    /*
     *
     */
    ObjectDB.prototype.getForName = function(name) {
        var data = null;
        try {
            data = this.getIdForName(name);
            if (data != null) {
                data = this.db.getData(this.byIdPath + '/' + data);
            }
        } catch (error) {
            data = null;
            console.debug('### ERROR: getForName - ' + error.message);
        }
        var obj = null;
        if (data != null) {
            obj = new this.objectClass();
            obj.setFromJson(data);
            data = obj;
        }
        this.debug('getForName(' + name + ')' + (data == null ? ' NOT FOUND' : ' OK'));
        return data;
    };

    ObjectDB.prototype.delete = function(objId, objVersion) {
        var reqStatus = 'success';
        var reqStatusReason = null;
        try {
            var obj = this.getForId(objId);
            if (obj.version == objVersion) {
                this.db.delete(this.byNamePath + '/' + obj.name);
                this.db.delete(this.byIdPath + '/' + obj.id);
            } else {
                reqStatus = 'error';
                reqStatusReason = 'trying to delete object id=' + objId + ' with a version=' + objVersion + ' that does\'t match the database one=' + obj.version;
                this.debug('### ERROR: delete - ' + reqStatusReason);
            }
        } catch (error) {
            console.error('### ERROR: delete - ' + error.message);
            reqStatus = 'error';
            reqStatusReason = 'object id=' + objId + ' not found';
        }
        this.debug('delete(' + objId + ')' + (reqStatusReason == null ? ' OK' : ' NOT FOUND'));
        return {
            status: reqStatus,
            message: reqStatusReason,
            id: obj.id,
            version: obj.version
        };
    }

    module.exports = ObjectDB;
})();