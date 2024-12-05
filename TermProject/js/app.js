$(document).ready(function () {
  const apiKey = '58fac940'; // Your OMDB API key

  // Search form submission
  $('#searchForm').on('submit', function (e) {
    e.preventDefault();
    const query = $('#movieTitle').val().trim();
    if (!query) return alert('Please enter a movie title.');

    $.ajax({
      url: `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
      method: 'GET',
      success: function (data) {
        if (data.Response === 'True') {
          displayResults(data.Search);
        } else {
          $('#results').html('<p>No results found.</p>');
        }
      },
    });
  });

  // Display search results
  function displayResults(movies) {
    const resultsHtml = movies
      .map(
        (movie) => `
      <div class="movie" data-id="${movie.imdbID}">
        <h3>${movie.Title} (${movie.Year})</h3>
        <img src="${movie.Poster}" alt="${movie.Title}">
      </div>
    `
      )
      .join('');
    $('#results').html(resultsHtml);

    // Add click event for details
    $('.movie').on('click', function () {
      const movieID = $(this).data('id');
      getMovieDetails(movieID);
    });
  }

  // Fetch movie details
  function getMovieDetails(movieID) {
    $.ajax({
      url: `https://www.omdbapi.com/?apikey=${apiKey}&i=${movieID}`,
      method: 'GET',
      success: function (movie) {
        const detailsHtml = `
          <h2>${movie.Title}</h2>
          <img src="${movie.Poster}" alt="${movie.Title}">
          <p>${movie.Plot}</p>
          <p>Released: ${movie.Released}</p>
          <p>Genre: ${movie.Genre}</p>
          <p>Director: ${movie.Director}</p>
        `;
        $('#details').html(detailsHtml);
      },
    });
  }
});
