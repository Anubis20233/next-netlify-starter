import { useState, useEffect } from 'react';

export default function Home() {
  const [canSpin, setCanSpin] = useState(true);  // Статус доступності прокручування
  const [prize, setPrize] = useState('');
  const [history, setHistory] = useState([]);
  const [timer, setTimer] = useState(0);
  const [userName, setUserName] = useState('');
  const [isNameEntered, setIsNameEntered] = useState(false);  // Статус введення імені

  // Додано відсотки для кожного призу
  const prizes = [
    { name: 'VIP premium на 2 тижня', chance: 10 },
    { name: 'VIP premium на 1 тиждень', chance: 15 },
    { name: 'VIP premium на 3 дні', chance: 20 },
    { name: 'VIP free на 3 тижня', chance: 5 },
    { name: 'Prefix на 7 днів', chance: 8 },
    { name: 'Medic на 4 дні', chance: 12 },
    { name: 'Повезе у наступний раз', chance: 10 },
    { name: 'VIP Fri на 3 тижня', chance: 5 },
    { name: 'VIP fri на 2 тижня', chance: 4 },
    { name: 'VIP fri на 1 тиждень', chance: 3 },
    { name: 'VIP fri на 5 днів', chance: 3 },
    { name: 'VIP Fri на 3 дні', chance: 4 },
    { name: 'Імунітет на AWP на 3 дні', chance: 3 },
  ];

  useEffect(() => {
    const prizeData = JSON.parse(localStorage.getItem('prizeData')) || [];
    setHistory(prizeData);

    const lastSpinDate = localStorage.getItem('lastSpinDate');
    if (lastSpinDate) {
      const lastSpin = new Date(lastSpinDate);
      const now = new Date();
      const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 днів

      if (now - lastSpin >= oneWeek) {
        setCanSpin(true); // Якщо пройшло більше 7 днів, дозволити прокрутку
      } else {
        setCanSpin(false); // Якщо менше 7 днів, не дозволяти прокрутку
        const countdown = Math.ceil((oneWeek - (now - lastSpin)) / 1000);
        setTimer(countdown); // Встановити час до наступного обертання
        const timerInterval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timerInterval);
              setCanSpin(true); // Коли час вичерпано, дозволити прокрутку
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timerInterval);
      }
    }
  }, []);

  // Функція для вибору призу з урахуванням ймовірностей
  const getPrize = () => {
    const totalChance = prizes.reduce((acc, prize) => acc + prize.chance, 0);
    const randomNumber = Math.random() * totalChance;
    let accumulatedChance = 0;

    for (let prize of prizes) {
      accumulatedChance += prize.chance;
      if (randomNumber <= accumulatedChance) {
        return prize.name;
      }
    }
  };

  const spinWheel = () => {
    if (!canSpin) return;

    const wonPrize = getPrize();  // Отримуємо приз на основі ймовірностей
    setPrize(wonPrize);
    setCanSpin(false);
    setIsNameEntered(true);  // Показуємо поле для введення імені
    localStorage.setItem('lastSpinDate', new Date().toISOString()); // Оновлюємо дату останнього обертання
  };

  const handleNameSubmit = () => {
    if (userName.trim() === '') {
      alert('Будь ласка, введіть своє ім\'я');
      return;
    }

    // Додаємо ім'я та приз в історію
    const newHistory = [...history, { date: new Date().toLocaleString(), prize: prize, name: userName }];
    setHistory(newHistory);
    localStorage.setItem('prizeData', JSON.stringify(newHistory));
    setIsNameEntered(false);  // Закриваємо поле для введення імені
    setUserName('');  // Очищаємо поле для імені
  };

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const remainingSeconds = seconds % 60;

    return `${days > 0 ? `${days} днів ` : ''}${hours > 0 ? `${hours} годин ` : ''}${minutes > 0 ? `${minutes} хвилин ` : ''}${remainingSeconds} секунд`;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '30px' }}>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <h1>Крутимо Колесо Фортуни!</h1>
        <div
          id="wheel"
          style={{
            width: '300px',
            height: '300px',
            border: '10px solid #4CAF50',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transition: 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)',
          }}
        >
          {prizes.map((prize, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                width: '50%',
                height: '50%',
                backgroundColor: '#f39c12',
                border: '1px solid #fff',
                clipPath: 'polygon(100% 100%, 0 100%, 100% 0)',
                transform: `rotate(${index * 60}deg)`,
              }}
            >
              {prize.name}
            </div>
          ))}
        </div>
        <button
          id="spinButton"
          onClick={spinWheel}
          disabled={!canSpin}
          style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          {canSpin ? 'Прокрутити колесо' : 'Недоступно'}
        </button>
        <p id="message" style={{ marginTop: '10px', color: 'red' }}>
          {!canSpin
            ? `Наступне обертання буде доступне через ${formatTime(timer)}`
            : ''}
        </p>
        <p id="prize" style={{ marginTop: '20px', fontSize: '24px', color: '#f39c12' }}>
          {prize ? `Ви виграли: ${prize}` : ''}
        </p>

        {/* Якщо приз виграно, з'являється поле для введення імені */}
        {isNameEntered && (
          <div style={{ marginTop: '20px' }}>
            <input
              type="text"
              placeholder="Введіть своє ім'я"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{ padding: '10px', fontSize: '16px' }}
            />
            <button
              onClick={handleNameSubmit}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                marginLeft: '10px',
                cursor: 'pointer',
                backgroundColor: '#4CAF50',
                color: 'white',
              }}
            >
              Підтвердити
            </button>
          </div>
        )}

        {/* Історія виграшів */}
        <div id="history" style={{ marginTop: '30px', textAlign: 'left' }}>
          <h3>Історія виграшів</h3>
          <ul>
            {history.map((entry, index) => (
              <li key={index}>
                <strong>{entry.date}</strong>: {entry.name} виграв(ла) {entry.prize}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Список призів з правої сторони */}
      <div style={{ width: '250px', padding: '20px', borderLeft: '2px solid #4CAF50', textAlign: 'left' }}>
        <h3>Доступні призи</h3>
        <ul>
          {prizes.map((prize, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              {prize.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
