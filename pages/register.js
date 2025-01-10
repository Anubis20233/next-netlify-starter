import { useState, useEffect } from 'react';

export default function Home() {
  const [canSpin, setCanSpin] = useState(true);
  const [prize, setPrize] = useState('');
  const [history, setHistory] = useState([]);

  // Призи та їх відсотки
  const prizes = [
    { name: 'VIP premium на 2 тижня', percentage: 10 },
    { name: 'VIP premium на 1 тиждень', percentage: 10 },
    { name: 'VIP premium на 3 дні', percentage: 10 },
    { name: 'VIP free на 3 тижня', percentage: 12 },
    { name: 'Prefix на 7 днів', percentage: 12 },
    { name: 'Medic на 4 дні', percentage: 11 },
    { name: 'Повезе у наступний раз', percentage: 13 },
    { name: 'VIP Fri на 3 тижня', percentage: 13 },
    { name: 'VIP fri на 2 тижня', percentage: 13 },
    { name: 'VIP fri на 1 тиждень', percentage: 13 },
    { name: 'VIP fri на 5 днів', percentage: 13 },
    { name: 'VIP Fri на 3 дні', percentage: 13 },
    { name: 'Імунітет на AWP на 3 дні', percentage: 11 },
  ];

  useEffect(() => {
    const lastSpinDate = localStorage.getItem('lastSpinDate');
    const spinHistory = JSON.parse(localStorage.getItem('spinHistory')) || [];
    setHistory(spinHistory);

    if (lastSpinDate) {
      const lastSpin = new Date(lastSpinDate);
      const now = new Date();
      const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 днів у мілісекундах
      setCanSpin(now - lastSpin >= oneWeek);
    }
  }, []);

  // Функція для вибору призу з урахуванням відсотків
  const getPrize = () => {
    const random = Math.random() * 100; // Випадкове число від 0 до 100
    let cumulativePercentage = 0;

    for (const prize of prizes) {
      cumulativePercentage += prize.percentage;
      if (random <= cumulativePercentage) {
        return prize.name;
      }
    }

    return prizes[0].name; // Якщо раптом жоден приз не був вибраний, повертаємо перший
  };

  const spinWheel = () => {
    if (!canSpin) return;

    const rotation = Math.floor(360 * (Math.random() + 3)); // Випадковий кут з 3 обертами
    const wonPrize = getPrize(); // Отримуємо приз з урахуванням відсотків

    // Збереження обертання
    const newHistory = [...history, { date: new Date().toLocaleString(), prize: wonPrize }];
    setHistory(newHistory);
    localStorage.setItem('spinHistory', JSON.stringify(newHistory));
    localStorage.setItem('lastSpinDate', new Date().toISOString());
    setPrize(wonPrize);
    setCanSpin(false);

    // Застосування обертання до колеса
    const wheel = document.getElementById("wheel");
    wheel.style.transform = `rotate(${rotation}deg)`;
  };

  return (
    <div style={{ textAlign: 'center', margin: '30px' }}>
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px', // Менший шрифт для призів, щоб вони вмістились
              padding: '5px',
              textAlign: 'center',
              overflow: 'hidden', // щоб текст не вилазив за межі
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
        {!canSpin ? 'Наступне обертання буде доступне через 7 днів.' : ''}
      </p>
      <p id="prize" style={{ marginTop: '20px', fontSize: '24px', color: '#f39c12' }}>
        {prize ? `Ви виграли: ${prize}` : ''}
      </p>

      <div id="availablePrizes" style={{ marginTop: '30px', textAlign: 'left', paddingLeft: '20px' }}>
        <h3>Доступні призи</h3>
        <ul style={{ padding: '0' }}>
          {prizes.map((prize, index) => (
            <li key={index} style={{ fontSize: '18px', marginBottom: '8px' }}>
              <strong>{prize.name}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div id="history" style={{ marginTop: '30px', textAlign: 'left' }}>
        <h3>Історія призів</h3>
        {history.length === 0 ? (
          <p>Поки що обертання відсутні.</p>
        ) : (
          history.map((spin, index) => (
            <p key={index}>
              {index + 1}. {spin.date} - {spin.prize}
            </p>
          ))
        )}
      </div>
    </div>
  );
}
