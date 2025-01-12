import { useState, useEffect } from 'react';

export default function Home() {
  const [canSpin, setCanSpin] = useState(true);
  const [prize, setPrize] = useState('');
  const [history, setHistory] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);  
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
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

  useEffect(() => {
    const prizeData = JSON.parse(localStorage.getItem('prizeData')) || [];
    setHistory(prizeData);

    const lastSpinDate = localStorage.getItem('lastSpinDate');
    if (lastSpinDate) {
      const lastSpin = new Date(lastSpinDate);
      const now = new Date();
      const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 днів
      setCanSpin(now - lastSpin >= oneWeek);

      if (now - lastSpin < oneWeek) {
        const countdown = Math.ceil((oneWeek - (now - lastSpin)) / 1000);
        setTimer(countdown);
        const timerInterval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timerInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timerInterval);
      }
    }
  }, []);

  const getPrize = () => prizes[Math.floor(Math.random() * prizes.length)];

  const spinWheel = () => {
    if (!canSpin) return;

    const wonPrize = getPrize();
    const newHistory = [...history, { date: new Date().toLocaleString(), prize: wonPrize }];
    setHistory(newHistory);
    localStorage.setItem('prizeData', JSON.stringify(newHistory));
    localStorage.setItem('lastSpinDate', new Date().toISOString());
    setPrize(wonPrize);
    setCanSpin(false);
    setUserPrize(wonPrize);
    setIsFormVisible(true);
  };

  const submitForm = (e) => {
    e.preventDefault(); // Забороняє стандартну поведінку форми, щоб не відправляти її автоматично.

    if (userName && userEmail && userPrize) {
      // Перевірка на коректність email
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailPattern.test(userEmail)) {
        alert('Будь ласка, введіть дійсну електронну адресу');
        return;
      }

      // Логування даних перед відправкою
      console.log('Дані для відправки:', {
        name: userName,
        email: userEmail,
        prize: userPrize,
      });

      // Створення об'єкта FormData для відправки через Google Form
      const formData = new FormData();
      formData.append('entry.210889611', userName); // ID поля "Ім'я"
      formData.append('entry.2127313793', userEmail); // ID поля "Email"
      formData.append('entry.249957477', userPrize); // ID поля "Приз"

      // Додаткове приховане поле
      formData.append('dlut', '1736695265301'); // Використовуємо значення для dlut

      const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeXoVJUuiSXbR4_5y8L6_FsP4ndMBVa-SxpRkYLWq7In6Jk2Q/formResponse';

      // Логування для fetch
      console.log('Відправка на URL:', formUrl);

      // Відправка даних на Google Form через fetch
      fetch(formUrl, {
        method: 'POST',
        body: formData,
      })
        .then(() => {
          alert('Дякуємо! Ваші дані надіслано.');
          setUserName('');
          setUserEmail('');
          setUserPrize('');
          setIsFormVisible(false);  // Закрити форму
        })
        .catch((error) => {
          console.error('Помилка відправки:', error);
          alert('Сталася помилка при відправці даних. Перевірте консоль для деталей.');
        });
    } else {
      alert('Будь ласка, заповніть всі поля!');
    }
  };

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const remainingSeconds = seconds % 60;

    return `${days > 0 ? `${days} днів ` : ''}${hours > 0 ? `${hours} годин ` : ''}${minutes > 0 ? `${minutes} хвилин ` : ''}${remainingSeconds} секунд`;
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
      <p id="message" style={{ marginTop: '10px', color: 'red' }}>
        {!canSpin
          ? `Наступне обертання буде доступне через ${formatTime(timer)}`
          : ''}
      </p>
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
            <form onSubmit={submitForm}>
              <input
                type="text"
                placeholder="Ваше Нік в грі"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <input
                type="email"
                placeholder="Ваш емейл"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <input
                type="text"
                placeholder="Виграний приз"
                value={userPrize}
                readOnly
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Відправити
              </button>
            </form>
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

      {/* Історія виграшів */}
      <div id="history" style={{ marginTop: '30px', textAlign: 'left' }}>
        <h3>Історія виграшів</h3>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>
              <strong>{entry.date}</strong>: {entry.prize}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
