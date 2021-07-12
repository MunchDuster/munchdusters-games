const gameList = document.getElementById("GameList");
const gameDiv = document.getElementById("GameBox");

//Request Games List
var httpRequest = new XMLHttpRequest();
httpRequest.onload = function (data) {
  if (/*data.type == "Buffer"*/ isJSON(data.target.responseText)) {
    console.log("json recieved");
    var gamesList = JSON.parse(data.target.responseText);
    console.log(gamesList);

    for (var i = 0; i < gamesList.length; i++) {
      addGame2List(gamesList[i]);
    }
  } else console.log("returned data is not json file");
};
httpRequest.open("GET", "/getGamesList");
httpRequest.send();

//functions
function isJSON(str) {
  if (typeof str !== "string") return false;
  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    return type === "[object Object]" || type === "[object Array]";
  } catch (err) {
    return false;
  }
}
function addGame2List(game) {
  //CREATE OUTER DIV
  var outerDiv = document.createElement("div");
  outerDiv.className = "ListedGame";

  //GAME ICON
  var gameIcon = document.createElement("img");
  gameIcon.className = "GameIcon";
  gameIcon.src = game.icon;
  outerDiv.appendChild(gameIcon);

  //GAME NAME
  var gameName = document.createElement("div");
  gameName.className = "GameName";
  gameName.innerText = game.name;
  outerDiv.appendChild(gameName);

  //VERSION NUMBER
  var versionNumber = document.createElement("div");
  versionNumber.className = "VersionNumber";
  versionNumber.innerText = game.version;
  outerDiv.appendChild(versionNumber);

  //ADD CLICK TO GO TO GAME page
  outerDiv.onclick = function () {
    gameDiv.style.display = "block";
    gameList.style.display = "none";
    gameDiv.querySelector(".GameBoxIcon").src = game.icon;
    gameDiv.querySelector(".GameBoxName").innerText = game.name;
    gameDiv.querySelector(".GameBoxVersionNumber").innerText = game.version;
    gameDiv.querySelector(".GameDescription").innerText = game.description;
    gameDiv.querySelector(".GameDownloads").innerText =
      game.downloads + " Downloads";
    gameDiv
      .querySelector(".GameBoxDownloadButton")
      .setAttribute("downloadName", game.name);
    gameDiv
      .querySelector(".GameBoxDownloadButton")
      .setAttribute("downloadLink", game.downloadFile);
    gameDiv.querySelector(".GameBoxDownloadButton").onclick = download;
  };
  //ADD TO GAME LIST
  gameList.appendChild(outerDiv);
}
async function download(event) {
  var element = event.path[0];
  var noOfDownloadsEle = element.parentElement.querySelector(".GameDownloads");
  var number = parseInt(noOfDownloadsEle.innerText.split(" ")[0]);
  noOfDownloadsEle.innerText = ++number + " Downloads";
  console.log(event);
  console.log(event.path);

  var name = element.getAttribute("downloadName");
  var link = element.getAttribute("downloadLink");

  // DOWNLOAD THE GAME
  let xhr = new XMLHttpRequest();
  xhr.responseType = "blob";
  xhr.onload = function () {
    let a = document.createElement("a");
    a.href = window.URL.createObjectURL(xhr.response);
    a.download = name;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  xhr.open("GET", link);
  xhr.send();

  //MESSAGE SERVER THAT USER HAS downloaded
  var httpRequest = new XMLHttpRequest();
  httpRequest.open("GET", "/" + encodeURI(name) + "/d");
  httpRequest.send();
}
function back2MainMenu() {
  gameDiv.style.display = "none";
  gameList.style.display = "block";
}
