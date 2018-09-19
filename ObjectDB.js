(function() {
    "use strict";
  
    var ObjectDB = function(database, objectClass, debug) {
        this.db = database;
        this.setClass(objectClass);
        this.debugMode = debug || false;
    }
    ObjectDB.prototype.setClass = function(aClass) {
        this.objectClass = aClass;
        this.objectClassName = (new aClass()).getLabel();
        this.byNamePath = '/' +  this.objectClassName + '/names';
        this.byIdPath = '/' +  this.objectClassName + '/ids';
        this.nextIdPath = '/' +  this.objectClassName + '/nextid';
        this.uniqueIdPath = '/' +  this.objectClassName + '/unique';
        this.debug('setClass(aClass='+aClass.name+'): this.byIdPath='+this.byIdPath);
    }

    ObjectDB.prototype.debug = function(msg) {
        if (this.debugMode) console.log('DEBUG ObjectDB::' + msg);
    }

    ObjectDB.prototype.setUnique = function(attrNames) {
        this.db.push(this.uniqueIdPath + '/', attrNames);
        this.debug('setUnique(' + attrNames + ') -> ' + this.uniqueIdPath + '/');
    }

    ObjectDB.prototype.save = function(obj) {
        var mustUpdateNextIdCounter = false;
        var nextId = null;
        var uniqueConstraint = null;
        var reqStatus = 'success';
        var reqStatusReason = null;
        var prevName;
        try {
            // check if unique constraint is respected
            //uniqueConstraint = this.db.getData(this.uniqueIdPath);
            //console.log('uniqueConstraint: '+uniqueConstraint);
            //console.log('searching name: ' + obj.name);
            var dataId = this.getIdForName(obj.name);
            // Check name not already exist
            //console.log('getIdForName(' + obj.name + ')=' + dataId);
            if (dataId != null) {
                if (obj.id != dataId) {
                    reqStatus = 'error'
                    reqStatusReason = "data with name: " + obj.name + " already exists";
                    this.debug('save(obj name=' + obj.name + ') NAME ALREADY EXISTS');
                }
            }
        } catch (error) {
            //console.error('### ERROR: getIdForName - ' + error.message);
        }

        if (reqStatusReason == null) { // No duplication attempt
            //get new next id
            try {
                nextId = this.db.getData(this.nextIdPath);
                if (obj.id == null) {
                    // new Object
                    obj.id = nextId;
                    nextId++;
                    mustUpdateNextIdCounter = true;
                    this.debug('save(obj name=' + obj.name + ') NEW OBJECT id=' + obj.id);
                } else if (obj.id >= nextId) {
                    nextId = obj.id + 1;
                    mustUpdateNextIdCounter = true;
                    this.debug('save(obj name=' + obj.name + ') NEW OBJECT WITH id=' + obj.id + ' > MAXID');
                }
            } catch (error) {
                mustUpdateNextIdCounter = true;
                if (obj.id == null) {
                    // not found - new object type => id=1
                    obj.id = 1;
                    this.debug('save(obj name=' + obj.name + ') INIT MAXID = 2');
                }
                nextId = obj.id + 1;
            }

            var data = this.getForId(obj.id);
            //obj must have a name and id attribute
            // store all data by id 
            this.db.push(this.byIdPath + '/' + obj.id, obj);

            // store or update an index with name/id
            if (data != null) {
                this.debug('save(obj name=' + obj.name + ') UPDATE');
                this.db.delete(this.byNamePath + '/' + data.name);
            } else {
                this.debug('save(obj name=' + obj.name + ') CREATE');
            }
            this.db.push(this.byNamePath + '/' + obj.name, obj.id);

            if (mustUpdateNextIdCounter) {
                // store new next index value
                this.db.push(this.nextIdPath, nextId);

                this.debug('save() UPDATE MAXID = ' + nextId);
            }
        }
        return { status: reqStatus, message: reqStatusReason, id: obj.id };
    };

    ObjectDB.prototype.getAll = function() {
        var data = null;
        try {

            this.debug('this.db.getData('+this.byIdPath+')');
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
            //console.error('### ERROR: getForId - ' + error.message);
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
    /**
     * Get the Name stored in the data base for the given Application id
     * @param id of the searched application
     * @returns name
     */
    ObjectDB.prototype.getIdForName = function(name) {
        var data = null;
        try {
            data = this.db.getData(this.byNamePath + '/' + name);
        } catch (error) {
            //console.error('### ERROR: getIdForName - ' + error.message);
        }

        this.debug('getForIdName(' + name + ')' + (data == null ? ' NOT FOUND' : ' OK'));
        return data;
    };

    ObjectDB.prototype.getForName = function(name) {
        var data = null;
        try {
            data = this.getIdForName(name);
            if (data != null) {
                data = this.db.getData(this.byIdPath + '/' + data);
            }
        } catch (error) {
            data = null;
            //console.error('### ERROR: getForName - ' + error.message);
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

    ObjectDB.prototype.delete = function(objId) {
        var reqStatus = 'success';
        var reqStatusReason = null;
        try {
            var obj = this.getForId(objId);
            this.db.delete(this.byNamePath + '/' + obj.name);
            this.db.delete(this.byIdPath + '/' + obj.id);
        } catch (error) {
            //console.error('### ERROR: delete - ' + error.message);
            reqStatus = 'error';
            reqStatusReason = 'object id=' + objId + ' not found';
        }
        this.debug('delete(' + objId + ')' + (reqStatusReason == null ? ' OK' : ' NOT FOUND'));
        return { status: reqStatus, message: reqStatusReason, id: obj.id };
    }

    module.exports = ObjectDB;
})();