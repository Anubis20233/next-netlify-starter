import { useState, useEffect } from 'react';

export default function Home() {
  const [canSpin, setCanSpin] = useState(true);
  const [prize, setPrize] = useState('');
  const [timer, setTimer] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [userPrize, setUserPrize] = useState('');

  const prizes = [
    'VIP premium на 2 тижня',
    'VIP premium на 1 тиждень',
    'VIP premium на 3 дні',
    'VIP free на 3 тижня',
    'Prefix на 7 днів',
    'Medic на 4 дні',
    'Повезе у наступний раз',
    'VIP Fri на 3 тижня',
    'VIP fri на 2 тижня',
    'VIP fri на 1 тиждень',
    'VIP fri на 5 днів',
    'VIP Fri на 3 дні',
    'Імунітет на AWP на 3 дні',
  ];

  // Отримуємо випадковий приз
  const getPrize = () => {
    const randomIndex = Math.floor(Math.random() * prizes.length);
    return prizes[randomIndex];
  };

  const spinWheel = () => {
    if (!canSpin) return;

    const wonPrize = getPrize();
    setPrize(wonPrize);
    setUserPrize(wonPrize);
    setCanSpin(false);
    setIsFormVisible(true); // Показуємо форму після виграшу
  };

  const formLink = `https://docs.google.com/forms/d/e/1FAIpQLSeXoVJUuiSXbR4_5y8L6_FsP4ndMBVa-SxpRkYLWq7In6Jk2Q/viewform?usp=header?entry.249957477=${encodeURIComponent(userPrize)}&entry.1597821656=${encodeURIComponent(userName)}&entry.210889611=${encodeURIComponent(userEmail)}`;


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
            }}
          >
            {prize}
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
      <p id="prize" style={{ marginTop: '20px', fontSize: '24px', color: '#f39c12' }}>
        {prize ? `Ви виграли: ${prize}` : ''}
      </p>

      {/* Модальне вікно для форми */}
      {isFormVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              width: '400px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h3>Заповніть форму для отримання призу</h3>
            <p>
              Для отримання вашого виграного призу, будь ласка, заповніть
              форму: <a href={formLink} target="_blank" rel="noopener noreferrer">Заповнити форму</a>
            </p>
            <button
              onClick={() => setIsFormVisible(false)}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
