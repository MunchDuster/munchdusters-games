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
	if (game.broken) outerDiv.className += " BrokenGame";

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

	//Set game references
	game.gameDiv = outerDiv;
	game.downloadsElement = outerDiv.querySelector(".GameDownloads");

	//ADD CLICK TO GO TO GAME page
	outerDiv.addEventListener("click", () => { OpenGame(game); });
	outerDiv.addEventListener("click", playClick);
	outerDiv.addEventListener("mouseenter", playHover);
	outerDiv.addEventListener("mouseleave", hoverFinish);

	//ADD TO GAME LIST
	gameList.appendChild(outerDiv);
}
async function backToMenu() {
	gameBox.style.display = "none";
	hideDownloadBox();
	gameList.style.display = "block";
	playClick();
}
async function playGame() {
	window.location.href = curGame.playTestLink;
}