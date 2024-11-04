import React, { useEffect } from 'react';

const ScriptureComponent = ({ scriptureHtml}) => {
    useEffect(() => {
        // Function to handle span clicks
        const handleVerseClick = (event) => {

            function isCharacterNumber(char) {
                return !isNaN(parseInt(char, 10));
              }
              
            const text = event.target.textContent;
            const verseNumber = (isCharacterNumber(text[0]) && isCharacterNumber(text[1])) ? `${text[0]}${text[1]}` : `${text[0]}`;
            const verseText = text.slice(verseNumber.length);

            console.log(`Clicked verse: ${verseNumber} - ${verseText}`);
        };
    
        // Select all span elements with the class 'v' and add event listeners
        const verseElements = document.querySelectorAll("span.q");
        verseElements.forEach((span) => {
            span.addEventListener("click", handleVerseClick);
        });
    
        // Clean up event listeners on component unmount
        return () => {
            verseElements.forEach((span) => {
            span.removeEventListener("click", handleVerseClick);
            });
        };
    }, [scriptureHtml]);
      

  return (
    <div
      id="scripture-container"
      className="scripture-styles"
      dangerouslySetInnerHTML={{ __html: scriptureHtml }}
    ></div>
  );
};

export default ScriptureComponent;
