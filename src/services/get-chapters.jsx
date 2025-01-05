//import axios from "axios"
//import { config } from "dotenv";
//config({path: "C:/Users/Andrew/Documents/Visual Studio Code/CS485/genai-website-project/.env.js"});

class bibleService {

    static url = "https://api.scripture.api.bible/v1/bibles/01b29f4b342acc35-01"; 
    static options = {
        headers: {
          "api-key": process.env.REACT_APP_API_KEY
        }
    };

    async getChapterCount(bookId) {
        const url = `${bibleService.url}/books/${bookId}/chapters`;
        let jsonArray = {};

        await fetch(url, bibleService.options)
        .then( res => res.json() )
        .then( data => { jsonArray = data; } )
        .catch( e => console.log(e) );

        return jsonArray;
    }

    async getBooks() {
        const url = `${bibleService.url}/books`;
        let jsonArray = {};

        await fetch(url, bibleService.options)
        .then( res => res.json() )
        .then( data => { jsonArray = data; } )
        .catch( e => console.log(e) );

        return jsonArray;
    }

    async getChapterContent(bookId, chapter) {
        const url = `${bibleService.url}/chapters/${bookId}.${chapter}`;
        let jsonArray = {};

        await fetch(url, bibleService.options)
        .then( res => res.json() )
        .then( data => { jsonArray = data; } )
        .catch( e => console.log(e) );

        return jsonArray;
    }

    /* CALL FOR SPECIFIC VERSE SEARCH https://api.scripture.api.bible/v1/bibles/06125adad2d5898a-01/search?query=John%203:16-19&offset=0 */ 
}

export default new bibleService;