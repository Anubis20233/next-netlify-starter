// JS
const prizes = [
  { text: "3%", color: "#e32433" },
  { text: "Чайник", color: "#fff", cls: "white small" },
  { text: "5%", color: "#3291cb" },
  { text: "Ваги", color: "#ff6600", cls: "small" },
  { text: "10%", color: "#91c534" },
  { text: "Флешка", color: "#ffa800", cls: "small" },
  { text: "15%", color: "#e32433" },
  { text: "3%", color: "#464344" },
  { text: "25%", color: "#3090cc" },
  { text: "3%", color: "#ffa800" },
  { text: "Сковорідка", color: "#91c534", cls: "small" },
  { text: "5%", color: "#ffa800" },
];

const wheel = document.querySelector(".deal-wheel");
const spinner = wheel.querySelector(".spinner");
const trigger = wheel.querySelector(".btn-spin");
const ticker = wheel.querySelector(".ticker");

const prizeSlice = 360 / prizes.length;
const prizeOffset = Math.floor(180 / prizes.length);

let rotation = 0;
let currentSlice = 0;
let prizeNodes;

const createPrizeNodes = () => {
  prizes.forEach(({ text, color, cls }, i) => {
    const rotation = ((prizeSlice * i) * -1) - prizeOffset;
    spinner.insertAdjacentHTML(
      "beforeend",
      `<li class="prize ${cls}" data-reaction="" style="--rotate: ${rotation}deg">
        <span class="text">${text}</span>
      </li>`
    );
  });
};

const createConicGradient = () => {
  spinner.setAttribute(
    "style",
    `background: conic-gradient(
      from -90deg,
      ${prizes
        .map(({ color }, i) => `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`)
        .reverse()
      }
    );`
  );
};

const setupWheel = () => {
  createConicGradient();
  createPrizeNodes();
  prizeNodes = wheel.querySelectorAll(".prize");
};

const runTickerAnimation = () => {
  const values = window.getComputedStyle(spinner).transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];
  let radrad = Math.atan2(b, a);
  if (radrad < 0) radrad += (2 * Math.PI);
  const angle = Math.round(radrad * (180 / Math.PI));
  const slice = Math.floor(angle / prizeSlice);

  if (currentSlice !== slice) {
    ticker.style.animation = "none";
    setTimeout(() => ticker.style.animation = null, 10);
    currentSlice = slice;
  }

  requestAnimationFrame(runTickerAnimation);
};

const selectPrize = () => {
  const selected = Math.floor(rotation / prizeSlice);
  prizeNodes[selected].classList.add("selected");
  console.info(prizes[selected]);
  console.info(prizeNodes[selected].querySelector(".text").innerText);
};

trigger.addEventListener("click", () => {
  trigger.disabled = true;
  rotation = Math.floor(Math.random() * 360 + Math.random() * 4000);
  rotation = 360 * 2 + Math.floor(Math.random() * 30 + 28);

  prizeNodes.forEach((prize) => prize.classList.remove("selected"));
  wheel.classList.add("is-spinning");
  spinner.style.setProperty("--rotate", rotation);
  ticker.style.animation = "none";
  runTickerAnimation();
});

spinner.addEventListener("transitionend", () => {
  cancelAnimationFrame();
  rotation %= 360;
  selectPrize();
  wheel.classList.remove("is-spinning");
  spinner.style.setProperty("--rotate", rotation);
  trigger.disabled = false;
});

setupWheel();

