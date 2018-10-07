// Dependencies
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");
require("dotenv").config();
var keys = require("./keys");
var Spotify = require("node-spotify-api");

var action = process.argv[2]
var name = process.argv.slice(3).join(" ")
function bands() {
    var queryURL = "https://rest.bandsintown.com/artists/" + name + "/events?app_id=codingbootcamp";
    console.log(queryURL);
    axios.get(queryURL).then(function(response){
        if (response.data.length > 0){
            console.log("Concerts for " + name + ":");
            for (var i = 0; i<5; i++){
                console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                console.log("Venue: " + response.data[i].venue.name);
                console.log("When: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
                console.log("------------");
            }
        }
        else {
            console.log("Sorry this band has no upcoming concerts.");
        } 
    });
    
}
function spotify() {
    if (!name) {
        name = "I will Always Love You";
    }
    var spotify = new Spotify(keys.spotify);
    spotify.search({
        type: "track",
        query: name
    },
    function (err, response) {
        if (err) {
            console.log(err);
            return;
        }
        var songsInfo = response.tracks.items;
        for (var i = 0; i<5; i++) {
            
            console.log("Song Name: " + songsInfo[i].name);
            console.log("Album: " + songsInfo[i].album.name);
            console.log("URL: " + songsInfo[i].preview_url);
            var artistArray =  [];
            for (var j = 0; j<songsInfo[i].artists.length; j++){
                artistArray.push(songsInfo[i].artists[j].name);
            }
            console.log("Artist(s): " + artistArray.join(", "));
            console.log("------------");
        }

    });
}
function movies() {
    if (!name){
        name = "Mr. Nobody";
    }
    // if (response.data.Ratings[1]) {
    //     console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
    // }
}
function random() {
    fs.readFile("random.txt", "utf8", function (err, response) {
        if (err){
            console.log(err);
            return;
        }
        var responseArray = response.split(",");
        action = responseArray[0];
        name = responseArray[1];
        runAction();
    })
}
function runAction() {
    switch (action) {
        case 'concert-this':
            bands();
        break;
        case 'spotify-this-song':
            spotify();
            break;
        case 'movie-this':
            movies();
        break;
        case 'do-what-it-says':
            random();
        break;
        default:
        console.log('Sorry, you messed something up.');
    }
} 
runAction(); 