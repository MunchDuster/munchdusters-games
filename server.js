const PORT = process.env.PORT || 8080;
var gamesData;
var collection;

//REQUIREMENTS
const path = require('path');
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const http = require('http').createServer(app);
const file_system = require('fs');
const node_cleanup = require('node-cleanup');

//MongoDB Database for get games list
const uri = "mongodb+srv://themrduder:mememan@cluster0.h3bqk.mongodb.net/database01?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//Listen for node exit
node_cleanup(onExit);

//Connect to database
console.log("Connecting to database...");
client.connect(OnMongoClientConnected);


//Set static files
app.use(express.static(__dirname + "/Client"));
app.use(express.json());

//LISTENERS
async function OnMongoClientConnected(err) {
	if (err) {
		console.log("Connection failed: " + err);
	} else {
		console.log("Connected successfully.")
	}
	collection = client.db("database01").collection("maindata");

	var results = await collection.find().toArray();
	gamesData = results;

	addAppListeners();
	startServer();
}
function addAppListeners() {
	//Listen for game request
	app.post("/getGame", (request, response) => {
		sendGame(request, response);

	});
	//Listen for game download
	app.post("/downloadGame", (request, response) => {
		console.log("Game download " + displayTime() + ": " + request.body.name);
		OnGameDownloaded(request.body);
		response.end();
	});
	//Listen for main page
	app.get("/", function (req, res) {
		res.sendFile(__dirname + "/index.html");
	});
	//Listen for gamesList request
	app.get("/getGamesList", function (require, response) {
		response.json(gamesData);
	});
}
function startServer() {
	http.listen(PORT, () => {
		console.log("Listening at port: " + PORT);
	});
}


//FUNCTIONS
function OnGameDownloaded(game) {
	addGameDownloadToDatabase(game.name);
}
function sendGame(req, response) {
	const fileLocation = '/gameFiles/';
	const fileName = req.body.name + ".zip";

	var filePath = path.join(__dirname, fileLocation + fileName);
	var stat = file_system.statSync(filePath);

	response.setHeader('Content-Length', stat.size);
	response.setHeader('Content-Disposition', 'attachment;filename=SlidyCubes.zip');
	response.setHeader('Content-Type', 'application/octet-stream');
	response.download(filePath);
}
function onExit(exitCode, signal) {
	client.close();
	console.log('exitting');
}

function displayTime() {
	var date = new Date();
	var time = setLength(date.getSeconds(), 2) + ":" + setLength(date.getMinutes(), 2) + ":" + setLength(date.getHours(), 2);
	var date = setLength(date.getDate(), 2) + "/" + setLength(date.getMonth(), 2) + "/" + setLength(date.getFullYear(), 4);
	return time + " " + date;
}
function setLength(number, chars) {
	var str = number.toString();
	var charsNeeded = chars - str.length;
	for (var i = 0; i < charsNeeded; i++) {
		str = "0" + str;
	}
	return str;
}
function addGameDownloadToDatabase(gameName) {
	const filter = { name: gameName };
	// update the value of the 'z' field to 42
	const updateDocument = {
		$inc: {
			downloads: 1
		}
	};
	collection.updateOne(filter, updateDocument).then(result => {
		const { matchedCount, modifiedCount } = result;
		if (matchedCount && modifiedCount) {
			console.log(`Successfully databased.`)
		}
	})
		.catch(err => console.error(`Failed to database: ${err}`))
}