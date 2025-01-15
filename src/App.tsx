import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TelegramLogin from "./components/TelegramLogin.tsx";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState<TelegramUser | null>(null);

    const handleAuthSuccess = (userData: TelegramUser) => {
        setUser(userData); // Сохраняем данные пользователя в состоянии
    };
  
  return (
    <>
      <TelegramLogin />
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      {!user ? (
                <TelegramLogin onAuthSuccess={handleAuthSuccess} />
            ) : (
                <div>
                    <h2>Welcome, {user.first_name}!</h2>
                    {user.photo_url && (
                        <img src={user.photo_url} alt={`${user.first_name}'s avatar`} />
                    )}
                    <p>ID: {user.id}</p>
                    <p>First name: {user.first_name}</p>
                    {user.last_name && <p>Last name: {user.last_name}</p>}
                    {user.username && <p>Username: @{user.username}</p>}
                </div>
            )}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
