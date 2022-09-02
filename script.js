const APIController=(
    function(){
        const clientId = '3d0aaaab434644d7810ca2dd2a56118a';
        const clientSecret = 'b67bebb1d9dd43b2bbf971f103221d26';
        //token
        const getToken = async () =>{
            const result = await fetch('https://accounts.spotify.com/api/token',{
                method :'POST',
                headers :{
                    'Content-Type' : 'application/x-www-form-urlencoded', 
                    'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
                },
                body : 'grant_type=client_credentials'
            });
            const data = await result.json();
            return data.access_token;
        }
        //genres
        const getGenres = async (token) =>{
            const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
                method: 'GET',
                headers: { 'Authorization' : 'Bearer ' + token}
            });
            const data = await result.json();
            return data.categories.items;
        }
        //get playlist By Genre
        const getPlaylistByGenre = async (token, genreId) => {

            const limit = 10;
            
            const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
                method: 'GET',
                headers: { 'Authorization' : 'Bearer ' + token}
            });
    
            const data = await result.json();
            return data.playlists.items;
        }
        const getTracks = async (token, tracksEndPoint) => {

            const limit = 10;
    
            const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
                method: 'GET',
                headers: { 'Authorization' : 'Bearer ' + token}
            });
    
            const data = await result.json();
            return data.items;
        }
    
        const getTrack = async (token, trackEndPoint) => {
    
            const result = await fetch(`${trackEndPoint}`, {
                method: 'GET',
                headers: { 'Authorization' : 'Bearer ' + token}
            });
    
            const data = await result.json();
            return data;
        }
    

        return {
            getToken() {
                return getToken();
            },
            getGenres(token) {
                return getGenres(token);
            },
            getPlaylistByGenre(token, genreId) {
                return getPlaylistByGenre(token, genreId);
            },
            getTracks(token, tracksEndPoint) {
                return getTracks(token, tracksEndPoint);
            },
            getTrack(token, trackEndPoint) {
                return getTrack(token, trackEndPoint);
            }
        }
    }
)();
// UI Module
const UIController = (function() {

    //object to hold references to html selectors
    const DOMElements = {
        selectGenre :'.container_right',
        //selectGenre: '#select_genre',
        selectPlaylist: '#select_playlist',
        playlist_box: '.playlist_box',
        //divSongDetail: '#song-detail',
        //hfToken: '#hidden_token',
       // divSonglist: '.song-list'
       
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail)
            }
        },
        createListGenre(text,value){
            let id = value.slice(1,value.length).toLowerCase();
            const html = `<div class="playlist">
            <div class="playlist_head">
                <h3 id="select_genre">${text}</h3>
                <p><a href="#">see all</a></p>
            </div>
            <div class="playlist_contain" id="${id}"></div>
            
        </div>`;
        document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        },
        createPlaylist(name,href,images,iden){
            let id = "#"+iden.slice(1,iden.length).toLowerCase();
            const html = `
            <div class="playlist_box">
                <a href="${href}">
                <img src="${images}" alt="images playlist">
                <p>${name}</p>
                <p>author</p>
                </a>
            </div>
            `;
            document.querySelector(id).insertAdjacentHTML('beforeend', html);
        }
       
    }

})();
const APPController = (function(UICtrl, APICtrl) {

    // get input field object ref
    //const DOMInputs = UICtrl.inputField();

    // get genres on page load
    const loadGenres = async () => {
        //get the token
        const token = await APICtrl.getToken();           
        //store the token onto the page
        //UICtrl.storeToken(token);
        //get the genres
        const genres = await APICtrl.getGenres(token);
        var agend = [];
        //populate our genres select element
        genres.forEach(element => {UICtrl.createListGenre(element.name,element.id),
        console.log(element.id),
        agend.push(element.id)
       });
       console.log(agend);
       for(var i=0;i<agend.length;i++){
        console.log(agend[i]);
        const playlist = await APICtrl.getPlaylistByGenre(token,agend[i]);
        playlist.forEach(ele => UICtrl.createPlaylist(ele.name, ele.tracks.href,ele.images[0].url,agend[i]))
       }
        
    }
    //click and
    return {
        init() {
            console.log('App is starting');
            loadGenres();
        }
    }

})(UIController, APIController);
// will need to call a method to load the genres on page load
APPController.init();