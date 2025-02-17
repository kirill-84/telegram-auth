import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import TelegramLogin from './components/TelegramLogin';
import { TelegramLoginProps } from './types'; // Import the interface 

function App() {
  const [count, setCount] = useState(0);
  const [userData, setUserData] = useState<any>(null); // State to store user data
  const [error, setError] = useState<string | null>(null); // State to store errors

  // Callback function to handle successful authentication
  const handleAuth: TelegramLoginProps['onAuth'] = (authData) => {
    setUserData(authData); // Set the user data
    setError(null); // Clear any previous errors
  };

  // Callback function to handle errors
  const handleError: TelegramLoginProps['onError'] = (errorMessage) => {
    setError(errorMessage); // Set the error message
    setUserData(null); // Clear any previous user data
  };

  return (
    <>
      {/* Display user data if authenticated */}
      {userData ? (
        <div className="user-info">
          <h3>User Info</h3>
          {userData.photo_url && (
            <img src={userData.photo_url} alt="Profile" className="profile-photo" />
          )}
          <p>ID: {userData.id}</p>
          <p>Name: {userData.first_name} {userData.last_name}</p>
          <p>Username: @{userData.username}</p>
        </div>
      ) : (
        // Display the Telegram login widget if not authenticated
        <div>
          <TelegramLogin onAuth={handleAuth} onError={handleError} />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Telegram Login Widget</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        For inspiration &hearts;: 0x1266a05165458ce7b2C120FB744887f40eca6d63
      </p>
    </>
  );
}

export default App;
