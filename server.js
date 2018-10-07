const express = require('express');
const appli = express();
const JsonDB = require('node-json-db');
const ObjectDB = require('./ObjectDB');

const CLASS_MAP = {};
const ItApplication = require('./ItApplication');
CLASS_MAP[(new ItApplication()).getLabel()] = ItApplication;
const ItMetamodel = require('./ItMetamodel');
CLASS_MAP[(new ItMetamodel()).getLabel()] = ItMetamodel;
const ItMessage = require('./ItMessage');
CLASS_MAP[(new ItMessage()).getLabel()] = ItMessage;
const ItMap = require('./ItMap');
CLASS_MAP[(new ItMap()).getLabel()] = ItMap;

const cors = require("cors");
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;
//const DEBUG = process.env.DEBUG || false; 
const DEBUG = true;
const TRACE = process.env.TRACE || true;

const debugApp = function(msg) {
    if (DEBUG)
        console.log('DEBUG ::' + msg);
}
const traceApp = function(msg) {
    if (TRACE)
        console.log('TRACE ::' + msg);
}


var INITDATA = [{
        dataClass: ItApplication,
        data: [
            { id: "21c91830-c63a-11e8-8467-61d1fa9d9990", name: "SAP", type: "PROGICIEL", label: "no-label", version: 0, status: "PROD", onServiceSince: "01/02/2005", validityStart: null, validityEnd: null },
            { id: "21c91830-c63a-11e8-8467-61d1fa9d9991", name: "moSaic", type: "SPECIFIQUE", label: "no-label", version: 0, status: "DEV", onServiceSince: null, validityStart: "01/01/2018", validityEnd: null },
            { id: "21c91830-c63a-11e8-8467-61d1fa9d9992", name: "M@tis", type: "SPECIFIQUE", label: "no-label", version: 0, status: "DEV", onServiceSince: null, validityStart: "10/05/2018", validityEnd: null },
            { id: "21c91830-c63a-11e8-8467-61d1fa9d9993", name: "SAS", type: "SPECIFIQUE", label: "no-label", version: 0, status: "ARCH", onServiceSince: "01/02/2015", validityStart: "01/01/200", validityEnd: null }
        ]
    },
    {
        dataClass: ItMetamodel,
        data: [
            { id: "21c91830-c63a-11e8-8467-61d1fa9d9994", name: "Application", version: 0, status: "ACTIVATED" },
            { id: "21c91830-c63a-11e8-8467-61d1fa9d9995", name: "Site", version: 0, status: "DRAFT" },
            { "id": "21c91830-c63a-11e8-8467-61d1fa9d9996","name": "Message","label": "hello","type": "_type","status": "DRAFT","version": 0,"validityStart": "_start","validityEnd": "_end","classStatus": "DRAFT",
                            "attributes": [
                                {"type": "NUM","name": "id","label": "ID","values": "","isSystem": true,"valSystem": false},
                                {"type": "NUM","name": "version","label": "Version", "values": "","isSystem": true,"valSystem": false},
                                {"type": "TXT","name": "name","label": "Name", "values": "","isSystem": true,"valSystem": false},
                                {"type": "LIST","name": "type","label": "Type","values": "", "isSystem": true,"valSystem": false},
                                {"type": "LIST","name": "status","label": "Status","values": "","isSystem": true,"valSystem": false},
                                {"type": "DATE","name": "validityStart","label": "Validity start date","values": "","isSystem": true,"valSystem": false},
                                {"type": "DATE","name": "validityEnd","label": "Validity end date","values": "","isSystem": true,"valSystem": false},
                                {"type": "LIST","name": "media","label": "Media","values": "FTP;MSG","isSystem": false,"valSystem": false}
                            ],
                            "relations": []
            }
        ]
    }
];

