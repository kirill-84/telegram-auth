// src/components/TelegramLogin.tsx
import React, { useEffect, useState } from 'react';

const TelegramLogin: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', 'TmaAuthBot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', '/api/telegram');
    script.setAttribute('data-request-access', 'write');
    document.getElementById('telegram-login-container')?.appendChild(script);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/telegram');
      console.log('API response:', response);
      
      /*if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      console.log('Data:', data);
      setUserData(data);  // Сохранение полученных данных*/
      console.log('Data:', response.json());
    } catch (err) {
      setError('Error fetching user data');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserData();  // Вызов функции для получения данных
  }, []);

  return (
    <div>
      <div id="telegram-login-container"></div>
      {error && <p>{error}</p>}
      {userData ? (
        <div>
          <h3>User Info:</h3>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default TelegramLogin;
