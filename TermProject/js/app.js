$(document).ready(function () {
  const apiKey = 'ec09c60445eaa509d0fbf586e3218851'; // Your TMDb API Key
  let moviesData = []; // Store fetched movies
  let allGenres = [];  // Store all genre data
  let watchlist = [];  // Store watchlist movies

  // Fetch genres from TMDb to populate genre filter dropdown
  $.ajax({
    url: `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`,
    method: 'GET',
    success: function (data) {
      allGenres = data.genres;
      const genreOptions = allGenres.map(genre => `<option value="${genre.name}">${genre.name}</option>`).join('');
      $('#genre-filter').html(`<option value="All">All</option>${genreOptions}`);
    },
    error: function (err) {
      console.error('Error fetching genres:', err);
    }
  });

  // Handle the form submit to search for movies
  $('#searchForm').on('submit', function (e) {
    e.preventDefault();
    const query = $('#movieTitle').val().trim();
    if (!query) {
      alert('Please enter a movie title.');
      return;
    }
    $.ajax({
      url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
      method: 'GET',
      success: function (data) {
        if (data.results && data.results.length > 0) {
          moviesData = data.results;
          displayResults(moviesData);
        } else {
          $('#results').html('<p>No results found.</p>');
        }
      },
      error: function (err) {
        console.error('Error fetching data:', err);
      }
    });
  });

  // Function to display the results in grid layout
  function displayResults(movies) {
    const resultsHtml = movies.map(movie => {
      const genres = movie.genre_ids.map(id => {
        const genre = allGenres.find(g => g.id === id);
        return genre ? genre.name : 'Unknown';
      }).join(', ');

      const imdbRating = movie.vote_average || 'Not Available';

      const isInWatchlist = watchlist.some(w => w.id === movie.id);
      const watchlistButtonText = isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist';

      return `
        <div class="movie" data-id="${movie.id}">
          <div class="movie-poster">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
          </div>
          <h3>${movie.title} (${movie.release_date ? movie.release_date.substring(0, 4) : 'Unknown'})</h3>
          <p>Genre: ${genres}</p>
          <p>IMDb Rating: ${imdbRating}</p>
          <button class="watchlist-btn" data-id="${movie.id}">${watchlistButtonText}</button>
        </div>
      `;
    }).join('');
    $('#results').html(resultsHtml);
  }

  // Add/Remove movies from watchlist
  $(document).on('click', '.watchlist-btn', function () {
    const movieId = $(this).data('id');
    const movie = moviesData.find(m => m.id === movieId);
    if (!movie) return;

    const index = watchlist.findIndex(w => w.id === movie.id);
    if (index > -1) {
      watchlist.splice(index, 1); // Remove from watchlist
    } else {
      watchlist.push(movie); // Add to watchlist
    }
    displayResults(moviesData); // Refresh movie list
    displayWatchlist(); // Refresh watchlist
  });

  // Display watchlist in grid layout
  function displayWatchlist() {
    if (watchlist.length === 0) {
      $('#watchlist').html('<p>Your watchlist is currently empty. Add movies to your watchlist to see them here!</p>');
    } else {
      const watchlistHtml = watchlist.map(movie => `
        <div class="movie">
          <div class="movie-poster">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
          </div>
          <h3>${movie.title} (${movie.release_date ? movie.release_date.substring(0, 4) : 'Unknown'})</h3>
          <p>IMDb Rating: ${movie.vote_average || 'Not Available'}</p>
          <button class="remove-watchlist-btn" data-id="${movie.id}">Remove from Watchlist</button>
        </div>
      `).join('');
      $('#watchlist').html(watchlistHtml);
    }
  }

  // Remove movie from watchlist
  $(document).on('click', '.remove-watchlist-btn', function () {
    const movieId = $(this).data('id');
    watchlist = watchlist.filter(movie => movie.id !== movieId);
    displayWatchlist(); // Refresh the watchlist after removal
    displayResults(moviesData); // Refresh movie list to update button text
  });

  // Toggle between movie results and watchlist view
  $('#watchlist-toggle').on('click', function () {
    const isWatchlistVisible = $('#watchlist-section').is(':visible');
    if (isWatchlistVisible) {
      $('#results').show(); // Show search results
      $('#watchlist-section').hide(); // Hide watchlist
      $('#watchlist-toggle').text('Show Watchlist');
    } else {
      $('#results').hide(); // Hide search results
      $('#watchlist-section').show(); // Show watchlist
      $('#watchlist-toggle').text('Back to Search');
    }
  });

  // Event listener for genre filter change
  $('#genre-filter').on('change', function () {
    const selectedGenre = $(this).val();
    filterByGenre(selectedGenre);
  });

  // Function to filter movies by genre dynamically
  function filterByGenre(genre) {
    if (genre === 'All') {
      displayResults(moviesData);
    } else {
      const filteredMovies = moviesData.filter(movie => {
        const genres = movie.genre_ids.map(id => {
          const genre = allGenres.find(g => g.id === id);
          return genre ? genre.name : 'Unknown';
        });
        return genres.includes(genre);
      });
      displayResults(filteredMovies);
    }
  }

  // Event listener for sort options change
  $('#sort-options').on('change', function () {
    const sortOrder = $(this).val();
    if (sortOrder.includes('rating')) {
      sortByRating(sortOrder);
    } else if (sortOrder.includes('year')) {
      sortByYear(sortOrder);
    }
  });

  // Sort movies by rating
  function sortByRating(order) {
    const sortedMovies = [...moviesData].sort((a, b) => {
      if (order === 'rating-asc') {
        return a.vote_average - b.vote_average;
      } else if (order === 'rating-desc') {
        return b.vote_average - a.vote_average;
      }
    });
    displayResults(sortedMovies);
  }

  // Sort movies by year
  function sortByYear(order) {
    const sortedMovies = [...moviesData].sort((a, b) => {
      const yearA = new Date(a.release_date).getFullYear();
      const yearB = new Date(b.release_date).getFullYear();
      if (order === 'year-asc') {
        return yearA - yearB;
      } else if (order === 'year-desc') {
        return yearB - yearA;
      }
    });
    displayResults(sortedMovies);
  }
});
