// initialize Express in project
const express = require('express');
const http = require('http');
const cheerio = require('cheerio');
const request = require("request");
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
    getmovies( function(movieArr) {
        sortMovies(movieArr, req.query.sortOrder);
        res.render('pages/index', {movies: movieArr});
    });
});

app.get('/movie/:movieId', (req, res) => {
    getmovies( function(movieArr) {
        let movieIndex = -1;
        for ( let i = 0; i < movieArr.length; i++ ) {
            if ( movieArr[i].imdbID === req.params.movieId ) {
                movieIndex = i;
                break;
            }
        }
        if ( movieIndex < 0 ) {
            res.send("Cannot find movie id: " + req.params.movieId);
        }
        else {
            res.render('pages/movie', {movie: movieArr[movieIndex]});
        }
    });
});

app.get('/search/', (req, res) => {
    getmovies( function(movieArr) {
        let searchStr = req.query.search.toLowerCase();
        let movieSearchArr = movieArr.filter( function(i) {
            return i.Title.toLowerCase().includes(searchStr);
        });
        res.render('pages/search', {movies: movieSearchArr} );
    });
});

app.use(express.static('public'));

// start Express on port 8080
app.listen(8080, () => {
	console.log('Server Started on http://localhost:8080');
	console.log('Press CTRL + C to stop server');
});

function getMovie(id, cb) {
    let url = "http://www.omdbapi.com/?i=";
    const requestMovie = http.get(url + id, (response) => {
        let body = "";
        
        response.on('data', (chunk) => {
            body += chunk;
        });
        
        response.on('end', () => {
            cb(JSON.parse(body));
        });
    });
}

// Get movies Top 250 Movies from imdb
function getmovies(cb) {
    let url = "http://www.imdb.com/chart/top";
        request(url, function (error, response, body) {
            if (!error) {
                var $ = cheerio.load(body);
                var movieIdArr = $(".lister-list .posterColumn a").map( function() { 
                    return ($(this).attr('href')).substr(7,9); 
                });
               
        let movieArr = [];
        var loop = function(i) {
            getMovie(movieIdArr[i], function(movieObj) {
                i++;
                movieArr.push(movieObj);
                if ( i < movieIdArr.length ) { 
                    loop(i);
                }
                else { 
                    cb(movieArr);
                }
            });                           
        }
        loop(0); 
        } else {
              console.log("We’ve encountered an error: " + error);
            }
        });
}

// Sort movies by rating in ascending or descending order
function sortMovies(movieArr, order) {
    if (!order) {
        return;
    }
    else if ( order === "rating_desc" ) {
        movieArr.sort( function(a, b) {
                return b.imdbRating - a.imdbRating;
        });
    }
    else if ( order === "rating_asc" ) {
        movieArr.sort( function(a, b) {
                return a.imdbRating - b.imdbRating;
        });
    }
    else if ( order === "rating_desc_rt" ) {
        movieArr.sort( function(a, b) {
            let a_index = getTomatoIndex(a.Ratings);
            let b_index = getTomatoIndex(b.Ratings);
            if( b_index !== -1 && a_index !== -1 ) {
                return parseFloat(b.Ratings[b_index].Value) - parseFloat(a.Ratings[a_index].Value);
            }
            else if ( b_index !== -1 && a_index === -1 ) {
                return 1;
            }
            else if ( b_index === -1 && a_index !== -1 ) {
                return -1;
            }
            else {
                return 0;
            }
        });
    }
    else if ( order === "rating_asc_rt" ) {
        movieArr.sort( function(a, b) {
            let a_index = getTomatoIndex(a.Ratings);
            let b_index = getTomatoIndex(b.Ratings);
            if( a_index !== -1 && b_index !== -1 ) {
                return parseFloat(a.Ratings[a_index].Value) - parseFloat(b.Ratings[b_index].Value);
            }
            else if ( a_index !== -1 && b_index === -1 ) {
                return -1;
            }
            else if ( a_index === -1 && b_index !== -1 ) {
                return 1;
            }
            else {
                return 0;
            }
        });
    }
}

function getTomatoIndex(arr) {
    for ( let i = 1; i < arr.length; i++) {
        if ( arr[i].Source === "Rotten Tomatoes" ) {
            return i;
        }
    }
    return -1;
}