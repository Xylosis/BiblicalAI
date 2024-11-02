import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import Navvybar from './components/navbar';
import Header from './components/header';
import Selector from './components/book-verse-Selection';
import ScriptureComponent from './components/display-chapter';

import bibleService from "./services/get-chapters";
import './scripture-styles.css';

//https://reactbibleapp.vercel.app/

function App() {
  const [currBook, setCurrBook] = useState("Genesis");
  const [currBookId, setCurrBookId] = useState("GEN");
  const [currChapter, setCurrChapter] = useState("1");
  const [chapterText, setChapterText] = useState();

  function handleBookChange(book, bookId) {
    setCurrBook(book);
    setCurrBookId(bookId);
  };

  function handleChapterChange(chapter) {
    setCurrChapter(chapter);
  };

  useEffect( () => {
    async function chapterGetter() {
      const temp = await bibleService.getChapterContent(currBookId, currChapter);
      setChapterText(temp.data.content);
      console.log("chapter text", chapterText);
    }
    chapterGetter()
  }, [currChapter]);

  return (
    <div className="App">
      <Header />
      <Selector onValueChange={handleBookChange} chapterNumber={handleChapterChange}/>
      <headerText>{currBook} - {currChapter}</headerText>
      <ScriptureComponent scriptureHtml={chapterText} />
    </div>
  );
}

export default App;
