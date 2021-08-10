//button hover and click sound
const hoverSound = new Audio("button01.mp3");
const clickSound = new Audio("button02.mp3");

hoverSound.volume = 0.5;
clickSound.volume = 0.5;

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
function playHover(event) {
  if (!isDescendantOf(curMouseOverButton, event.path)) {
    curMouseOverButton = event.path[0];
    hoverSound.currentTime = 0;
    hoverSound.play();
  }
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
