import { useState, useEffect } from 'react';

export default function Home() {
  const [canSpin, setCanSpin] = useState(true);
  const [prize, setPrize] = useState('');
  const [history, setHistory] = useState([]);
  const [timer, setTimer] = useState(0);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isNameEntered, setIsNameEntered] = useState(false);

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
        setCanSpin(true);
      } else {
        setCanSpin(false);
        const countdown = Math.ceil((oneWeek - (now - lastSpin)) / 1000);
        setTimer(countdown);
        const timerInterval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timerInterval);
              setCanSpin(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timerInterval);
      }
    }
  }, []);

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

    const wonPrize = getPrize();
    setPrize(wonPrize);
    setCanSpin(false);
    setIsNameEntered(true);
    localStorage.setItem('lastSpinDate', new Date().toISOString());
  };

  const handleNameSubmit = () => {
    if (userName.trim() === '') {
      alert('Будь ласка, введіть своє ім\'я');
      return;
    }

    const newHistory = [...history, { date: new Date().toLocaleString(), prize: prize, name: userName }];
    setHistory(newHistory);
    localStorage.setItem('prizeData', JSON.stringify(newHistory));

    // Відправка даних до Google Sheets
    submitToGoogleSheets(userName, prize);

    setIsNameEntered(false);
    setUserName('');
  };

  const submitToGoogleSheets = (userName, userPrize) => {
    const formData = new FormData();
    formData.append('entry.137027142', userName); // Поле для імені
    formData.append('entry.1207358390', userPrize); // Поле для призу (автоматично заповнюється)
    formData.append('entry.832919116', userEmail); // Поле для email

    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdGt0Nejdhx34LAoLWMW66l4B_46_zWEif85PZxqceHYBf6Tw/formResponse'; // Ваш URL форми

    fetch(formUrl, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.text())
      .then(data => {
        console.log('Дані успішно відправлено до Google Sheets');
        alert('Дякуємо за участь! Ваші дані збережено.');
      })
      .catch(error => {
        console.error('Помилка відправки даних до Google Sheets:', error);
        alert('Сталася помилка при відправці даних.');
      });
  };

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const remainingSeconds = seconds % 60;

    return `${days > 0 ? `${days} днів ` : ''}${hours > 0 ? `${hours} годин ` : ''}${minutes > 0 ? `${minutes} хвилин ` : ''}${remainingSeconds} секунд`;
  };

  return (
    <div>
      <h1>Крутимо Колесо Фортуни!</h1>
      {/* Ваш компонент з колесом та іншими елементами */}
      {isNameEntered && (
        <div>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Введіть своє ім'я"
          />
          <button onClick={handleNameSubmit}>Підтвердити</button>
        </div>
      )}
      {/* Історія виграшів */}
      <div>
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
  );
}
