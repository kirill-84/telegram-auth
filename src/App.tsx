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

  // Retrieve user data from session storage on component mount
  useEffect(() => {
    const authData = sessionStorage.getItem('telegramAuthData');
    if (authData) {
      setUserData(JSON.parse(authData)); // Set the user data from session storage
      sessionStorage.removeItem('telegramAuthData'); // Clear the data from session storage
    }
  }, []);

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
        <div>
          <h3>User Info:</h3>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
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
      <h1>Vite + React</h1>
      <p className="local">{import.meta.env.VITE_API_KEY ?? "local var is empty"}</p>
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
  );
}

export default App;