/**
* create or update data in db file
*/
function initializeData(dbObject) {
    const initialData = new Array();
    for (var i = 0; i < INITDATA.length; i++) {

        var objsData = INITDATA[i].data;
        for (var j = 0; j < objsData.length; j++) {
            var obj = new(INITDATA[i].dataClass)();
            obj.setFromJson(objsData[j]);
            initialData.push(obj);
        }
    }
    debugApp(JSON.stringify(initialData));
    for (var i = 0; i < initialData.length; i++) {
        debugApp('IMPORT ' + initialData[i].getLabel() + ' : ' + JSON.stringify(initialData[i]));
        dbObject.setClass(initialData[i].getClass());
        dbObject.save(initialData[i]);
    }
}


/**
 * get key=value data from url
 */
function extract(paramsFilter, reqParamStr) {
    var params = new Object();
    for (var j = 0; j < paramsFilter.length; j++) {
        params[paramsFilter[j]] = null;
    }
    const t = reqParamStr.split('&');
    for (var i = 0; i < t.length; i++) {
        const pNameValue = t[i].split('=');
        const pName = pNameValue[0];
        const pValue = pNameValue[1];
        for (var j = 0; j < paramsFilter.length; j++) {
            if (pName == paramsFilter[j]) {
                params[pName] = pValue;
            }
        }
    }
    return params;
};


//The second argument is used to tell the DB to save after each push 
//If you put false, you'll have to call the save() method. 
//The third argument is to ask JsonDB to save the database in an human readable format. (default false) 
// We are going to implement a JWT middleware that will ensure the validity of our token. We'll require each protected route to have a valid access_token sent in the Authorization header
//var db = new JsonDB("myAppDataBase", true, true);

var dbObject = new ObjectDB(new JsonDB("mapitDataBase", true, true), ItApplication, DEBUG);
initializeData(dbObject);

appli.options('*', cors());
/**
 * init http header
 */
appli.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-  With, Content-Type, Accept");
    next();
});

/* configure appli to use bodyParser()
 * this will let us get the data from a POST
 */
appli.use(bodyParser.urlencoded({ extended: true }));
appli.use(bodyParser.json());

/**
 * Http Get Handler (READ)
 * example of url: localhost:port/api/class=application?id=1
 */
appli.route('/api/:params').get( /*authCheck, */ (req, res) => {
    const requestedAppParams = req.params['params'];
    var params = extract(['id', 'name', 'class'], requestedAppParams);
    traceApp('/api/:params GET called : class=' + params.class);
    debugApp('params=' + JSON.stringify(params));
    var data = {}
    if (params.class != null) {
        dbObject.setClass(CLASS_MAP[params.class]);
        if (params.id != null) {
            data = dbObject.getForId(params.id);
        } else if (params.name != null) {
            data = dbObject.getForName(params.name);
        } else {
            data = dbObject.getAll();
        }
    }

    debugApp('==> ' + JSON.stringify(data));
    res.json({ data });
});

/**
 * Http Post Handler : for Create or Update data
 */
appli.route('/api/:params').post((req, res) => {
    const requestedAppParams = req.params['params'];
    var params = extract(['class'], requestedAppParams);
    traceApp('/api/:params POST called : class=' + params.class);
    debugApp('params=' + JSON.stringify(params));
    var result = null;

    if (params.class != null) {
        dbObject.setClass(CLASS_MAP[params.class]);
        result = dbObject.save(req.body);
    }

    debugApp('==> ' + JSON.stringify(result));
    traceApp('==> id=' + result.id);
    res.json(result);
});

/*
 * Http Delete Handler : for data deletion
*/
appli.route('/api/:params').delete((req, res) => {
    const requestedAppParams = req.params['params'];
    var params = extract(['id', 'class', 'version'], requestedAppParams);

    traceApp('/api/:params DELETE called : class=' + params.class+", id="+params.id+", name="+params.name+", version="+params.version);
    debugApp('params=' + JSON.stringify(params));
    if (params.class != null) {
        dbObject.setClass(CLASS_MAP[params.class]);
        result = dbObject.delete(params.id, params.version); //TODO: use req.body.id instead
    }
    debugApp('==> ' + JSON.stringify(result));
    res.json(result);
});

/*
 * Start server listening on port 
 */
appli.listen(port, () => {
    traceApp('mapit ds : REST API Server started on port ' + port);
});