const PORT = process.env.PORT || 8080;

//Send files packages
const fs = require("fs");
const path = require("path");

const rawdata = fs.readFileSync(path.resolve(__dirname, "data.json"));
const gamesData = JSON.parse(rawdata);

console.log(new Date().toUTCString());

//Start server
const express = require("express");
const { response } = require("express");
const app = express();
const http = require("http").createServer(app);

//Set static files
app.use(express.static(__dirname + "/Client"));

//Log available Games

console.log("Available Games: " + gamesData.length);
for (var i = 0; i < gamesData.length; i++) {
  console.log(i + 1 + ". " + gamesData[i].name);

  //Listen for game downloaded signal
  const thisi = i;
  app.get("/" + encodeURI(gamesData[i].name) + "/d", function (req, res) {
    console.log(gamesData[thisi].name + " has had a download.");
    gamesData[thisi].downloads++;
    updateJSON();
  });
}

//Listen for main page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
//Listen for gamesList request
app.get("/getGamesList", function (require, response) {
  response.json(gamesData);
});

//SERVER LISTEN
http.listen(PORT, () => {
  console.log("listening on " + PORT);
});

//UPDATE JSON file
function updateJSON() {
  var string = JSON.stringify(gamesData);
  /*
  string = string.replace(/,/g, ",\n");
  string = string.replace(/}/g, "}\n");
  string = string.replace(/{/g, "{\n");
  */
  fs.writeFile("data.json", string, function (err) {
    if (err) throw err;
  });
}
