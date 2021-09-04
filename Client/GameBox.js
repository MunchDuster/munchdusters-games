const gameBox = document.getElementById("GameBox");
const gameList = document.getElementById("GameList");
const gameDownloads = gameBox.querySelector(".GameDownloads");
var gameChunks;
var abort = { controller: null, hasLoaded: true };

function OpenGame(game) {
	//hide games list and show and game box
	gameBox.style.display = "block";
	gameList.style.display = "none";

	//set game box stuff
	gameBox.querySelector(".GameBoxIcon").src = game.icon;
	gameBox.querySelector(".GameBoxName").innerText = game.name;
	gameBox.querySelector(".GameVersionNumber").innerText = game.version;
	gameBox.querySelector(".GameDescription").innerText = game.description;
	gameBox.querySelector(".GameDownloads").innerText =
		game.downloads + " Downloads";

	gameBox.querySelector(".GameDownloads")

	//show play button if game can play test
	if (game.hasPlayTest) {
		gameBox.querySelector(".GamePlayButton").style.display = "inline-block";
	} else {
		gameBox.querySelector(".GamePlayButton").style.display = "none";
	}
	curGame = game;
}
async function getGameFromServer(game) {
	const controller = new AbortController();
	abort.controller = controller;
	abort.hasLoaded = false
	var options = {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		signal: controller.signal,
		body: JSON.stringify(game)
	};
	fetch("/getGame", options)
		.then(async function (res) {
			const reader = res.body.getReader();
			const contentLength = res.headers.get('Content-Length');
			let chunks = []; // array of received binary chunks (comprises the body)
			var total = 0;
			// infinite loop while the body is downloading
			while (true) {
				// done is true for the last chunk
				// value is Uint8Array of the chunk bytes
				const { done, value } = await reader.read();
				if (done) {
					gameChunks = chunks;
					OnGameRecieved();
					break;
				}
				total += value.length;

				chunks.push(value);

				updateDownloadPercent(total / contentLength, total);
			}
		}).catch(e => {
			if (e.name === "AbortError") {
				alert('download aborted');
			}
		});
}
async function importButtonClicked() {
	showDownloadBox();
	if (!curGame.hasLoaded) {
		getGameFromServer(curGame);
	} else {
		downloadReady();
	}

}
async function OnGameRecieved() {
	abort.hasLoaded = true;
	curGame.hasLoaded = true;
	downloadReady();
}
function downloadGame() {
	const game = curGame;

	const blob = new Blob(gameChunks);
	var gameHREF = window.URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = gameHREF;
	link.setAttribute('download', game.name + ".zip");
	document.body.appendChild(link);
	link.click();
	link.parentNode.removeChild(link);

	window.URL.revokeObjectURL(blob);

	hideDownloadBox();
	tellServerDownload();
	updateDownloads();
}
function cancelImport() {
	console.log('cancel download clicked!');
	if (!abort.hasLoaded && abort.controller) {

		abort.controller.abort();
	}
	hideDownloadBox();
}
function downloadReady() {
	gameChunks = curGame.gameChunks;
	showDownloadButton();
}
function tellServerDownload() {
	var game = curGame;

	var options = {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(game)
	};

	fetch("/downloadGame", options);
}
function updateDownloads() {
	gameDownloads.innerText = (++curGame.downloads) + " Downloads";
}