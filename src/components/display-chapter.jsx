import React, { useEffect } from 'react';

import callGpt from '../services/call-gpt';

const ScriptureComponent = ({ scriptureHtml, currBook, currChapter, setGPT, setVerse, setViewing, setChatStarted }) => {
    useEffect(() => {
        // Function to handle span clicks
        const handleVerseClick = async (event) => {
            setViewing(false);
            setGPT("");
            function isCharacterNumber(char) {
                return !isNaN(parseInt(char, 10));
              }
              
            const text = event.target.textContent;
            const verseNumber = (isCharacterNumber(text[0]) && isCharacterNumber(text[1])) ? `${text[0]}${text[1]}` : `${text[0]}`;
            setVerse(verseNumber);
            setChatStarted(true);
            const verseText = text.slice(verseNumber.length);
            const bookChapterFull = `${currBook} ${currChapter}:${verseNumber}`;
            console.log(`Clicked verse: ${bookChapterFull} - ${verseText}`);
            await callGpt.getOpenAICompletion(bookChapterFull, verseText, false)
            .then(data => setGPT(data.choices[0].message.content))
            .catch(error => console.error(error));

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
