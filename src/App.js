import React, { useState, useEffect } from 'react';
import './App.css';

import Header from './components/header';
import Selector from './components/book-verse-Selection';
import ScriptureComponent from './components/display-chapter';
import DarkThemeToggle from './components/dark-theme';

import bibleService from "./services/get-chapters";
import './scripture-styles.css';

//https://reactbibleapp.vercel.app/

function App() {
  const [currBook, setCurrBook] = useState("Genesis");
  const [currBookId, setCurrBookId] = useState("GEN");
  const [currChapter, setCurrChapter] = useState("1");
  const [chapterText, setChapterText] = useState();

  function handleBookChange(book, bookId) {
    setCurrChapter("1");
    setCurrBook(book);
    setCurrBookId(bookId);
  };

  function handleChapterChange(chapter) {
    setCurrChapter(chapter);
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
      <Selector onValueChange={handleBookChange} chapterNumber={handleChapterChange}/>
      <headerText>{currBook} - {currChapter}</headerText>
      <ScriptureComponent scriptureHtml={chapterText} />
    </div>
  );
}

export default App;
