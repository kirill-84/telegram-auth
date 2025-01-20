// src/components/TelegramLogin.tsx
import React, { useEffect, useState } from 'react';

const TelegramLogin: React.FC = () => {
  const [userData, setUserData] = useState<any>(null); // Для хранения данных пользователя
  const [error, setError] = useState<string | null>(null); // Для хранения ошибки, если авторизация не удалась

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', 'TmaAuthBot'); // Ваш бот
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', '/api/telegram'); // Ваш API для авторизации
    script.setAttribute('data-request-access', 'write');
    document.getElementById('telegram-login-container')?.appendChild(script);
  }, []);

  useEffect(() => {
  // Получаем данные пользователя после успешной авторизации  
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/telegram'); // Запрос на ваш API
      console.log('API response:', response); // Логирование ответа от API

      // Проверка, если ответ не OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        setError('Failed to fetch user data');
        return;
      }

      const data = await response.json();
      console.log('Parsed data:', data); // Логирование разобранных данных

      if (data.success) {
        setUserData(data.authData); // Устанавливаем данные пользователя в состояние
      } else {
        setError('Authentication failed'); // Если аутентификация не удалась
      }
    } catch (err) {
      setError('An error occurred while fetching user data');
      console.error('Fetch error:', err); // Логирование ошибки при fetch
    }
  };

  fetchUserData();
}, []);
  
  return (
    <div>
      <div id="telegram-login-container"></div> {/* Вставка виджета Telegram */}

      {userData ? (
        <div>
          <h3>Welcome {userData.first_name} {userData.last_name}</h3>
          <p>Username: {userData.username}</p>
          <p>Telegram ID: {userData.id}</p>
          <p>Language: {userData.language_code}</p>
          {/* Вывод других данных пользователя, если нужно */}
        </div>
      ) : error ? (
        <p>{error}</p> // Отображаем ошибку, если она возникла
      ) : (
        <p>Loading...</p> // Пока идет загрузка данных
      )}
    </div>
  );
};

export default TelegramLogin;
