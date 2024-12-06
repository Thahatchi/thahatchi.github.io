$(document).ready(function () {
  const watchlist = [];

  // Handle movie search
  $('#searchForm').on('submit', function (e) {
    e.preventDefault();
    const query = $('#movieTitle').val();
    searchMovies(query);
  });

  // Search for movies (dummy example)
  function searchMovies(query) {
    // Dummy API response simulation
    const dummyMovies = [
      { id: 1, title: "Movie 1", poster: "https://via.placeholder.com/150", year: 2021 },
      { id: 2, title: "Movie 2", poster: "https://via.placeholder.com/150", year: 2022 },
    ];

    displayMovies(dummyMovies);
  }

  // Display search results
  function displayMovies(movies) {
    const resultsContainer = $('#results');
    resultsContainer.empty();
    movies.forEach(movie => {
      const movieCard = $(`
        <div class="movie-card">
          <img src="${movie.poster}" alt="${movie.title}">
          <h3>${movie.title}</h3>
          <p>Year: ${movie.year}</p>
          <button class="add-to-watchlist" data-id="${movie.id}" data-title="${movie.title}" data-poster="${movie.poster}">Add to Watchlist</button>
        </div>
      `);
      resultsContainer.append(movieCard);
    });
  }

  // Handle Add to Watchlist
  $(document).on('click', '.add-to-watchlist', function () {
    const movieId = $(this).data('id');
    const movieTitle = $(this).data('title');
    const moviePoster = $(this).data('poster');

    if (!watchlist.some(movie => movie.id === movieId)) {
      watchlist.push({ id: movieId, title: movieTitle, poster: moviePoster });
      updateWatchlist();
    } else {
      alert("Movie is already in your watchlist!");
    }
  });

  // Update Watchlist
  function updateWatchlist() {
    const watchlistContainer = $('#watchlist');
    watchlistContainer.empty();
    if (watchlist.length === 0) {
      watchlistContainer.html('<p>Your watchlist is currently empty. Add movies to your watchlist to see them here!</p>');
    } else {
      watchlist.forEach(movie => {
        const watchlistItem = $(`
          <div class="movie-card">
            <img src="${movie.poster}" alt="${movie.title}">
            <h3>${movie.title}</h3>
          </div>
        `);
        watchlistContainer.append(watchlistItem);
      });
    }
  }

  // Toggle Watchlist Visibility
  $('#view-watchlist').on('click', function () {
    $('#watchlist-section').toggle();
  });
});
