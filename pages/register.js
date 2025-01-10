function promiseAfterTimeout(seconds) {
  return new Promise(function (resolve) {
    setTimeout(() => resolve(), seconds*1000);
  });
}

function rotateWheel(degr) {
  let wheel = document.querySelector('.wheel');
  wheel.style.transform = 'rotate('+degr+'deg)';
  return promiseAfterTimeout(3);
}

function randomDegrees() {
  let randomFloat = Math.random()*360;
  let descreetDegrees = Math.round(randomFloat / 60) * 60;
  return descreetDegrees;
}

function getCurrentColor(currentDegrees) {
  let colors = ["green", "red", "orange", "cyan", "yellow", "blue"];
  let segmentCount = parseInt(currentDegrees/60);
  let segmentShift = segmentCount % colors.length;
  
  return colors[segmentShift];
}

function launchSpin() {
  currentRotation += randomDegrees();
  
  rotateWheel(currentRotation)
    .then(() => {
      let winColor = getCurrentColor(currentRotation);
      let result = document.querySelector('.result');
      result.style.backgroundColor = winColor;
    });
}

let currentRotation = 0;
let spinButton = document.querySelector('.spin');
spinButton.addEventListener('click', launchSpin);
