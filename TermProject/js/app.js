$(document).ready(function () {
  const apiKey = '58fac940';

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
          displayResults(data.Search);
        } else {
          $('#results').html('<p>No results found.</p>');
        }
      },
      error: function (err) {
        console.error('Error fetching data:', err);
      }
    });
  });

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
});
