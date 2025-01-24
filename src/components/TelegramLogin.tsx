import React, { useEffect } from 'react';


interface TelegramLoginProps {
  onAuth: (userData: any) => void; // Callback to pass user data to the parent
  onError: (error: string) => void; // Callback to handle errors
}

const TelegramLogin: React.FC<TelegramLoginProps> = ({ onAuth, onError }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', 'TmaAuthBot'); // Replace with your bot username
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', '/api/telegram'); // Endpoint to handle authentication
    script.setAttribute('data-request-access', 'write');

    const container = document.getElementById('telegram-login-container');
    if (container) {
      container.appendChild(script);
    }

    return () => {
      // Clean up the script when the component unmounts
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, [onAuth, onError]);

  return <div id="telegram-login-container"></div>;
};

export default TelegramLogin;
