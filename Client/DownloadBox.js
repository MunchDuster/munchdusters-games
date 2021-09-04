const downloadBox = document.getElementById("DownloadBox");
const downloadBar = document.getElementById("DownloadBar");
const downloadPercent = document.getElementById("DownloadPercent");
const downloadButton = document.getElementById("DownloadButton");
const downloadMessage = document.getElementById("DownloadMessage");
function hideDownloadBox() {
	downloadBox.style.display = 'none';
}
function showDownloadBox() {
	downloadBox.style.display = 'block';
	downloadButton.style.display = 'none';
	downloadMessage.innerText = "fetching files";
}
function showDownloadButton() {
	downloadButton.style.display = 'inline-block';
	downloadMessage.innerText = "Download ready";
}
function updateDownloadPercent(percent, totalBytes) {
	downloadPercent.innerText = Math.floor(percent * 100).toString() + "% ( " + (Math.floor(totalBytes / 100000) / 10) + "MB )";
	downloadBar.value = percent * 100;
}
