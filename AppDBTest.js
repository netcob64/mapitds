const ItApplication = require('./ItApplication.js');
const ObjectDB = require('./ObjectDB');
/*
var app = new ItApplication();
app.setName('SAP');
app.setId(12);
app.setStatus('PROD');
app.setType('PROGICIEL');

console.log(JSON.stringify(app));
*/
var APPS = [
    { id: 1, name: "SAP", type: "PROGICIEL", status: "PROD", onServiceSince: "01/02/2005", validityStart: null, validityEnd: null},
    { id: 2, name: "moSaic", type: "SPECIFIQUE", status: "DEV", onServiceSince: null, validityStart: "01/01/2018", validityEnd: null },
    { id: 3, name: "M@tis", type: "SPECIFIQUE", status: "DEV", onServiceSince: null, validityStart: "10/05/2018", validityEnd: null },
    { id: 4, name: "SAS", type: "SPECIFIQUE", status: "ARCH", onServiceSince: "01/02/2015", validityStart: "01/01/200", validityEnd: null },
];

var apps = new Array();

for (var i = 0; i < APPS.length; i++) {
    var app = new ItApplication();
    app.setFromJson(APPS[i]);
    apps.push(app);
}
/*
for (var i = 0; i < apps.length; i++) {
    console.log(apps[i].toJsonString());
}
*/

var JsonDB = require('node-json-db');
//The second argument is used to tell the DB to save after each push 
//If you put false, you'll have to call the save() method. 
//The third argument is to ask JsonDB to save the database in an human readable format. (default false) 
var db = new JsonDB("myAppDataBase", true, true);

var appDB = new ObjectDB(db, 'application', ItApplication);

//Pushing the data into the database 
//With the wanted DataPath 
//By default the push will override the old value 
for (var i = 0; i < apps.length; i++) {
    appDB.save(apps[i]);
}

function trace(msg, isObj) {
    console.log(msg);
    if (data == null) {
        console.log('\tNULL');
    } else if (isObj) {
		console.log(data.prettyString());
    } else {

        for (k in data) {
            //console.log('\tk=: ' + k + ' -> ' + JSON.stringify(data[k]));
            console.log(data[k].prettyString());
        }
    }
}

var extract = function(paramsFilter, reqParamStr) {
    params = new Object();
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
var request="id=2&name=SAP&titi";
var r=extract(['id','name'],request);
console.log(JSON.stringify(r));
console.log('id='+r.id);
console.log('name='+r.name);


var data = appDB.getForName('SAP');
trace('get BY NAME SAP',true);

data = appDB.getForId('3');
trace('get BY ID "3"',true);

data = appDB.getForId(3);
trace('get BY ID 3',true);

data.type='PIPO';
appDB.save(data);
trace('update app id=3',true);

appDB.delete(data);
trace('delete obj 3',true);

data = appDB.getForId(23);
trace('get BY ID 23',true);

data = appDB.getAll();
trace('get ALL',false);

//Deleting data 
//db.delete("/test1");

//Save the data (useful if you disable the saveOnPush) 
db.save();

//In case you have a exterior change to the databse file and want to reload it 
//use this method 
db.reload();