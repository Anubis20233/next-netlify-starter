<!DOCTYPE html>  
<html lang="uk">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <title>Колесо Фортуни</title>  
    <style>  
        body {  
            font-family: Arial, sans-serif;  
            text-align: center;  
            margin: 30px;  
        }  
        #wheel {  
            width: 300px;  
            height: 300px;  
            border: 10px solid #4CAF50;  
            border-radius: 50%;  
            display: flex;  
            align-items: center;  
            justify-content: center;  
            position: relative;  
            transition: transform 4s cubic-bezier(0.33, 1, 0.68, 1);  
        }  
        .slice {  
            position: absolute;  
            width: 50%;  
            height: 50%;  
            background-color: #f39c12;  
            border: 1px solid #fff;  
            clip-path: polygon(100% 100%, 0 100%, 100% 0);  
        }  
        #spinButton {  
            margin-top: 20px;  
            padding: 10px 20px;  
            font-size: 16px;  
            cursor: pointer;  
        }  
        #prize {  
            margin-top: 20px;  
            font-size: 24px;  
            color: #f39c12;  
        }  
        #message {  
            margin-top: 10px;  
            color: red;  
        }  
        #history {  
            margin-top: 30px;  
            text-align: left;  
        }  
    </style>  
</head>  
<body>  

    <h1>Крутимо Колесо Фортуни!</h1>  
    <div id="wheel">  
        <div class="slice" style="transform: rotate(0deg);">VIP premium на 2 тижня</div>  
        <div class="slice" style="transform: rotate(60deg);">VIP premium на 1 тиждень</div>  
        <div class="slice" style="transform: rotate(120deg);">VIP premium на 3 дня </div>  
        <div class="slice" style="transform: rotate(180deg);">VIP free на 3 тижня </div>  
        <div class="slice" style="transform: rotate(240deg);">Prefix на 7 днів </div>  
        <div class="slice" style="transform: rotate(300deg);">Medic на 4 днів </div>  
    </div>  
    <button id="spinButton">Прокрутити колесо</button>  
    <p id="message"></p>  
    <p id="prize"></p>  
    <div id="history"></div>  

    <script>  
        const wheel = document.getElementById('wheel');  
        const spinButton = document.getElementById('spinButton');  
        const message = document.getElementById('message');  
        const prizeDisplay = document.getElementById('prize');  
        const historyDisplay = document.getElementById('history');  
        const prizes = [  
            "VIP premium на 2 тижня",  
            "VIP premium на 1 тиждень",  
            "VIP premiumна 3 дня",  
            "VIP free на 3 тижня",  
            "Prefix на 7 днів",  
            "Medic на 4 днів"  
        ];  

        // Отримуємо дату останнього обертання з localStorage  
        let lastSpinDate = localStorage.getItem('lastSpinDate');  
        let spinHistory = JSON.parse(localStorage.getItem('spinHistory')) || [];  

        function canSpin() {  
            if (!lastSpinDate) return true; // Дозволяємо обертання, якщо немає збереженої дати  

            const lastSpin = new Date(lastSpinDate);  
            const now = new Date();  
            const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 днів у мілісекундах  
            return (now - lastSpin) >= oneWeek; // Повертаємо true, якщо 7 днів пройшло  
        }  

        function displayHistory() {  
            historyDisplay.innerHTML = '<h3>Історія призів</h3>';  
            if (spinHistory.length === 0) {  
                historyDisplay.innerHTML += '<p>Поки що обертання відсутні.</p>';  
                return;  
            }  
            spinHistory.forEach((spin, index) => {  
                historyDisplay.innerHTML += `<p>${index + 1}. ${spin.date} - ${spin.prize}</p>`;  
            });  
        }  

        function updateSpinButtonState() {  
            if (canSpin()) {  
                spinButton.disabled = false; // Дозволено обертання  
                message.textContent = '';  
            } else {  
                const nextSpinDate = new Date(new Date(lastSpinDate).getTime() + 7 * 24 * 60 * 60 * 1000);  
                message.textContent = `Наступне обертання можливе з ${nextSpinDate.toLocaleDateString()}`;  
                spinButton.disabled = true; // Заборонити обертання  
            }  
        }  

        spinButton.addEventListener('click', () => {  
            if (!canSpin()) return; // Якщо обертання заборонено, нічого не робимо  

            // Записуємо нову дату обертання  
            lastSpinDate = new Date().toISOString();  
            localStorage.setItem('lastSpinDate', lastSpinDate);  
            message.textContent = 'Ви прокрутили колесо!';  

            // Генеруємо випадковий кут обертання  
            const rotation = Math.floor(360 * (Math.random() + 3)); // Випадковий кут з 3 оборотами  
            wheel.style.transform = `rotate(${rotation}deg)`;  

            // Визначаємо приз через 4 секунди  
            setTimeout(() => {  
                const prizeIndex = Math.floor(((rotation % 360) / 60) % prizes.length);  
                const prize = prizes[prizeIndex];  
                prizeDisplay.textContent = `Ви виграли: ${prize}`;  

                // Зберігаємо обертання в історії  
                spinHistory.push({ date: new Date().toLocaleString(), prize });  
                localStorage.setItem('spinHistory', JSON.stringify(spinHistory));  
                displayHistory();  
                updateSpinButtonState(); // Оновлюємо стан кнопки  
            }, 4000);  
        });  

        // Перевіряємо можливість обертання при завантаженні сторінки  
        displayHistory();  
        updateSpinButtonState(); // Змінюємо стан кнопки на початку  

    </script>  

</body>  
</html>
