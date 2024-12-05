$(document).ready(function () {
  const apiKey = '58fac940';
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
      url: `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
      method: 'GET',
      success: function (data) {
        if (data.Response === 'True') {
          moviesData = data.Search;
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
        <div class="movie" data-id="${movie.imdbID}">
          <h3>${movie.Title} (${movie.Year})</h3>
          <img src="${movie.Poster}" alt="${movie.Title}">
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
        return movie.Genre && movie.Genre.split(', ').includes(genre); // Check if genre matches
      });
      displayResults(filteredMovies); // Update the displayed list with filtered results
    }
  }

  // Function to sort movies by IMDb rating
  function sortByRating(order) {
    const sortedMovies = moviesData.sort((a, b) => {
      const ratingA = parseFloat(a.imdbRating) || 0;
      const ratingB = parseFloat(b.imdbRating) || 0;
      return order === 'desc' ? ratingB - ratingA : ratingA - ratingB;
    });
    displayResults(sortedMovies); // Update displayed list with sorted results
  }

  // Function to sort movies by year
  function sortByYear(order) {
    const sortedMovies = moviesData.sort((a, b) => {
      const yearA = parseInt(a.Year);
      const yearB = parseInt(b.Year);
      return order === 'desc' ? yearB - yearA : yearA - yearB;
    });
    displayResults(sortedMovies); // Update displayed list with sorted results
  }

  // Event listener for genre filter change
  $('#genre-filter').on('change', function () {
    const selectedGenre = $(this).val();
    filterByGenre(selectedGenre); // Apply genre filter dynamically
  });

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
