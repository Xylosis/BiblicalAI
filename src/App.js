import React, { useState, useEffect } from 'react';
import './App.css';

import Header from './components/header';
import Selector from './components/book-verse-Selection';
import ScriptureComponent from './components/display-chapter';
import DarkThemeToggle from './components/dark-theme';

import bibleService from "./services/get-chapters";
import callGPT from './services/call-gpt';
import './scripture-styles.css';
import ArrowButtons from './components/arrows';
import icon from './imgs/chatbot-icon-2.png'

//https://reactbibleapp.vercel.app/

function App() {
  const [currBook, setCurrBook] = useState("Genesis");
  const [currBookId, setCurrBookId] = useState("GEN");
  const [currChapter, setCurrChapter] = useState("1");
  const [chapterText, setChapterText] = useState();
  const [booksList, setBooksList] = useState();
  const [chapterList, setChapterList] = useState();
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [gptResponse, setgptResponse] = useState("");
  const [currVerse, setCurrVerse] = useState("1");
  const [viewingChapterAnalysis, setViewingChapterAnalysis] = useState(false);

  const changeBackgroundColor = (newColor) => {
    setBackgroundColor(newColor);
  };

  useEffect(() => {
      document.body.style.backgroundColor = backgroundColor;
      if (backgroundColor === 'white') {
        document.body.style.color = 'black';
      } else {
        document.body.style.color = 'white';
      }
  }, [backgroundColor]);

  function handleBookChange(book, bookId) {
    setCurrChapter("1");
    setCurrBook(book);
    setCurrBookId(bookId);
  };

  function handleChapterChange(chapter) {
    setCurrChapter(chapter);
    console.log("CHANGING CHAPTER")
    const element = document.getElementById("chapterDropDown");
    element.value = chapter;
  };

  const handleLeftClick = async () => {
    console.log("Left arrow clicked");
    console.log(chapterList);
    if (currBookId === "GEN" && currChapter === "1"){
      console.log("Already at start of book");
    } else {
      const intChapter = parseInt(currChapter);
      if( intChapter > 1 ) {
        setCurrChapter(`${parseInt(intChapter - 1)}`);
      } else if (intChapter === 1 ) {
        for (let i = 0; i < booksList.length; i++) {
          if(booksList[i].id === currBookId) {
            setCurrBook(booksList[i-1].name);
            setCurrBookId(booksList[i-1].id);
            const data = await bibleService.getChapterCount(booksList[i-1].id);
            const chapterCount = data.data.slice(1);
            setCurrChapter(`${chapterCount.length}`);
          }
        }
      }
    }
  };

  const handleRightClick = () => {
    console.log("Right arrow clicked");
    console.log(booksList);
    if(currBookId === "REV" && currChapter === "22") {
      console.log("Already at end of book");
    } else {
      const intChapter = parseInt(currChapter);
      if (intChapter < chapterList.length) {
        setCurrChapter(`${intChapter + 1}`);
      } else {
        for (let i = 0; i < booksList.length; i++) {
          if(booksList[i].id === currBookId) {
            setCurrBook(booksList[i+1].name);
            setCurrBookId(booksList[i+1].id);
            setCurrChapter("1");
          }
        }
      }
    }
  };

  function fixChapterHtml (content) {
    //const reg = '<span data-number="[0-9]?[0-9]" data-sid="... [0-9]?[0-9]:[0-9]?[0-9]" class="v">[0-9]?[0-9]<\/span>.+?(?=<)';
    const reg = /<span data-number="\d+"[\s\S]*?(?=<span data-number="\d+"|<\/p>)/g;
    //let scriptureHtmlHolder = content.replaceAll("</span>", '</span><span class="q" id="$">'); OLD
    let scriptureHtmlHolder = content;//NEW
    // text = scriptureHtml.match(reg)[0];
    // scriptureHtml = scriptureHtml.replace(text, `${text}</span>`);
    let arr = [...scriptureHtmlHolder.matchAll(reg)];
    for (let i = 0; i < arr.length; i++) {
        let text = arr[i][0];
        scriptureHtmlHolder = scriptureHtmlHolder.replace(text, `<span class="q" id="${currBook} ${currChapter}:${i+1}">${text}</span>`); //TO GO OLD, REMOVE FRONT SPAN IN REPLACE
        //scriptureHtmlHolder = scriptureHtmlHolder.replace('id="$"', `id="${currBook}-${currChapter}:${i+1}"`);
    }
    return scriptureHtmlHolder;
  }

  useEffect( () => {
    async function chapterGetter() {
      const temp = await bibleService.getChapterContent(currBookId, currChapter);
      const fixedHtml = fixChapterHtml(temp.data.content);
      setChapterText(fixedHtml);
    }
    chapterGetter()

  }, [currChapter, currBook]);

  useEffect( () => {
    console.log("UPDATED GPT:", gptResponse);
  }, [gptResponse])

  const styles = {
    darkmodebutton: {
      marginTop : "10px",
      backgroundColor: backgroundColor === "white" ? "grey" : "white",
      color: backgroundColor === "white" ? "white" : "black",
      padding: "5px 20px",
      borderRadius: "10px",
    }
  }

  const callGPTChapter = async () => {
    setViewingChapterAnalysis(true);
    await callGPT.getOpenAICompletion(`${currBook} - ${currChapter}`, null, true)
    .then(data => setgptResponse(data.choices[0].message.content))
    .catch(error => console.error(error));
  }

  const removeContent = () => {
    setgptResponse("");
  }

  function toggleChat() {
    const chatContainer = document.getElementById("chatContainer");
    const toggleButton = document.getElementById('toggleButton');
    chatContainer.classList.toggle("active");
    if (chatContainer.classList.contains('active')) {
      console.log('The chat container is active.');
      toggleButton.textContent = '▼';
    } else {
      console.log('The chat container is not active.');
      toggleButton.textContent = '▲'
    }
  }  
  

  return (
    <div className="App">
      <Header />
      <button style={styles.darkmodebutton} onClick={() => changeBackgroundColor(backgroundColor === "white" ? '#333333' : 'white')}>{backgroundColor === "white" ? 'Dark Mode' : "Light Mode"}</button>

      <Selector currBookId={currBookId} currChapter={currChapter} onValueChange={handleBookChange} chapterNumber={handleChapterChange} setAppChaptersList={setChapterList} setAppBooksList={setBooksList}/>
      <span className="w" onClick={callGPTChapter}><headerText>{currBook} - {currChapter}</headerText></span>
      <ScriptureComponent scriptureHtml={chapterText} currBook={currBook} currChapter={currChapter} setGPT={setgptResponse} setVerse={setCurrVerse} setViewing={setViewingChapterAnalysis}/>
      <ArrowButtons onLeftClick={handleLeftClick} onRightClick={handleRightClick} />
      {/*gptResponse && <div id="GPT"><p id="gptText">ChatGPT Analysis of:<br />{`${currBook} ${currChapter}`}{viewingChapterAnalysis ? '' : `:${currVerse}`}<br /><br />{gptResponse}</p>
      <button onClick={removeContent} className="close-btn">×</button>
      </div>*/}
      <div id="chatContainer" class="chat-container">
        <div id="chatHeader" class="chat-header" onClick={toggleChat}>
          Biblical AI Bot
          <button id="toggleButton" class="close-btnn">−</button>
        </div>
        <div id="chatContent" class="chat-content">
        <img src={icon} alt="Bot Icon" class="bot-icon" />
        <p id="chattingText">Biblican AI Bot:</p>
        <p id="gptText"><strong>{`${currBook} ${currChapter}`}{viewingChapterAnalysis ? '' : `:${currVerse}`}</strong><br /><br /><p id="gptResponseText">{gptResponse}</p></p>
        </div>
      </div>
    </div>
  );
}

export default App;
