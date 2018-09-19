const ItApplication = require('./ItApplication.js');

/*
var app = new ItApplication();
app.setName('SAP');
app.setId(12);
app.setStatus('PROD');
app.setType('PROGICIEL');

console.log(JSON.stringify(app));
*/
var APPS = [
    { "id": 1, "name": "SAP", "type": "PROGICIEL", "status": "PROD" },
    { "id": 2, "name": "moSaic", "type": "SPECIFIQUE", "status": "DEV" },
    { "id": 3, "name": "M@tis", "type": "SPECIFIQUE", "status": "DEV" },
    { "id": 4, "name": "SAS", "type": "SPECIFIQUE", "status": "ARCH" },
];

var apps = new Array();

for (var i = 0; i < APPS.length; i++) {
    var app = new ItApplication();
    app.setFromJson(APPS[i]);
    apps.push(app);
}

for (var i = 0; i < apps.length; i++) {
    console.log(apps[i].toJsonString());
}


var JsonDB = require('node-json-db');
//The second argument is used to tell the DB to save after each push 
//If you put false, you'll have to call the save() method. 
//The third argument is to ask JsonDB to save the database in an human readable format. (default false) 
var db = new JsonDB("myAppDataBase", true, true);
const ItApplicationDB = require('./ItApplicationDB');
var appDB = new ItApplicationDB(db);

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

var data = appDB.getForName('SAP');
trace('BY NAME SAP',true);

data = appDB.getForId(3);
trace('BY ID 3',true);

data = appDB.getForId(23);
trace('BY ID 23',true);

data = appDB.getAll();
trace('ALL',false);

//Deleting data 
//db.delete("/test1");

//Save the data (useful if you disable the saveOnPush) 
db.save();

//In case you have a exterior change to the databse file and want to reload it 
//use this method 
db.reload();