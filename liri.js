//Packages to be used

require("dotenv").config();

var request = require("request");

var Spotify = require("node-spotify-api");

var keys = require("./keys");

var dayjs = require("dayjs");

var fs = require("fs");

//Global variables

var liriCommand = process.argv[2];

var userInput = process.argv;

var userSearch = "";

var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});
var queryUrl =
  "http://www.omdbapi.com/?t=" + userSearch + "&y=&plot=short&apikey=trilogy";

//For loop to concatenate a user's input into a single variable (takes spaces into account)
for (var i = 3; i < userInput.length; i++) {
  if (i > 3 && i < userInput.length) {
    userSearch = userSearch + "+" + userInput[i];
  } else {
    userSearch += userInput[i];
  }
}

reader();

function reader() {
  if (liriCommand === "spotify-this-song" && !(userSearch === "")) {
    spotifyThis();
  } else if (liriCommand === "spotify-this-song" && userSearch === "") {
    spotifyBlank();
  } else if (liriCommand === "movie-this" && !(userSearch === "")) {
    movieThis();
  } else if (liriCommand === "movie-this" && userSearch === "") {
    movieBlank();
  } else if (liriCommand === "concert-this") {
    concertThis();
  } else if (liriCommand === "do-what-it-says") {
    goLiri();
  }
}

//Liri command functions
function spotifyThis() {
  spotify.search({ type: "track", query: userSearch }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    for (i = 0; i < data.tracks.items.length; i++) {
      console.log(
        "===========================================================\n"
      );
      console.log("Song: " + data.tracks.items[i].name);
      console.log("Artist: " + data.tracks.items[i].album.artists[0].name);
      console.log("Album: " + data.tracks.items[i].album.name);
      console.log("Preview URL: " + data.tracks.items[i].preview_url);
      console.log(
        "\n===========================================================\n"
      );
    }
  });
}

function spotifyBlank() {
  spotify.search({ type: "track", query: "the+Sign+Ace+of+base" }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    for (i = 0; i < data.tracks.items.length; i++) {
      console.log(
        "===========================================================\n"
      );
      console.log("Song: " + data.tracks.items[i].name);
      console.log("Artist: " + data.tracks.items[i].album.artists[0].name);
      console.log("Album: " + data.tracks.items[i].album.name);
      console.log("Preview URL: " + data.tracks.items[i].preview_url);
      console.log(
        "\n===========================================================\n"
      );
    }
  });
}

function movieThis() {
  var queryUrl =
    "http://www.omdbapi.com/?t=" + userSearch + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      var jsonBody = JSON.parse(body);
      console.log("Title: " + jsonBody.Title);
      console.log("Year: " + jsonBody.Year);
      console.log("IMDB Rating: " + jsonBody.Ratings[0].Value);
      console.log("Rotten Tomatoes: " + jsonBody.Ratings[1].Value);
      console.log("Country: " + jsonBody.Country);
      console.log("Language: " + jsonBody.Language);
      console.log("Plot: " + jsonBody.Plot);
      console.log("Actors: " + jsonBody.Actors);
    }
  });
}

function movieBlank() {
  var mrNobody =
    "http://www.omdbapi.com/?t=" +
    "Mr.Nobody" +
    "&y=&plot=short&apikey=trilogy";

  request(mrNobody, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      var jsonBody = JSON.parse(body);
      console.log("Title: " + jsonBody.Title);
      console.log("Year: " + jsonBody.Year);
      console.log("IMDB Rating: " + jsonBody.Ratings[0].Value);
      console.log("Rotten Tomatoes: " + jsonBody.Ratings[1].Value);
      console.log("Country: " + jsonBody.Country);
      console.log("Language: " + jsonBody.Language);
      console.log("Plot: " + jsonBody.Plot);
      console.log("Actors: " + jsonBody.Actors);
    }
  });
}

function concertThis() {
  var bandUrl =
    "https://rest.bandsintown.com/artists/" +
    userSearch +
    "/events?app_id=codingbootcamp";

  request(bandUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
    }
    jsonBody = JSON.parse(body);
    console.log("Next Concert \nVenue: " + jsonBody[0].venue.name);
    console.log(
      "Location: " +
        jsonBody[0].venue.city +
        ", " +
        jsonBody[0].venue.region +
        " " +
        jsonBody[0].venue.country
    );
    var date = jsonBody[0].datetime;
    var dateSplit = date.split("T");
    var concertDate = dayjs(dateSplit[0]).format("MM/DD/YYYY");
    console.log("Date: " + concertDate);
  });
}

function goLiri() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    // We will then print the contents of data
    console.log(data);

    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");

    // We will then re-display the content as an array for later use.

    liriCommand = dataArr[0];
    userSearch = dataArr[1];

    reader();
  });
}
