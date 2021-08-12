const gameList = document.getElementById("GameList");
const gameDiv = document.getElementById("GameBox");
var curGame;

//Request Games List
populateGamesList();

//functions
async function populateGamesList() {
  fetch("/getGamesList").then(function (response) {
    response.json().then((data) => {
      data.forEach((game) => {
        addGame(game);
      });
    });
  });
}
async function addGame(game) {
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

  game.gameDiv = gameDiv;
  game.downloadsElement = gameDiv.querySelector(".GameDownloads");

  //Open page function
  const openGamePage = () => {
    //hide games list and show and game box
    gameDiv.style.display = "block";
    gameList.style.display = "none";

    //set game box stuff
    gameDiv.querySelector(".GameBoxIcon").src = game.icon;
    gameDiv.querySelector(".GameBoxName").innerText = game.name;
    gameDiv.querySelector(".GameVersionNumber").innerText = game.version;
    gameDiv.querySelector(".GameDescription").innerText = game.description;
    gameDiv.querySelector(".GameDownloads").innerText =
      game.downloads + " Downloads";

    //show play button if game can play test
    if (game.hasPlayTest) {
      gameDiv.querySelector(".GamePlayButton").style.display = "inline-block";
    } else {
      gameDiv.querySelector(".GamePlayButton").style.display = "none";
    }
    curGame = game;
  };
  //ADD CLICK TO GO TO GAME page
  outerDiv.addEventListener("click", openGamePage);
  outerDiv.addEventListener("click", playClick);
  outerDiv.addEventListener("mouseenter", playHover);
  outerDiv.addEventListener("mouseleave", hoverFinish);
  //ADD TO GAME LIST
  gameList.appendChild(outerDiv);
}
async function tellServer(game) {
  game.downloadsElement.innerText = ++game.downloads + " Downloads";
  // TELL SERVER THE GAME
  const link = "/" + encodeURI(game.name) + "/d";
  fetch(link, { method: "GET" });
}
async function backToMenu() {
  gameDiv.style.display = "none";
  gameList.style.display = "block";
  playClick();
}
async function downloadButtonClicked() {
  tellServer(curGame);
  playClick();
  window.location.href = curGame.downloadFile;
}
async function playGame() {
  window.location.href = curGame.playTestLink;
}
