import React, { useState, useEffect } from "react";
import bibleService from "../services/get-chapters";
import './dropdown.css';

function Selector( { currBookId, currChapter, onValueChange, chapterNumber, setAppChaptersList, setAppBooksList } ) {
    const [selectedValueBook, setSelectedValueBook] = useState('GEN'); 
    const [selectedValueChapter, setSelectedValueChapter] = useState("1");
    const [chaptersArray, setChaptersArray] = useState();
    const [booksArray, setBooksArray] = useState();

    const handleChangeBook = (event) => {
        setSelectedValueBook(event.target.value);
        onValueChange(event.target.options[event.target.selectedIndex].text, event.target.value);
        setSelectedValueChapter("1");
        chapterNumber("1");
    };
    
    const handleChangeChapter = (event) => {
        console.log("changing to", event.target.value);
        setSelectedValueChapter(event.target.value);
        chapterNumber(event.target.value);
    };

    const getChapterCount = async (book) => {
        const data = await bibleService.getChapterCount(book)/*.then(function(result) {
            //console.log("Result", result);
            setChaptersArray(result);
        });*/

        setChaptersArray(data);
        setAppChaptersList(data.data.slice(1));
        console.log("data", data);
        data?.data?.map((element) => {
            console.log(element)
        });
        console.log("array", chaptersArray);
        return data;
    };

    useEffect(() => {
        setSelectedValueBook(currBookId);
        console.log(currBookId);
        setSelectedValueChapter(currChapter);
    }, [currBookId, currChapter])

    //getChapterCount("GEN")
    useEffect(() => {
        getChapterCount(selectedValueBook);
    }, [selectedValueBook]);

    useEffect(() => {
        async function booksGetter() {
            const temp = await bibleService.getBooks();
            setBooksArray(temp);
            // let booksLst = [];
            // for(let i = 0; i < temp.data.length; i++ ) {
            //     booksLst.push(temp.data[i].id);
            // }
            setAppBooksList(temp.data);
            console.log("books array", booksArray);
        }
        booksGetter()
    }, []);

    return (
        <div style={styles.div}>
            <select style={styles.selectLeft} class="dropdown" id="bookDropDown" value={selectedValueBook} onChange={handleChangeBook}>
            {
                booksArray?.data?.map((element, index) => (
                    <option key={element.id} value={element.id}>
                        {element.name}
                    </option>
                ))
            }
            </select>

            <select value={selectedValueChapter} class="dropdown" id="chapterDropDown" onChange={handleChangeChapter}>
            {
                chaptersArray?.data?.map((element) => (
                (element.number !== "intro") ? 
                    <option key={element.reference} value={element.number}>
                        {element.number}
                    </option> : null
                ))}
            </select>
        </div>
    );
};

export default Selector;

const styles = {
    div: {
        padding: "20px",
        backgroundColor: "grey",
        margin: "20px 20px 40px 20px",
        borderRadius: "1rem",
    },

    selectLeft: {
        marginRight: "40px"
    },



}