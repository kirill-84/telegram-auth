// src/components/TelegramLogin.tsx
import React, { useEffect } from 'react';

interface TelegramLoginProps {
  onAuthSuccess: (user: any) => void; // Функция для передачи данных в App
}

const TelegramLogin: React.FC<TelegramLoginProps> = ({ onAuthSuccess }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.async = true;
        script.setAttribute('data-telegram-login', 'TmaAuthBot');
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-auth-url', '/api/telegram');
        script.setAttribute('data-request-access', 'write');
        script.setAttribute('data-user-info', 'onTelegramAuth(user)');
        window.onTelegramAuth = (user: any) => {
            console.log('Auth Success:', user);
            onAuthSuccess(user); // Передача данных в родительский компонент
        };
        document.getElementById('telegram-login-container')?.appendChild(script);
    }, [onAuthSuccess]);

    return <div id="telegram-login-container"></div>;
};

export default TelegramLogin;
