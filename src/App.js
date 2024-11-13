import React, { useState, useEffect } from 'react';
import './App.css';

import Header from './components/header';
import Selector from './components/book-verse-Selection';
import ScriptureComponent from './components/display-chapter';
import { Riple } from "react-loading-indicators"
import PopupForm from './components/popup-form';

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
  const [chatStarted, setChatStarted] = useState(false);
  const [currVerse, setCurrVerse] = useState("1");
  const [viewingChapterAnalysis, setViewingChapterAnalysis] = useState(false);
  const [religionPreference, setReligionPreference] = useState("Christian");
  const [popupIsOpen, setPopUpIsOpen] = useState(false);
  const [chatIsOpen, setChatIsOpen] = useState(true);

  const changeBackgroundColor = (newColor) => {
    setBackgroundColor(newColor);
  };

  useEffect(() => {
      document.body.style.backgroundColor = backgroundColor;
      const popUp = document.getElementById("popupContent");
      if (backgroundColor === 'white') {
        document.body.style.color = 'black';
        popUp.style.backgroundColor = 'white'
      } else {
        document.body.style.color = 'white';
        popUp.style.backgroundColor = '#333333'
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
    if(!chatStarted && gptResponse ) {
      setChatStarted(true);
    }
    const chatContainer = document.getElementById("chatContainer");
    if(chatStarted && !chatContainer.classList.contains('active')) {
      console.log("TOGGLING");
      toggleChat();
    }
  }, [gptResponse])

  const styles = {
    darkmodebutton: {
      marginTop : "10px",
      backgroundColor: backgroundColor === "white" ? "grey" : "rgba(245,245,245,0.8)",
      color: backgroundColor === "white" ? "white" : "black",
      padding: "5px 20px",
      borderRadius: "10px",
      cursor: 'pointer',
    },

    religionPickerButton: {
      marginTop : "10px",
      backgroundColor: backgroundColor === "white" ? "grey" : "rgba(245,245,245,0.8)",
      color: backgroundColor === "white" ? "white" : "black",
      padding: "5px 20px",
      borderRadius: "10px",
      cursor: 'pointer',
      marginRight: '2rem',
    }
  }

  const callGPTChapter = async () => {
    setViewingChapterAnalysis(true);
    setgptResponse("");
    if (!chatStarted){
      setChatStarted(true);
    }
    toggleChat();
    console.log("RELIGION PREFERENCE:::::", religionPreference);
    await callGPT.getOpenAICompletion(`${currBook} - ${currChapter}`, null, true, religionPreference)
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
    console.log(chatIsOpen);
  }  

  useEffect( () => {
    document.title = "Biblical AI";

    const timeout = setTimeout(() => {
      setChatIsOpen(false);
      toggleChat();
    }, 25000);

    const timeout2 = setTimeout( () => {
      toggleChat();
    }, 6000)

    return () => {clearTimeout(timeout2); clearTimeout(timeout) };
  }, [])

  return (
    <div className="App">
      <PopupForm religionPreference={religionPreference} setReligionPreference={setReligionPreference} popupIsOpen={popupIsOpen} setPopUpIsOpen={setPopUpIsOpen}/>
      <Header />
      <button style={styles.religionPickerButton} onClick={() => popupIsOpen ? null : setPopUpIsOpen(true)}>Religion Selector</button>
      <button style={styles.darkmodebutton} onClick={() => changeBackgroundColor(backgroundColor === "white" ? '#333333' : 'white')}>{backgroundColor === "white" ? 'Dark Mode' : "Light Mode"}</button>
      <br />
      <p id="religionTeller">Current Religion Interpretation Selected: {religionPreference}</p>
      <Selector currBookId={currBookId} currChapter={currChapter} onValueChange={handleBookChange} chapterNumber={handleChapterChange} setAppChaptersList={setChapterList} setAppBooksList={setBooksList}/>
      <span className="w" onClick={callGPTChapter}><headerText>{currBook} - {currChapter}</headerText></span>
      <ScriptureComponent scriptureHtml={chapterText} currBook={currBook} currChapter={currChapter} setGPT={setgptResponse} setVerse={setCurrVerse} setViewing={setViewingChapterAnalysis} setChatStarted={setChatStarted} toggleFunc={toggleChat} religiousPreference={religionPreference} chatIsOpen={chatIsOpen}/>
      <ArrowButtons onLeftClick={handleLeftClick} onRightClick={handleRightClick} />
      {/*gptResponse && <div id="GPT"><p id="gptText">ChatGPT Analysis of:<br />{`${currBook} ${currChapter}`}{viewingChapterAnalysis ? '' : `:${currVerse}`}<br /><br />{gptResponse}</p>
      <button onClick={removeContent} className="close-btn">×</button>
      </div>*/}
      <div id="chatContainer" class="chat-container">
        <div id="chatHeader" class="chat-header" onClick={toggleChat}>
          Biblical AI Chat
          <button id="toggleButton" class="close-btnn">−</button>
        </div>
        <div id="chatContent" class="chat-content">
        <img src={icon} alt="Bot Icon" class="bot-icon" />
        <p id="chattingText">Biblical AI Bot:</p> <br />
        {chatStarted ? 
        gptResponse ? <p id="gptText"><strong>{`${currBook} ${currChapter}`}{viewingChapterAnalysis ? '' : `:${currVerse}`}</strong><br /><br /><p id="gptResponseText">{gptResponse}</p></p>
        : <Riple color="grey" size="medium" text="" textColor="" /> : <p style={{marginTop: '0rem'}}>Hi, I'm the Biblical AI Bot! <br /> <br /> Please select a religion to focus my interpretations on! <br />This can be changed through the 'Religion Selector' button up top anytime in the future.<br /> <br /> Click on a verse or chapter header to learn more about it from me. <br /> <br /> To flip to the next page of the bible, please use the arrow buttons on both sides of the screen. <br /> <br /> You can also use the drop down to go to different books or chapters of the bible. <br /> <br /> <i><small>Powered by OpenAI's GPT 4o</small></i> </p>
        }
        </div>
      </div>
    </div>
  );
}

export default App;
