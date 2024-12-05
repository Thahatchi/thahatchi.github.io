$(document).ready(function () {
  const apiKey = 'ec09c60445eaa509d0fbf586e3218851'; // Your new API key
  let moviesData = []; // Store fetched movies
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || []; // Get the watchlist from localStorage or start with an empty array

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
        if (data.results && data.results.length > 0) {
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
          <h3>${movie.title} (${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})</h3>
          <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
          <button class="add-to-watchlist" data-id="${movie.id}">Add to Watchlist</button>
        </div>
      `)
      .join('');
    $('#results').html(resultsHtml);

    // Bind event to "Add to Watchlist" button
    $('.add-to-watchlist').on('click', function () {
      const movieId = $(this).data('id');
      const movieToAdd = movies.find(movie => movie.id === movieId);
      addToWatchlist(movieToAdd);
    });
  }

  // Function to add a movie to the watchlist
  function addToWatchlist(movie) {
    if (!watchlist.some(item => item.id === movie.id)) { // Check if the movie is already in the watchlist
      watchlist.push(movie); // Add to the watchlist
      localStorage.setItem('watchlist', JSON.stringify(watchlist)); // Save to localStorage
      alert(`${movie.title} has been added to your watchlist!`);
    } else {
      alert(`${movie.title} is already in your watchlist.`);
    }
  }

  // Function to display the watchlist
  function displayWatchlist() {
    const watchlistHtml = watchlist
      .map((movie) => `
        <div class="movie" data-id="${movie.id}">
          <h3>${movie.title} (${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})</h3>
          <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
        </div>
      `)
      .join('');
    $('#watchlist').html(watchlistHtml); // You can display the watchlist anywhere in the HTML
  }

  // Display the watchlist on page load
  displayWatchlist();
});
