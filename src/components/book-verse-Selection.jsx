import React, { useState, useEffect } from "react";
import bibleService from "../services/get-chapters";

function Selector( { onValueChange, chapterNumber } ) {
    const [selectedValueBook, setSelectedValueBook] = useState('GEN'); 
    const [selectedValueChapter, setSelectedValueChapter] = useState("1");
    const [chaptersArray, setChaptersArray] = useState();
    const [booksArray, setBooksArray] = useState();
    

    const handleChangeBook = (event) => {
        setSelectedValueBook(event.target.value);
        onValueChange(event.target.options[event.target.selectedIndex].text, event.target.value);
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
        console.log("data", data);
        data.data.map((element) => {
            console.log(element)
        });
        console.log("array", chaptersArray);
        return data;
    };

    //getChapterCount("GEN")
    useEffect(() => {
        getChapterCount(selectedValueBook);
    }, [selectedValueBook]);

    useEffect(() => {
        async function booksGetter() {
            const temp = await bibleService.getBooks();
            setBooksArray(temp);
            console.log("books array", booksArray);
        }
        booksGetter()
    }, []);

    return (
        <div style={styles.div}>
            <select style={styles.selectLeft} value={selectedValueBook} onChange={handleChangeBook}>
            {
                booksArray?.data?.map((element) => (
                    <option key={element.id} value={element.id}>
                        {element.name}
                    </option>
                ))
            }
            </select>

            <select value={selectedValueChapter} onChange={handleChangeChapter}>
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
        margin: "20px 20px 40px 20px"
    },

    selectLeft: {
        marginRight: "40px"
    },


}