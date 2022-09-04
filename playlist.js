const APIController=( function(){
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

    const getTracksDemo = async (token) => {

        const limit = 10;
        const trackLink = "https://api.spotify.com/v1/playlists/37i9dQZF1DX0XUsuxWHRQd/tracks";
        const result = await fetch(`${trackLink}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
    }
    const getTrackDetail = async(token,trackEndPoint) =>{
        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }
    const getTracks = async (token, tracksEndPoint) => {

        const limit = 10;
        //let trackEndPoint = 'https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/tracks';
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
        getToken(){
            return getToken();
        },
        getTracksDemo(token){
            return getTracksDemo(token);
        },
        getTrackDetail(token,trackEndPoint){
            return getTrackDetail(token,trackEndPoint);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
    }
})();
const UIController = (
    function(){
        return {
            createListTrack(title,artist){
                const html = 
            `
            <div class="songs">
                    <div class="songs_title">
                        <p>#</p>
                        <p>${title}</p>
                        <i></i>
                    </div>
                    <div class="songs_contain">
                        <p>1</p>
                        <p>${artist}</p>
                        <i></i>
                    </div>
            </div>
            `;
            document.querySelector(".container_playlist").insertAdjacentHTML('beforeend', html);
            },
            createTrackDetail(name,album,artist,date,images,time){
                const minute = changeToMinute(Number(time));
                const html = 
            `
            <div class="songs">
                    <div class="songs_title">
                        <p>1</p>
                        <img src="${images}">
                        <div class="name_title">
                            <h3>${name}</h3>
                            <p>${artist}</p>
                        </div>
                    </div>
                    <div class="album_title">
                        <p>${album}</p>
                    </div>
                    <p>${date}</p>
                    <p>${minute}</p>
            </div>
            `;
            document.querySelector(".container_playlist").insertAdjacentHTML('beforeend', html);
            }
        }
    }
)();
const APPController = (function(UICtrl, APICtrl) {

    const loadTracks = async () => {
        //get the token
        const token = await APICtrl.getToken(); 

        const track = await APICtrl.getTracksDemo(token);
        //
        const trackDetailLink=[];
        track.forEach(element => /*{UICtrl.createListTrack(element.track.name,element.track.href),*/{
        trackDetailLink.push(element.track.href)}
        );
        console.log(trackDetailLink);
        for(var i=0;i<trackDetailLink.length;i++){
            console.log(trackDetailLink[i]);
            const track = await APICtrl.getTrackDetail(token,trackDetailLink[i]);
            UICtrl.createTrackDetail(track.name,track.album.name,track.artists[0].name,track.album.release_date,track.album.images[2].url,track.duration_ms);
        }

    }
    
    return {
        init() {
            console.log('App is starting');
            loadTracks();
        }
    }

})(UIController, APIController);
// will need to call a method to load the genres on page load
APPController.init();
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
function changeToMinute(milliseconds){
    const minutes = Math.floor(milliseconds/60000);
    const seconds = Math.floor((milliseconds%60000)/1000);
    return seconds === 60 ? `${minutes + 1}:00`
    : `${minutes}:${padTo2Digits(seconds)}`;
}