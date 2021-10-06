const gameBox = document.getElementById("GameBox");
const gameList = document.getElementById("GameList");
const gameDownloads = gameBox.querySelector(".GameDownloads");
var abortController;

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

	gameBox.querySelector(".GameUpdates").innerText = '';
	for (var i = 0; i < game.updates.length; i++) {
		gameBox.querySelector(".GameUpdates").innerText = (i + 1) + '.\n' + game.updates[i] + '\n\n' + gameBox.querySelector(".GameUpdates").innerText;
	}


	//show play button if game can play test
	if (game.hasPlayTest) {
		gameBox.querySelector(".GamePlayButton").style.display = "inline-block";
	} else {
		gameBox.querySelector(".GamePlayButton").style.display = "none";
	}
	curGame = game;
}
async function getGameFromServer(game) {
	abortController = new AbortController();
	var options = {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		signal: abortController.signal,
		body: JSON.stringify(game)
	};
	fetch("/getGame", options)
		.then(async function (res) {

			//downloadGame(teedStream[0], res);
			showDownloadProgress(res);

		}).catch(e => {
			if (e.name === "AbortError") {
				console.log('download aborted');
			} else {
				console.log('download error: ' + e);
			}
		});
}
async function showDownloadProgress(res) {
	var response2 = res.clone();
	const reader = res.body.getReader();
	const contentLength = res.headers.get('Content-Length');
	console.log('content length: ' + contentLength);
	curGame.bytes = contentLength;
	let chunks = []; // array of received binary chunks (comprises the body)
	var total = 0;
	// infinite loop while the body is downloading
	while (true) {
		// done is true for the last chunk
		// value is Uint8Array of the chunk bytes
		const { done, value } = await reader.read();
		if (done) {
			gameChunks = chunks;
			OnGameRecieved(response2)
			break;
		}
		total += value.length;

		chunks.push(value);

		updateDownloadPercent(total / contentLength, total);
	}
}
async function importButtonClicked() {
	showDownloadBox();
	if (!curGame.hasLoaded) {
		getGameFromServer(curGame);
	} else {
		downloadReady();
	}
	//getGameFromServer(curGame);
}
async function OnGameRecieved(response) {
	abortController = null;
	curGame.hasLoaded = true;
	curGame.blob = await response.blob();
	downloadReady();
}
async function downloadGame() {
	const newBlob = new Blob([curGame.blob]);

	var gameHREF = window.URL.createObjectURL(newBlob);
	const link = document.createElement('a');
	link.href = gameHREF;
	link.setAttribute('download', curGame.name + ".zip");
	document.body.appendChild(link);
	link.click();
	link.parentNode.removeChild(link);

	window.URL.revokeObjectURL(curGame.blob);

	hideDownloadBox();
	tellServerDownload();
	updateDownloads();
}
function cancelImport() {
	console.log('cancel download clicked!');
	if (!curGame.hasLoaded && abortController) {
		abortController.abort();
	}
	hideDownloadBox();
}
function downloadReady() {
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