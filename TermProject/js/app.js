$(document).ready(function () {
  const apiKey = 'ec09c60445eaa509d0fbf586e3218851';
  let moviesData = []; // Store fetched movies
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || []; // Load watchlist from localStorage

  // Handle the form submit to search for movies
  $('#searchForm').on('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    const query = $('#movieTitle').val().trim();
    if (!query) {
      alert('Please enter a movie title.');
      return;
    }

    $.ajax({
      url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
      method: 'GET',
      success: function (data) {
        if (data.results.length) {
          moviesData = data.results;
          displayResults(moviesData); // Show the results when first fetched
        } else {
          $('#results').html('<p>No results found.</p>');
        }
      },
      error: function (err) {
        console.error('Error fetching data:', err);
      }
    });
  });

  // Function to display the results
  function displayResults(movies) {
    const resultsHtml = movies
      .map((movie) => `
        <div class="movie" data-id="${movie.id}">
          <h3>${movie.title} (${movie.release_date.substring(0, 4)})</h3>
          <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
          <button class="add-to-watchlist" data-id="${movie.id}">Add to Watchlist</button>
          <button class="view-details" data-id="${movie.id}">View Details</button>
        </div>
      `)
      .join('');
    $('#results').html(resultsHtml);
  }

  // Event listener for adding movie to watchlist
  $('#results').on('click', '.add-to-watchlist', function () {
    const movieId = $(this).data('id');
    const movie = moviesData.find(m => m.id === movieId);
    if (!watchlist.some(m => m.id === movieId)) {
      watchlist.push(movie); // Add movie to watchlist
      localStorage.setItem('watchlist', JSON.stringify(watchlist)); // Save to localStorage
      alert(`${movie.title} added to watchlist!`);
    } else {
      alert('This movie is already in your watchlist.');
    }
  });

  // Event listener for viewing movie details
  $('#results').on('click', '.view-details', function () {
    const movieId = $(this).data('id');
    const movie = moviesData.find(m => m.id === movieId);
    
    // Fetch detailed movie information
    $.ajax({
      url: `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`,
      method: 'GET',
      success: function (movieDetails) {
        displayMovieDetails(movieDetails);
      },
      error: function (err) {
        console.error('Error fetching movie details:', err);
      }
    });
  });

  // Function to display detailed movie information
  function displayMovieDetails(movie) {
    const movieHtml = `
      <h3>${movie.title} (${movie.release_date.substring(0, 4)})</h3>
      <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
      <p><strong>Overview:</strong> ${movie.overview}</p>
      <p><strong>Release Date:</strong> ${movie.release_date}</p>
      <p><strong>IMDB Rating:</strong> ${movie.vote_average}</p>
      <p><strong>Genres:</strong> ${movie.genres.map(genre => genre.name).join(', ')}</p>
      <p><strong>Language:</strong> ${movie.original_language.toUpperCase()}</p>
    `;
    $('#movie-info').html(movieHtml);
    $('#movie-details').show(); // Show the movie details section
    $('#results').hide(); // Hide the search results section
  }

  // Function to display watchlist
  function displayWatchlist() {
    const watchlistHtml = watchlist
      .map((movie) => `
        <div class="movie" data-id="${movie.id}">
          <h3>${movie.title} (${movie.release_date.substring(0, 4)})</h3>
          <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
        </div>
      `)
      .join('');
    $('#watchlist').html(watchlistHtml);
  }

  // Event listener for Watchlist button
  $('#watchlist-btn').on('click', function () {
    $('#watchlist-section').toggle(); // Toggle visibility of watchlist section
    displayWatchlist(); // Display watchlist when button is clicked
  });

  // Event listener for genre filter change
  $('#genre-filter').on('change', function () {
    const selectedGenre = $(this).val();
    filterByGenre(selectedGenre); // Apply genre filter dynamically
  });

  // Function to filter movies by genre
  function filterByGenre(genre) {
    if (genre === 'All') {
      displayResults(moviesData); // Show all movies if 'All' is selected
    } else {
      const filteredMovies = moviesData.filter(movie => {
        return movie.genre_ids && movie.genre_ids.includes(genre); // Filter movies by genre
      });
      displayResults(filteredMovies); // Update the displayed list with filtered results
    }
  }
});
