$(document).ready(function () {
  const apiKey = 'ec09c60445eaa509d0fbf586e3218851'; // Your TMDB API key
  let moviesData = []; // Store fetched movies

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
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        </div>
      `)
      .join('');
    $('#results').html(resultsHtml);
  }

  // Function to filter movies by genre dynamically
  function filterByGenre(genre) {
    if (genre === 'All') {
      displayResults(moviesData); // Show all movies if 'All' is selected
    } else {
      const filteredMovies = moviesData.filter(movie => {
        return movie.genre_ids && movie.genre_ids.includes(parseInt(genre)); // Check if genre matches
      });
      displayResults(filteredMovies); // Update the displayed list with filtered results
    }
  }

  // Event listener for genre filter change
  $('#genre-filter').on('change', function () {
    const selectedGenre = $(this).val();
    filterByGenre(selectedGenre); // Apply genre filter dynamically
  });

  // Function to sort movies by IMDb rating
  function sortByRating(order) {
    const sortedMovies = moviesData.sort((a, b) => {
      const ratingA = a.vote_average || 0; // Vote average is the TMDB rating equivalent
      const ratingB = b.vote_average || 0;
      return order === 'desc' ? ratingB - ratingA : ratingA - ratingB;
    });
    displayResults(sortedMovies); // Update displayed list with sorted results
  }

  // Function to sort movies by year
  function sortByYear(order) {
    const sortedMovies = moviesData.sort((a, b) => {
      const yearA = parseInt(a.release_date.split('-')[0]);
      const yearB = parseInt(b.release_date.split('-')[0]);
      return order === 'desc' ? yearB - yearA : yearA - yearB;
    });
    displayResults(sortedMovies); // Update displayed list with sorted results
  }

  // Event listener for sort options change
  $('#sort-options').on('change', function () {
    const sortOrder = $(this).val();
    if (sortOrder.includes('rating')) {
      sortByRating(sortOrder.includes('desc') ? 'desc' : 'asc');
    } else if (sortOrder.includes('year')) {
      sortByYear(sortOrder.includes('desc') ? 'desc' : 'asc');
    }
  });
});
