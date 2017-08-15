
var fs = require("fs");   //Node built in file system library


var request = require('request');                   //npm installed
var Twitter = require('twitter');                   //npm installed
var Spotify = require("node-spotify-api");          //npm installed


var keys = require("./keys.js")           //require the keys.js for twitter and spotify


//required keys are put into object
var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

//required keys are put into object
var spotify = new Spotify({
  id: keys.spotifyKeys.id,
  secret: keys.spotifyKeys.secret
});

var index = process.argv;

var index2 = process.argv[2];   //command put into variable

var index3 = "";                //command argument put into variable
for (var i = 3; i < index.length; i++) {   //for looping argument for more than one word
  if(i > 3 && i < index.length){
    index3 = index3 + "+" + index[i];

  }
  else {
    index3 = index3 + index[i];
  }
}

//~~~~~~~~~~~~~~~~~~~~~~switch / case ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


switch (index2) {
      case "my-tweets":
          inTweets();
          console.log("-----------------------");
          break;

      case "spotify-this-song":
          if(index3) {
          inSpotify(index3);
          console.log("-----------------------");
          }
          else {
            inSpotify("The Sign Ace of Base");
            console.log("-----------------------");
          }
          break;

      case "movie-this":
          if(index3) {
            inMovie(index3);
            console.log("-----------------------");
          }
          else {
            inMovie("Mr.Nobody");
            console.log("-----------------------");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
          }
          break;

      case "do-what-it-says":
          inWhatItSays();
          console.log("-----------------------");
          break;

      default:
          console.log("-----------------------");
          console.log("Not a valid command.  Try again.");
          break;
}


//~~~~~~~~~~~~~~~~~~~~~tweets function~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function inTweets () {
  var params = {screen_name: 'Liri_Synth'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for(var i = 0; i < tweets.length && i < 20; i++){
        console.log("Tweet #: " + (i + 1));
        console.log((tweets[i].created_at).slice(0,19) + (tweets[i].created_at).slice(25,30));
        console.log(tweets[i].text);
        console.log("~~~~~~~~~~~~~~~~~~~~~");

        fs.appendFile('./log.txt', "Tweet #: " + (i + 1) + '\n');
        fs.appendFile('./log.txt', (tweets[i].created_at).slice(0,19) + (tweets[i].created_at).slice(25,30) + '\n');
        fs.appendFile('./log.txt', tweets[i].text + '\n');
        fs.appendFile('./log.txt', "~~~~~~~~~~~~~~~~~~~~~"  + '\n');



      }
    }else{
      console.log(error);
    }
  });
}

//~~~~~~~~~~~~~~~~~~~~~spotify function~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function inSpotify(index3) {

  spotify.search({ type: 'track', query: index3 }, function(error, data) {
  if (error) {
    return console.log('Error occurred: ' + err);
  }
    else {
      console.log("Artist Name: "+ data.tracks.items[0].artists[0].name);
      console.log("Song Name: " + data.tracks.items[0].name);
      console.log("Preview Link: " + data.tracks.items[0].preview_url);
      console.log("Album: " + data.tracks.items[0].album.name);

      fs.appendFile('./log.txt', index2 + " " + index3 + '\n');
      fs.appendFile('./log.txt', "Artist Name: "+ data.tracks.items[0].artists[0].name + '\n');
      fs.appendFile('./log.txt', "Song Name: " + data.tracks.items[0].name + '\n');
      fs.appendFile('./log.txt', "Preview Link: " + data.tracks.items[0].preview_url + '\n');
      fs.appendFile('./log.txt', "Album: " + data.tracks.items[0].album.name + '\n');
    }
  });
}

//~~~~~~~~~~~~~~~~~~~~~movie function~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function inMovie(index3){
  var queryURL = "http://www.omdbapi.com/?t=" + index3 + "&y=&plot=short&apikey=40e9cece";


  request(queryURL, function (error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      // console.log("Rotten Tomatoes Rating: " + body.Ratings[1].Value);
      for(var i = 0; i < body.Ratings.length; i++){
        if(body.Ratings[i].Source == "Rotten Tomatoes"){
          console.log("Rotten Tomatoes Rating: "+body.Ratings[i].Value);
        }
      }
      fs.appendFile('./log.txt', "Title: " + body.Title + '\n');
      fs.appendFile('./log.txt', "Release Year: " + body.Year + '\n');
      fs.appendFile('./log.txt', "IMdB Rating: " + body.imdbRating + '\n');
      fs.appendFile('./log.txt', "Country: " + body.Country + '\n');
      fs.appendFile('./log.txt', "Language: " + body.Language + '\n');
      fs.appendFile('./log.txt', "Plot: " + body.Plot + '\n');
      fs.appendFile('./log.txt', "Actors: " + body.Actors + '\n');

      for(var i = 0; i < body.Ratings.length; i++){
        if(body.Ratings[i].Source == "Rotten Tomatoes"){
          fs.appendFile('./log.txt', "Rotten Tomatoes Rating: "+body.Ratings[i].Value + '\n');
        }
      }

    }
      else{
        console.log('Error occurred.')
      }
  });
}

//~~~~~~~~~~~~~~~~~~~~~do-what-it-says function~~~~~~~~~~~~~~~~~~~~~~~~

function inWhatItSays() {

	fs.readFile('./random.txt', 'utf8', function(error, data) {

	if (error) return console.log('Filesystem Read Error: ' + error);

	// split data into an array of function name and argument
	var ranText = data.split(',');

	// define the function name and argument name
	var textIndex2 = ranText[0];
	var textIndex3 = ranText[1];

	// modify the myFunction received into the function names used in this app
  	switch (textIndex2) {
  		case 'my-tweets':
  			inTweets();
  			break;
  		case 'spotify-this-song':
  			inSpotify(textIndex3);
  			break;
  		case 'movie-this':
  			inMovie();
  			break;
  		default:
  			console.log('Unexpected error in doWhatItSays function');
  	}
	});
}

//~~~~~~~~~~~~~~~~~~~~~Bonus: data log function~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~Per function~~~~~~~~~~~~~~~~
