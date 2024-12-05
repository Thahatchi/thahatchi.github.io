$(document).ready(function () {
  const apiKey = 'ec09c60445eaa509d0fbf586e3218851'; // Your TMDb API Key
  let moviesData = []; // Store fetched movies
  const genreMap = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };

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
      .map((movie) => {
        // Map genres using the genreMap and get the vote_average for IMDb-like rating
        const genres = movie.genre_ids.map(id => genreMap[id] || 'Unknown').join(', ');
        const imdbRating = movie.vote_average || 'Not Available';

        return `
          <div class="movie" data-id="${movie.id}">
            <h3>${movie.title} (${movie.release_date ? movie.release_date.substring(0, 4) : 'Unknown'})</h3>
            <p>Genre: ${genres}</p>
            <p>IMDb Rating: ${imdbRating}</p>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
          </div>
        `;
      })
      .join('');
    $('#results').html(resultsHtml);
  }

  // Function to filter movies by genre dynamically
  function filterByGenre(genre) {
    if (genre === 'All') {
      displayResults(moviesData); // Show all movies if 'All' is selected
    } else {
      const filteredMovies = moviesData.filter(movie => {
        const genres = movie.genre_ids.map(id => genreMap[id] || 'Unknown');
        return genres.includes(genre); // Check if genre matches
      });
      displayResults(filteredMovies); // Update the displayed list with filtered results
    }
  }

  // Function to sort movies by IMDb rating
  function sortByRating(order) {
    const sortedMovies = moviesData.sort((a, b) => {
      const ratingA = a.vote_average || 0;
      const ratingB = b.vote_average || 0;
      return order === 'desc' ? ratingB - ratingA : ratingA - ratingB;
    });
    displayResults(sortedMovies); // Update displayed list with sorted results
  }

  // Function to sort movies by year
  function sortByYear(order) {
    const sortedMovies = moviesData.sort((a, b) => {
      const yearA = a.release_date ? parseInt(a.release_date.substring(0, 4)) : 0;
      const yearB = b.release_date ? parseInt(b.release_date.substring(0, 4)) : 0;
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
