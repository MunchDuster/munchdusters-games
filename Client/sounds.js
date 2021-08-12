//button hover and click sound
const hoverSound = new Audio("button01.mp3");
const clickSound = new Audio("button02.mp3");

hoverSound.volume = 0.1;
clickSound.volume = 0.025;

var curMouseOverButton;
//play click sound
function playClick() {
  clickSound.currentTime = 0;
  clickSound.play();
}
//hover finished
function hoverFinish() {
  curMouseOverButton = null;
}
//play hover sound if entered game div
function hoverGameDiv(event) {
  if (!isDescendantOf(curMouseOverButton, event.path)) {
    curMouseOverButton = event.path[0];
    playHover();
  }
}
function playHover(event) {
  hoverSound.currentTime = 0;
  hoverSound.play().catch((err) => {});
}
//return whether array childPath contains ele
function isDescendantOf(ele, childPath) {
  for (var i = 0; i < childPath.length; i++) {
    if (childPath[i] == ele) {
      return true;
    }
  }
  return false;
}
