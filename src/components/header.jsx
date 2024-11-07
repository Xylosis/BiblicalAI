import React from 'react';
import logo from '../imgs/bible-earth.png'

function Header() {
  return (
    <header style={styles.header}>
      {/* Home Page Link with Image */}
      <a href="/" style={styles.logoLink}>
        <img
          src={logo}
          alt="Home"
          style={styles.logo}
        />
      </a>

      {/* Centered Text */}
      <h1 style={styles.title}>Biblical AI</h1>

    </header>
  );
}

// Basic styles
const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: '#000',
    color: '#fff',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logo: {
    height: '60px',
    width: 'auto',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: '1.5rem',
    paddingRight: '4.5rem',
  },
  signature: {
    textAlign: 'right',
    fontSize: '1.5rem',
  }
};

export default Header;