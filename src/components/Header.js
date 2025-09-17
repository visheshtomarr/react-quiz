import { useState, useEffect } from 'react';

function Header() {
  const [serverIdentity, setServerIdentity] = useState('Loading...');

  useEffect(() => {
    async function fetchServer() {
      try {
        // add timestamp to avoid caches
        const res = await fetch(`/instance-info?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('No instance info');
        const text = await res.text();
        setServerIdentity(text);
      } catch (err) {
        console.error(err);
        setServerIdentity('Not available');
      }
    }
    fetchServer();
  }, []);

  return (
    <header className='app-header'>
      <img src='logo512.png' alt='React logo' />
      <h1>The React Quiz V5</h1>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>Server: {serverIdentity}</p>
    </header>
  );
}

export default Header;