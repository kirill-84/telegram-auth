import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import TelegramLogin from './components/TelegramLogin';
import { TelegramLoginProps } from './types'; // Import the interface

function copyText(entryText: any){
  navigator.clipboard.writeText(entryText);
}

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
      <h2>Vite + React + Telegram Login Widget</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        For inspiration: <span className="wallet">UQCT...ESYA</span> <svg onClick={() => copyText("UQCTmlmrH5rZfFN-kFsvFl0TwyF6OS5sp3QEn8nNWnW0ESYA")} className="inline-block cursor-pointer" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><title>Copy to clipboard</title>
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 16.5L19.5 4.5L18.75 3.75H9L8.25 4.5L8.25 7.5L5.25 7.5L4.5 8.25V20.25L5.25 21H15L15.75 20.25V17.25H18.75L19.5 16.5ZM15.75 15.75L15.75 8.25L15 7.5L9.75 7.5V5.25L18 5.25V15.75H15.75ZM6 9L14.25 9L14.25 19.5L6 19.5L6 9Z" fill="#080341"/>
</svg> | &hearts; Toncoin
      </p>
    </>
  );
}

export default App;
