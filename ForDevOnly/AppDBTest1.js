
const ItApplication=require('./ItApplication.js');

/*
var app = new ItApplication();
app.setName('SAP');
app.setId(12);
app.setStatus('PROD');
app.setType('PROGICIEL');

console.log(JSON.stringify(app));
*/
var APPS = [
{"id":1,"name":"SAP","type":"PROGICIEL","status":"PROD"},
{"id":2,"name":"moSaic","type":"SPECIFIQUE","status":"DEV"},
{"id":3,"name":"M@tis","type":"SPECIFIQUE","status":"DEV"},
{"id":4,"name":"SAS","type":"SPECIFIQUE","status":"ARCH"},
];

var apps = new Array();

for (var i=0; i < APPS.length; i++){
	var app = new ItApplication();
	app.setFromJson(APPS[i]);
	apps.push(app);
}

for (var i=0; i < apps.length; i++){
	console.log(apps[i].toJsonString());
}


var JsonDB = require('node-json-db');
//The second argument is used to tell the DB to save after each push 
//If you put false, you'll have to call the save() method. 
//The third argument is to ask JsonDB to save the database in an human readable format. (default false) 
var db = new JsonDB("myAppDataBase", true, true);
 
//Pushing the data into the database 
//With the wanted DataPath 
//By default the push will override the old value 
for (var i=0; i < apps.length; i++){
	db.push("/application/names/"+apps[i].name, apps[i]);
	db.push("/application/ids/"+apps[i].id, apps[i].name);
}

try {
	//GET BY NAME
	var search="/application/SAP";
	var data = db.getData(search);
	console.log('data: '+JSON.stringify(data));
	
	// GET ALL
	search="/application";
	data = db.getData(search);

	console.log('data: '+JSON.stringify(data));
	for (k in data){
		console.log('k=: '+k+' -> '+JSON.stringify(data[k]));
	}

	search="/application/SAP/id";
	data = db.getData(search);

	console.log('data: '+JSON.stringify(data));
	for (k in data){
		console.log('k=: '+k+' -> '+JSON.stringify(data[k]));
	}

	// GET BY ID
	search="/application/ids/3";
	data = db.getData(search);
	search="/application/"+data;
	data = db.getData(search);
	console.log('data: '+JSON.stringify(data));
	for (k in data){
		console.log('k=: '+k+' -> '+JSON.stringify(data[k]));
	}
} catch(error) {
//The error will tell you where the DataPath stopped. In this case test1 
//Since /test1/test does't exist. 
    console.error('### ERROR: '+error.message);
	//console.log('data: '+JSON.stringify(data));
}
 
//Deleting data 
//db.delete("/test1");
 
//Save the data (useful if you disable the saveOnPush) 
db.save();
 
//In case you have a exterior change to the databse file and want to reload it 
//use this method 
db.reload();