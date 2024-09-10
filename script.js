document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '48aa722f'; 
    const mainContent = document.getElementById('main-content');
    const homeBtn = document.getElementById('homeBtn');
    const watchlistBtn = document.getElementById('watchlistBtn');

    showHome();

    homeBtn.addEventListener('click', showHome);
    watchlistBtn.addEventListener('click', showWatchlist);

document.addEventListener('DOMContentLoaded',()=>{
    fetchdefaultmovies();
});

    function showHome() {
        mainContent.innerHTML = `
            <div class="movie-search">
                <h2>Search Movies:</h2>
                <input type="text" id="search-input" class="search-input" placeholder="Search for a movie...">
                <button id="searchBtn">Search</button>
                <div id="movie-results"></div>
            </div>
            <div class="default-movies">
                <h2>Featured Movies:</h2>
                <div id="default-movie-results"></div>
            </div>
        `;

        document.getElementById('searchBtn').addEventListener('click', searchMovies);

        displayDefaultMovies();
    }

    function displayDefaultMovies() {
        const defaultMovieIDs = ['tt0111161', 'tt0068646', 'tt0071562', 'tt0468569', 'tt0108052']; // Example IMDb IDs

        const defaultMovieResults = document.getElementById('default-movie-results');
        defaultMovieResults.innerHTML = ''; 

        defaultMovieIDs.forEach(id => {
            fetchMovieDetails(id).then(movie => {
                if (movie && movie.Response !== 'False') {
                    defaultMovieResults.innerHTML += `
                        <div class="movie-item" onclick="showMovieDetails('${movie.imdbID}')">
                            <img src="${movie.Poster}" alt="${movie.Title}">
                            <h2>${movie.Title}</h2>
                            <p>${movie.Year}</p>
                        </div>
                    `;
                } else {
                    console.error(`Movie with ID: ${id} not found.`);
                }
            }).catch(error => {
                console.error('Error fetching movie:', error);
            });
        });
    }

    function showWatchlist() {
        const watchlist = Object.keys(localStorage);

        if (watchlist.length === 0) {
            mainContent.innerHTML = '<p>Your watchlist is empty!</p>';
            return;
        }

        mainContent.innerHTML = '<h2>Your Watchlist:</h2>';

        watchlist.forEach(id => {
            fetchMovieDetails(id).then(movie => {
                if (movie && movie.Response !== 'False') {
                    mainContent.innerHTML += `
                        <div class="fav-item" id="fav-${movie.imdbID}">
                            <img src="${movie.Poster}" alt="${movie.Title}">
                            <h2>${movie.Title}</h2>
                            <p>${movie.Year}</p>
                            <button onclick="removeFromWatchlist('${movie.imdbID}')">Remove from Watchlist</button>
                        </div>
                    `;
                } else {
                    console.error(`Movie with ID: ${id} not found.`);
                }
            }).catch(error => {
                console.error('Error fetching movie:', error);
            });
        });
    }

    function fetchMovieDetails(id) {
        return fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`)
            .then(response => response.json())
            .then(data => data)
            .catch(error => {
                console.error('Error fetching movie details:', error);
                return null;
            });
    }

    function searchMovies() {
        const query = document.getElementById('search-input').value.trim();
        if (query === '') {
            document.getElementById('movie-results').innerHTML = '<p>Please enter a movie name.</p>';
            return;
        }
        fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.Response === 'True') {
                    displayMovies(data.Search);
                } else {
                    document.getElementById('movie-results').innerHTML = '<p>No movies found.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
                document.getElementById('movie-results').innerHTML = '<p>Error fetching search results.</p>';
            });
    }

    function displayMovies(movies) {
        const results = document.getElementById('movie-results');
        results.innerHTML = '';
        movies.forEach(movie => {
            results.innerHTML += `
                <div class="movie-item" onclick="showMovieDetails('${movie.imdbID}')">
                    <img src="${movie.Poster}" alt="${movie.Title}">
                    <h2>${movie.Title}</h2>
                    <p>${movie.Year}</p>
                    <button onclick="addToWatchlist('${movie.imdbID}'); event.stopPropagation();">Add to Watchlist</button>
                </div>
            `;
        });
    }

    window.showMovieDetails = function (id) {
        fetchMovieDetails(id).then(movie => {
            if (!movie) {
                mainContent.innerHTML = '<p>Movie not found.</p>';
                return;
            }
            mainContent.innerHTML = `
                <div class="movie-item">
                    <img src="${movie.Poster}" alt="${movie.Title}">
                    <h2>${movie.Title}</h2>
                    <p>${movie.Year}</p>
                    <p>${movie.Genre}</p>
                    <p>${movie.Plot}</p>
                    <button onclick="addToWatchlist('${movie.imdbID}')">Add to Watchlist</button>
                </div>
            `;
        });
    }

    window.addToWatchlist = function (id) {
        if (localStorage.getItem(id)) {
            alert('Movie is already in your watchlist.');
            return;
        }
        localStorage.setItem(id, id);
        alert('Movie added to your watchlist!');
    }

    window.removeFromWatchlist = function (id) {
        localStorage.removeItem(id);
        alert('Movie removed from your watchlist.');
        showWatchlist(); 
    }
});
 