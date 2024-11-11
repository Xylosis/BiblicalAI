import React, { useEffect } from 'react';
import './popup-form.css'

function PopupForm( {religionPreference, setReligionPreference, popupIsOpen, setPopUpIsOpen} ) {
  //const [popupIsOpen, setPopUpIsOpen] = useState(false);

  useEffect(() => {
    // Show the popup after a short delay
    const timeout = setTimeout(() => {
      setPopUpIsOpen(true);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    setPopUpIsOpen(false);
  };

  const handleOptionChange = (event) => {
    setReligionPreference(event.target.value);
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setPopUpIsOpen(false);
    console.log("You selected", religionPreference);
  }

  return (
    <div className={`popup ${popupIsOpen ? 'open' : ''}`}>
      <div id="popupContent" className="popup-content">
        <button id="formButton" onClick={handleClose}>✖</button>
        <p id="popupHeader ">Select which religion you'd like Biblical AI to focus it's explanations on.</p>
        <form id="popupForm" onSubmit={handleFormSubmit}>
            <input type="radio" id="Christian" name="Christian" value="Christian" checked={religionPreference === "Christian"} onChange={handleOptionChange} />
            <label for="Christian">Christian</label>
            <input type="radio" id="Catholic" name="Catholic" value="Catholic" checked={religionPreference === "Catholic"} onChange={handleOptionChange} />
            <label for="Catholic">Catholic</label>
            <input type="radio" id="Jewish" name="Jewish" value="Jewish" checked={religionPreference === "Jewish"} onChange={handleOptionChange} />
            <label for="Jewish">Jewish</label>
            <input type="radio" id="Islamic" name="Islamic" value="Islamic" checked={religionPreference === "Islamic"} onChange={handleOptionChange} />
            <label for="Islamic">Islamic</label>
            <input type="radio" id="Gnostic" name="Gnostic" value="Gnostic" checked={religionPreference === "Gnostic"} onChange={handleOptionChange} />
            <label for="Gnostic">Gnostic</label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default PopupForm;