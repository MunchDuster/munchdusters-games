//DOWNLOAD ICON
var downloadIcon = document.createElement("img");
downloadIcon.className = "DownloadIcon";
downloadIcon.src = "download.png";
downloadIcon.setAttribute("downloadName", name);
downloadIcon.setAttribute("downloadLink", file);
console.log("settings file link to " + file);
downloadIcon.onclick = download;
outerDiv.appendChild(downloadIcon);

async function download(event) {
  console.log(event);
  console.log(event.path);
  var element = event.path[0];
  var name = element.getAttribute("downloadName");
  var link = element.getAttribute("downloadLink");

  // this can be used to download any image from webpage to local disk
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
  xhr.open("GET", link); // This is to download the canvas Image
  xhr.send();
}
