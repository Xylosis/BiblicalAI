import React, { useState, useEffect } from 'react';
import './App.css';

import Header from './components/header';
import Selector from './components/book-verse-Selection';
import ScriptureComponent from './components/display-chapter';
import DarkThemeToggle from './components/dark-theme';

import bibleService from "./services/get-chapters";
import './scripture-styles.css';
import ArrowButtons from './components/arrows';

//https://reactbibleapp.vercel.app/

function App() {
  const [currBook, setCurrBook] = useState("Genesis");
  const [currBookId, setCurrBookId] = useState("GEN");
  const [currChapter, setCurrChapter] = useState("1");
  const [chapterText, setChapterText] = useState();
  const [booksList, setBooksList] = useState();
  const [chapterList, setChapterList] = useState();

  function handleBookChange(book, bookId) {
    setCurrChapter("1");
    setCurrBook(book);
    setCurrBookId(bookId);
  };

  function handleChapterChange(chapter) {
    setCurrChapter(chapter);
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
    const reg = '<span class="q" id=".">.+?(?=<)';
    let scriptureHtmlHolder = content.replaceAll("</span>", '</span><span class="q" id="$">');
    // text = scriptureHtml.match(reg)[0];
    // scriptureHtml = scriptureHtml.replace(text, `${text}</span>`);
    let arr = [...scriptureHtmlHolder.matchAll(reg)];
    for (let i = 0; i < arr.length; i++) {
        let text = arr[i][0];
        scriptureHtmlHolder = scriptureHtmlHolder.replace(text, `${text}</span>`);
        scriptureHtmlHolder = scriptureHtmlHolder.replace('id="$"', `id="${currBook}-${currChapter}:${i+1}"`);
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

  return (
    <div className="App">
      <Header />
      <DarkThemeToggle />
      <Selector onValueChange={handleBookChange} chapterNumber={handleChapterChange} setAppChaptersList={setChapterList} setAppBooksList={setBooksList}/>
      <headerText>{currBook} - {currChapter}</headerText>
      <ScriptureComponent scriptureHtml={chapterText} />
      <ArrowButtons onLeftClick={handleLeftClick} onRightClick={handleRightClick} />
    </div>
  );
}

export default App;
