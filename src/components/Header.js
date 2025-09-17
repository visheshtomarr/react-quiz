import { useState, useEffect } from 'react';

function Header() {
  const [clientIP, setClientIP] = useState('Loading...');

  useEffect(() => {
    // Use a public IP lookup service
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setClientIP(data.ip))
      .catch(error => {
        console.error('Error fetching IP:', error);
        setClientIP('Not available');
      });
  }, []);

  return (
    <header className='app-header'>
      <img src='logo512.png' alt='React logo' />
      <h1>The React Quiz V5</h1>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>Server IP: {clientIP}</p>
    </header>
  );
}

export default Header;