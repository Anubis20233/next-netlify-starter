import { useState, useEffect } from 'react';

export default function Home() {
  const [canSpin, setCanSpin] = useState(true); // Можна чи не можна крутити колесо
  const [prize, setPrize] = useState(''); // Виграний приз
  const [history, setHistory] = useState([]); // Історія обертів
  const [timer, setTimer] = useState(0); // Таймер на наступне обертання
  const [isFormVisible, setIsFormVisible] = useState(false); // Чи відображати форму
  const [userName, setUserName] = useState(''); // Ім'я користувача
  const [userEmail, setUserEmail] = useState(''); // Емейл користувача
  const [userPrize, setUserPrize] = useState(''); // Виграний приз, який буде переданий у форму

  // Призи
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

  // Зчитуємо збережену історію обертів та перевіряємо час для наступного спіну
  useEffect(() => {
    const lastSpinDate = localStorage.getItem('lastSpinDate');
    const spinHistory = JSON.parse(localStorage.getItem('spinHistory')) || [];
    setHistory(spinHistory);

    if (lastSpinDate) {
      const lastSpin = new Date(lastSpinDate);
      const now = new Date();
      const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 днів у мілісекундах
      setCanSpin(now - lastSpin >= oneWeek); // Визначаємо, чи можна крутити

      if (now - lastSpin < oneWeek) {
        const countdown = Math.ceil((oneWeek - (now - lastSpin)) / 1000); // Час до наступного спіну
        setTimer(countdown);

        // Запускаємо таймер
        const timerInterval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timerInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000); // Оновлюємо кожну секунду
        return () => clearInterval(timerInterval); // Очищаємо інтервал при скасуванні компонента
      }
    }
  }, []);

  // Функція для вибору випадкового призу
  const getPrize = () => {
    const randomIndex = Math.floor(Math.random() * prizes.length);
    return prizes[randomIndex];
  };

  // Функція для спіну колеса
  const spinWheel = () => {
    if (!canSpin) return; // Якщо не можна крутити, нічого не робимо

    const rotation = Math.floor(360 * (Math.random() + 3)); // Випадковий кут для обертання
    const wonPrize = getPrize(); // Отримуємо приз

    // Оновлюємо історію обертів
    const newHistory = [...history, { date: new Date().toLocaleString(), prize: wonPrize }];
    setHistory(newHistory);
    localStorage.setItem('spinHistory', JSON.stringify(newHistory));
    localStorage.setItem('lastSpinDate', new Date().toISOString());
    setPrize(wonPrize);
    setCanSpin(false); // Вимикаємо можливість спіну
    setUserPrize(wonPrize); // Зберігаємо виграний приз
    setIsFormVisible(true); // Показуємо форму
  };

  // Функція для відправки форми
  const submitForm = (e) => {
    e.preventDefault(); // Запобігаємо перезавантаженню сторінки
    if (userName && userEmail && userPrize) {
      const userData = {
        name: userName,
        email: userEmail,
        prize: userPrize,
      };
      
      // Зберігаємо дані у localStorage
      const prizeData = JSON.parse(localStorage.getItem('prizeData')) || [];
      prizeData.push(userData);
      localStorage.setItem('prizeData', JSON.stringify(prizeData));

      // Очищаємо форму
      setIsFormVisible(false);
      setUserName('');
      setUserEmail('');
      setUserPrize('');
      alert('Ваші дані успішно збережено!');
    } else {
      alert('Будь ласка, заповніть всі поля!');
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '30px' }}>
      <h1>Крутимо Колесо Фортуни!</h1>

      {/* Відображення колеса */}
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

      {/* Кнопка для спіну колеса */}
      <button
        id="spinButton"
        onClick={spinWheel}
        disabled={!canSpin}
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        {canSpin ? 'Прокрутити колесо' : 'Недоступно'}
      </button>

      {/* Повідомлення про доступність спіну */}
      <p id="message" style={{ marginTop: '10px', color: 'red' }}>
        {!canSpin ? `Наступне обертання буде доступне через ${Math.floor(timer / 60)} хвилин ${timer % 60} секунд.` : ''}
      </p>

      {/* Повідомлення про виграний приз */}
      <p id="prize" style={{ marginTop: '20px', fontSize: '24px', color: '#f39c12' }}>
        {prize ? `Ви виграли: ${prize}` : ''}
      </p>

      {/* Історія обертів */}
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

      {/* Форма для введення даних користувача */}
      {isFormVisible && (
        <div style={{ marginTop: '30px' }}>
          <h3>Заповніть форму</h3>
          <form onSubmit={submitForm}>
            <input
              type="text"
              placeholder="Ваше ім'я"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Ваш емейл"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Виграний приз"
              value={userPrize}
              readOnly // Приз не можна змінювати
            />
            <button type="submit">Відправити</button>
          </form>
        </div>
      )}
    </div>
  );
}

