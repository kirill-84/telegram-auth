// src/components/TelegramLogin.tsx
import React from 'react';

const TelegramLogin: React.FC = () => {
    return (
        <div>
            <script
                async
                src="https://telegram.org/js/telegram-widget.js?22"
                data-telegram-login="TmaAuthBot"
                data-size="large"
                data-auth-url="/api/telegram"
                data-request-access="write"
            ></script>
        </div>
    )
};


export default TelegramLogin;