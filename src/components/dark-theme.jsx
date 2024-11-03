import React, { useState } from 'react';

function DarkThemeToggle() {
  const [darkTheme, setDarkTheme] = useState(false);

  // Toggle dark theme state
  const toggleTheme = () => setDarkTheme((prevTheme) => !prevTheme);

  return (
    <div style={{
      backgroundColor: darkTheme ? '#000' : '#fff',
      color: darkTheme ? '#fff' : '#000',
      minHeight: '100vh', // Ensure full background coverage
      padding: '20px',
      transition: 'background-color 0.3s, color 0.3s', // Smooth transition for theme change
    }}>
      <button
        onClick={toggleTheme}
        style={{
          backgroundColor: darkTheme ? '#444' : '#ddd',
          color: darkTheme ? '#fff' : '#000',
          border: 'none',
          padding: '10px 20px',
          cursor: 'pointer',
          borderRadius: '5px',
          fontSize: '16px',
          transition: 'background-color 0.3s, color 0.3s', // Smooth transition for button
        }}
      >
        {darkTheme ? 'Light Theme' : 'Dark Theme'}
      </button>
      
      {/* Example content */}
      <p>
        This is an example paragraph. The theme button above changes the page background and text color.
      </p>
    </div>
  );
}

export default DarkThemeToggle;
