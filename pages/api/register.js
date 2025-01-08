export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    // Валідація даних (додайте більше перевірок за потреби)
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Всі поля обов’язкові.' });
    }

    // Імітація успішної реєстрації
    return res.status(200).json({ message: 'Реєстрація успішна!' });

    // Реальна логіка додавання користувача до бази даних може бути тут
    // Наприклад, підключення до MongoDB, Firebase або іншого сервісу.
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Метод ${req.method} не дозволений`);
  }
}
