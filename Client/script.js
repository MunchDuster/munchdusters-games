const gameList = document.getElementById("GameList");
const gameDiv = document.getElementById("GameBox");

//Request Games List when window finished loading
fetch("/getGamesList").then(function (response) {
  response.json().then((data) => {
    console.log("json recieved");
    data.forEach((game) => {
      addGame(game);
    });
  });
});

//functions
var curGame;
function addGame(game) {
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

  //Open page function
  const openGamePage = () => {
    gameDiv.style.display = "block";
    gameList.style.display = "none";
    gameDiv.querySelector(".GameBoxIcon").src = game.icon;
    gameDiv.querySelector(".GameBoxName").innerText = game.name;
    gameDiv.querySelector(".GameBoxVersionNumber").innerText = game.version;
    gameDiv.querySelector(".GameDescription").innerText = game.description;
    gameDiv.querySelector(".GameDownloads").innerText =
      game.downloads + " Downloads";
    gameDiv.setAttribute("downloadName", game.name);
    gameDiv
      .querySelector(".GameDownloads")
      .setAttribute("downloads", game.downloads);
    gameDiv.setAttribute("downloadLink", game.downloadFile);

    curGame = gameDiv;
  };
  //ADD CLICK TO GO TO GAME page
  outerDiv.addEventListener("click", openGamePage);
  outerDiv.addEventListener("click", playClick);
  outerDiv.addEventListener("mouseenter", playHover);
  outerDiv.addEventListener("mouseleave", hoverFinish);
  //ADD TO GAME LIST
  gameList.appendChild(outerDiv);
}
async function tellServer(element) {
  var downloadNumberElement =
    element.parentElement.querySelector(".GameDownloads");
  var number = parseInt(downloadNumberElement.getAttribute("downloads"));
  downloadNumberElement.innerText = ++number + " Downloads";
  // TELL SERVER THE GAME
  const link = "/" + encodeURI(element.getAttribute("downloadName")) + "/d";
  fetch(link, { method: "GET" });
}
function back2MainMenu() {
  gameDiv.style.display = "none";
  gameList.style.display = "block";
  playClick();
}
function downloadButtonClicked() {
  tellServer(curGame);
  playClick();
  window.location.href = curGame.getAttribute("downloadLink");
}
