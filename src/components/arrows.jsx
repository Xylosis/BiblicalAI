import React, { useState } from 'react';
import './ArrowButtons.css';

const ArrowButtons = ({ onLeftClick, onRightClick, aBackgroundColor }) => {
  const [leftActive, setLeftActive] = useState(false);
  const [rightActive, setRightActive] = useState(false);

  const handleLeftClick = () => {
    setLeftActive(true);
    onLeftClick();
    setTimeout(() => setLeftActive(false), 100); // 100ms delay before resetting
  };

  const handleRightClick = () => {
    setRightActive(true);
    onRightClick();
    setTimeout(() => setRightActive(false), 100); // 100ms delay before resetting
  };

  return (
    <div className="arrow-buttons">
      <button
        className={`arrow left-arrow ${leftActive ? 'active' : ''}`}
        onClick={handleLeftClick}
      >
        &#8592;
      </button>
      <button
        className={`arrow right-arrow ${rightActive ? 'active' : ''}`}
        onClick={handleRightClick}
      >
        &#8594;
      </button>
    </div>
  );
};

export default ArrowButtons;
