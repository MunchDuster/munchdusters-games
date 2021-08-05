//button hover and click sound
const hoverSound = new Audio("button01.mp3");
const clickSound = new Audio("button02.mp3");
var curMouseOverButton;
function playClick() {
  clickSound.currentTime = 0;
  clickSound.play();
}
function hoverFinish() {
  curMouseOverButton = null;
}
function playHover(event) {
  if (!isDescendantOf(curMouseOverButton, event.path)) {
    curMouseOverButton = event.path[0];
    hoverSound.currentTime = 0;
    hoverSound.play();
  }
}
function isDescendantOf(ele, childPath) {
  for (var i = 0; i < childPath.length; i++) {
    if (childPath[i] == ele) {
      return true;
    }
  }
  return false;
}
