// Variables
let watchlist = [];
let isViewingWatchlist = false;

// Function to fetch movies from API
async function fetchMovies(query) {
  const apiUrl = `https://www.omdbapi.com/?apikey=YOUR_API_KEY&s=${query}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.Search || [];
}

// Function to render search results
function renderResults(movies) {
  const resultsSection = document.getElementById("results");
  resultsSection.innerHTML = ""; // Clear previous results

  if (movies.length === 0) {
    resultsSection.innerHTML = `<p>No results found. Please try another search.</p>`;
    return;
  }

  const resultsContainer = document.createElement("div");
  resultsContainer.classList.add("movie-grid");

  movies.forEach(movie => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie");
    movieCard.innerHTML = `
      <img src="${movie.Poster}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <button class="add-watchlist" data-id="${movie.imdbID}" data-title="${movie.Title}" data-poster="${movie.Poster}">
        Add to Watchlist
      </button>
    `;
    resultsContainer.appendChild(movieCard);
  });

  resultsSection.appendChild(resultsContainer);

  // Attach event listeners to "Add to Watchlist" buttons
  const addButtons = document.querySelectorAll(".add-watchlist");
  addButtons.forEach(button => {
    button.addEventListener("click", event => {
      const movie = {
        imdbID: event.target.dataset.id,
        Title: event.target.dataset.title,
        Poster: event.target.dataset.poster,
      };
      addToWatchlist(movie);
    });
  });
}

// Function to add a movie to the watchlist
function addToWatchlist(movie) {
  if (!watchlist.find(item => item.imdbID === movie.imdbID)) {
    watchlist.push(movie);
    alert(`${movie.Title} has been added to your watchlist!`);
  } else {
    alert(`${movie.Title} is already in your watchlist.`);
  }
}

// Function to remove a movie from the watchlist
function removeFromWatchlist(imdbID) {
  watchlist = watchlist.filter(movie => movie.imdbID !== imdbID);
  alert("Movie removed from your watchlist.");
}

// Function to render the watchlist
function renderWatchlist() {
  const watchlistSection = document.getElementById("watchlist");
  watchlistSection.innerHTML = ""; // Clear previous content

  if (watchlist.length === 0) {
    watchlistSection.innerHTML = `<p>Your watchlist is empty. Use the search button to add movies!</p>`;
    return;
  }

  const watchlistContainer = document.createElement("div");
  watchlistContainer.classList.add("movie-grid");

  watchlist.forEach(movie => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie");
    movieCard.innerHTML = `
      <img src="${movie.Poster}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <button class="remove-watchlist" data-id="${movie.imdbID}">Remove</button>
    `;
    watchlistContainer.appendChild(movieCard);
  });

  watchlistSection.appendChild(watchlistContainer);

  // Attach event listeners to "Remove" buttons
  const removeButtons = document.querySelectorAll(".remove-watchlist");
  removeButtons.forEach(button => {
    button.addEventListener("click", event => {
      const movieId = event.target.dataset.id;
      removeFromWatchlist(movieId);
      renderWatchlist(); // Re-render after removal
    });
  });
}

// Event Listener for Search Form
document.getElementById("searchForm").addEventListener("submit", async event => {
  event.preventDefault();
  const query = document.getElementById("movieTitle").value.trim();
  if (query) {
    const movies = await fetchMovies(query);
    renderResults(movies);
  }
});

// Event Listener for "View Watchlist" Button
document.getElementById("view-watchlist").addEventListener("click", () => {
  const resultsSection = document.getElementById("results");
  const watchlistSection = document.getElementById("watchlist-section");
  const watchlistButton = document.getElementById("view-watchlist");

  if (isViewingWatchlist) {
    // Show search results and hide watchlist
    resultsSection.style.display = "block";
    watchlistSection.style.display = "none";
    watchlistButton.textContent = "View Watchlist";
    isViewingWatchlist = false;
  } else {
    // Show watchlist and hide search results
    resultsSection.style.display = "none";
    watchlistSection.style.display = "block";
    watchlistButton.textContent = "Back to Search Results";
    isViewingWatchlist = true;

    // Render the watchlist
    renderWatchlist();
  }
});
