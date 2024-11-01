//import axios from "axios"

class bibleService {
    static url = "https://api.scripture.api.bible/v1/bibles/01b29f4b342acc35-01"; 
    static options = {
        headers: {
          "api-key": "102ca4501c01be682b27284f52683cc1"
        }
    };

    async getChapterCount(book) {
        const url = `${bibleService.url}/books/${book}/chapters`;
        let jsonArray = {};

        await fetch(url, bibleService.options)
        .then( res => res.json() )
        .then( data => { jsonArray = data; } )
        .catch( e => console.log(e) );
        console.log("jsonArray", jsonArray);

        return jsonArray;
    }

    async getBooks() {
        const url = `${bibleService.url}/books`;
        let jsonArray = {};

        await fetch(url, bibleService.options)
        .then( res => res.json() )
        .then( data => { jsonArray = data; } )
        .catch( e => console.log(e) );
        console.log("jsonArray", jsonArray);

        return jsonArray;
    }
}

export default new bibleService;