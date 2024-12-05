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

  // Function to filter movies by genre
  function filterByGenre(genre) {
    return genre === 'All' ? moviesData : moviesData.filter(movie => movie.Genre && movie.Genre.includes(genre));
  }

  // Function to sort movies by rating
  function sortByRating(order) {
    return moviesData.sort((a, b) => {
      const ratingA = parseFloat(a.imdbRating) || 0;
      const ratingB = parseFloat(b.imdbRating) || 0;
      return order === 'desc' ? ratingB - ratingA : ratingA - ratingB;
    });
  }

  // Function to sort movies by year
  function sortByYear(order) {
    return moviesData.sort((a, b) => {
      const yearA = parseInt(a.Year);
      const yearB = parseInt(b.Year);
      return order === 'desc' ? yearB - yearA : yearA - yearB;
    });
  }

  // Event listener for genre filter change
  $('#genre-filter').on('change', function () {
    const selectedGenre = $(this).val();
    const filteredMovies = filterByGenre(selectedGenre);
    displayResults(filteredMovies);
  });

  // Event listener for sort options change
  $('#sort-options').on('change', function () {
    const sortOrder = $(this).val();
    let sortedMovies = [];
    if (sortOrder.includes('rating')) {
      sortedMovies = sortByRating(sortOrder.includes('desc') ? 'desc' : 'asc');
    } else if (sortOrder.includes('year')) {
      sortedMovies = sortByYear(sortOrder.includes('desc') ? 'desc' : 'asc');
    }
    displayResults(sortedMovies);
  });
});
