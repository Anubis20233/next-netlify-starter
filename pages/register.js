/* Шрифти */
@font-face {
  font-family: "Bebas";
  src: url('../fonts/Bebas.ttf');
}

/* Загальні налаштування для усіх елементів */
* {
  box-sizing: border-box;
}

/* Основні налаштування для сторінки */
.body-deal-wheel {
  display: grid; /* Використовуємо сітку для центрування */
  place-items: center;
  overflow: hidden; /* Сховуємо все, що виходить за межі */
  font-family: 'Bebas', sans-serif; /* Підключаємо шрифт */
}

/* Основний блок колеса */
.deal-wheel {
  --size: clamp(250px, 80vmin, 700px); /* Адаптивний розмір колеса */
  --lg-hs: 0 3%;
  --lg-stop: 50%;
  --lg: linear-gradient(
    hsl(var(--lg-hs) 0%) 0 var(--lg-stop),
    hsl(var(--lg-hs) 20%) var(--lg-stop) 100%
  );
  position: relative;
  display: grid;
  grid-gap: calc(var(--size) / 20); /* Відстань між елементами */
  align-items: center;
  grid-template-areas: "spinner" "trigger"; /* Для елементів всередині */
  font-size: calc(var(--size) / 21); /* Розмір шрифта адаптується до колеса */
}

/* Декоративні елементи, фон */
.deal-wheel::before, .deal-wheel::after {
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Не даємо взаємодіяти з фоном */
}

/* Центр колеса */
.deal-wheel::before {
  top: -7%;
  left: 0;
  background-image: url('../img/center.svg');
  background-size: 20%;
  background-position: center;
  background-repeat: no-repeat;
}

/* Кільце колеса */
.deal-wheel::after {
  top: -10%;
  left: -4%;
  background-image: url('../img/circle.svg');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

/* Спільний стиль для всіх елементів всередині колеса */
.deal-wheel > * {
  grid-area: spinner;
}

/* Стиль для кнопки запуску */
.deal-wheel .btn-spin {
  grid-area: trigger;
  justify-self: center;
}

/* Стилі для самого колеса */
.spinner {
  position: relative;
  display: grid;
  align-items: center;
  width: var(--size);
  height: var(--size);
  transform: rotate(calc(var(--rotate, 25) * 1deg)); /* Кут повороту колеса */
  border-radius: 50%; /* Кругла форма */
}

/* Тінь під колесом */
.spinner::after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../img/shadow.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transform: rotate(20deg);
  opacity: 0.6;
}

/* Стиль для кожного сектору */
.prize {
  display: flex;
  align-items: center;
  padding: 0 calc(var(--size) / 6) 0 calc(var(--size) / 25);
  width: 46.5%;
  height: 50%;
  transform-origin: center right;
  transform: rotate(var(--rotate)); /* Обертання тексту */
  user-select: none;
}

/* Стилі для тексту на секторах */
.prize.white span {
  color: #000;
}

.prize.small span {
  font-size: 1.4em;
}

.prize span {
  color: #fff;
  text-transform: uppercase;
  position: relative;
  left: -20%;
  font-size: 1.8em;
  text-shadow: 0 0 5px rgba(0, 0, 0, .3);
}

/* Стилі для анімації тикера (язычок) */
.ticker {
  position: relative;
  left: -8%;
  width: 15%;
  height: 15%;
  z-index: 1;
}

.ticker img {
  display: block;
  width: 100%;
  transform: rotate(4deg);
}

/* Кнопка для запуску колеса */
.btn-spin {
  color: white;
  background: black;
  border: none;
  font-size: inherit;
  padding: 0.9rem 2rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-spin:disabled {
  cursor: progress;
  opacity: 0.25;
}

/* Анімація для обертання колеса */
.is-spinning .spinner {
  transition: transform 8s cubic-bezier(0.1, -0.01, 0, 1);
}

/* Анімація для тикера (язычок) */
.is-spinning .ticker {
  animation: tick 700ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Ефект для вибраного сектора */
@keyframes tick {
  40% {
    transform: rotate(-12deg); /* Поворот язычка */
  }
}

/* Анімація для вибраного сектора */
@keyframes selected {
  25% {
    transform: scale(1.25);
    text-shadow: 1vmin 1vmin 0 hsla(0 0% 0% / 0.1);
  }
  40% {
    transform: scale(0.92);
    text-shadow: 0 0 0 hsla(0 0% 0% / 0.2);
  }
  60% {
    transform: scale(1.02);
    text-shadow: 0.5vmin 0.5vmin 0 hsla(0 0% 0% / 0.1);
  }
  75% {
    transform: scale(0.98);
  }
  85% {
    transform: scale(1);
  }
}

/* Медіа-запити для адаптації на малих екранах */
@media (max-width: 420px) {
  .deal-wheel::after {
    top: -12%;
  }
  .prize {
    width: 42.5%;
  }
  .prize span {
    left: -60%;
  }
}
