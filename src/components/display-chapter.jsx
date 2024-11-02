import React, { useEffect } from 'react';

const ScriptureComponent = ({ scriptureHtml }) => {
    useEffect(() => {
        const container = document.getElementById("scripture-container");
      
        const wrapVersesAndText = () => {
          // Find all span.v elements in the container
          const verseSpans = container.querySelectorAll(".v");
          verseSpans.forEach((verseSpan) => {
            console.log(verseSpan.nextElementSibling);
            // Create a new span wrapper for the verse and its adjacent text
            const wrapper = document.createElement("span");
            wrapper.classList.add("verse-wrapper"); // Add class for potential styling
      
            // Insert the wrapper before the verseSpan
            verseSpan.parentNode.insertBefore(wrapper, verseSpan);
      
            // Move the verseSpan and its next sibling (text node) into the wrapper
            wrapper.appendChild(verseSpan);
            let sibling = verseSpan.nextSibling;
            while (sibling && sibling.nodeType === Node.TEXT_NODE) {
              wrapper.appendChild(sibling);
              sibling = wrapper.nextSibling;
            }
      
            // Add the click event listener to the new wrapper
            wrapper.addEventListener("click", () => {
              const verseText = wrapper.textContent;
              console.log(`Clicked verse text: ${verseText}`);
            });
          });
        };
      
        wrapVersesAndText();
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
