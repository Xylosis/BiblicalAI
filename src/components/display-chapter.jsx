import React, { useEffect } from 'react';

const ScriptureComponent = ({ scriptureHtml }) => {
    useEffect(() => {
        // Function to handle span clicks
        const handleVerseClick = (event) => {
            const verseText = event.target.textContent;
            const verseNumber = event.target.getAttribute("id");
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
