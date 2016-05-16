var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi();

module.exports = {

    findTrack: function (songTitle, artistName, callback) 
    {
    	var titleComponent = "";
    	var artistComponent = "";

    	if(songTitle !== undefined && songTitle !== null)
    		titleComponent = 'track:' + songTitle;

		if(artistName !== undefined && artistName !== null)
    		artistComponent = ' artist:' + artistName; 

    	//console.log(titleComponent + artistComponent, callback)   	;
    	console.log("test");

        spotifyApi.searchTracks("by my side", callback);

    },

    test: function (callback)
    {
    	//spotifyApi.getArtist('2hazSY4Ef3aB9ATXW7F5w3', callback);
    	spotifyApi.getArtistTopTracks('0oSGxfWSnnOXhD2fKuz2Gy', 'GB', callback);
    }
}

