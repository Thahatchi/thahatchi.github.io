// Variables to manage current state
let isViewingWatchlist = false;

// Function to handle the "View Watchlist" button click
document.getElementById("viewWatchlist").addEventListener("click", () => {
  const resultsSection = document.getElementById("results");
  const watchlistSection = document.getElementById("watchlist");
  const watchlistButton = document.getElementById("viewWatchlist");

  if (isViewingWatchlist) {
    // Switch back to search results view
    resultsSection.style.display = "flex"; // Show results
    watchlistSection.style.display = "none"; // Hide watchlist
    watchlistButton.textContent = "View Watchlist";
    isViewingWatchlist = false;
  } else {
    // Switch to watchlist view
    resultsSection.style.display = "none"; // Hide results
    watchlistSection.style.display = "flex"; // Show watchlist
    watchlistButton.textContent = "Back to Search Results";
    isViewingWatchlist = true;

    // Show friendly message if watchlist is empty
    if (watchlist.length === 0) {
      watchlistSection.innerHTML = `<p>Your watchlist is empty. Use the search button to add movies!</p>`;
    } else {
      renderWatchlist(); // Render watchlist if it has movies
    }
  }
});

// Updated renderWatchlist function to ensure proper styling and functionality
function renderWatchlist() {
  const watchlistSection = document.getElementById("watchlist");
  watchlistSection.innerHTML = ""; // Clear existing content

  if (watchlist.length === 0) {
    watchlistSection.innerHTML = `<p>Your watchlist is empty. Use the search button to add movies!</p>`;
    return;
  }

  const watchlistContainer = document.createElement("div");
  watchlistContainer.classList.add("movie-grid");

  watchlist.forEach(movie => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.innerHTML = `
      <img src="${movie.Poster}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <button class="remove-watchlist" data-id="${movie.imdbID}">Remove</button>
    `;
    watchlistContainer.appendChild(movieCard);
  });

  watchlistSection.appendChild(watchlistContainer);

  // Attach remove button event listeners
  const removeButtons = document.querySelectorAll(".remove-watchlist");
  removeButtons.forEach(button => {
    button.addEventListener("click", event => {
      const movieId = event.target.dataset.id;
      removeFromWatchlist(movieId);
      renderWatchlist(); // Re-render watchlist after removal
    });
  });
}
