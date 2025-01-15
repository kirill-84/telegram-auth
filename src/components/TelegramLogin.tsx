// src/components/TelegramLogin.tsx
import React, { useEffect } from 'react';

const TelegramLogin: React.FC = () => {
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

    return <div id="telegram-login-container"></div>;
};

export default TelegramLogin;
