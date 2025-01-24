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
    script.onload = () => {
      (window as any).TelegramLoginWidget = {
        onAuth: (user: any) => {
          // Send the user data to your API for verification
          fetch('/api/telegram', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                // Pass the user data to the parent component
                onAuth(data.authData);
              } else {
                onError(data.message || 'Authentication failed');
              }
            })
            .catch((err) => {
              onError('Error during authentication');
              console.error(err);
            });
        },
      };
    };
    document.getElementById('telegram-login-container')?.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [onAuth, onError]);

  return <div id="telegram-login-container"></div>;
};

export default TelegramLogin;
