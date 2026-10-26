const API_KEY = "29f106ec";
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const moviesGrid = document.querySelector("#moviesGrid");
const resultsInfo = document.querySelector("#resultsInfo");

let currentMovies = [];
const SPINNER_MIN_SEC = 2;

// Event listeners for search and sort functionality //

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    fetchMovies(searchTerm);
  }
});

// Show spinner while loading //
function showSpinner() {
  moviesGrid.innerHTML = `<div class="spinner" role="status" aria-label="Loading"></div>`;
}

// Fetch movies from the API //

async function fetchMovies(searchTerm) {
  showSpinner();
  try {
    const [response] = await Promise.all([
      fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`),
      new Promise((resolve) => setTimeout(resolve, SPINNER_MIN_SEC * 1000)),
    ]);
    const data = await response.json();
    if (data.Response === "True") {
      currentMovies = data.Search;
      resultsInfo.textContent = `Showing: ${searchTerm}`;
      sortSelect.value = "default";
      displayMovies(currentMovies);
    } else {
      resultsInfo.textContent = `Showing: ${searchTerm}`;
      moviesGrid.innerHTML = "<p>No movies found.</p>";
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    moviesGrid.innerHTML = "<p>Error fetching movies.</p>";
    currentMovies = [];
  }
}

//Display movies//

function displayMovies(movies) {
  const movieResults = movies
    .map((movie) => {
      const poster = movie.Poster !== "N/A" ? movie.Poster : "";

      return `
    <div class="movie-card">
    ${poster ? `<img class="movie-card__img" src="${poster}" alt="${movie.Title}">` : `<div class="movie-card__poster-placeholder">Not Available</div>`}
     <h2 class="movie-card__title">${movie.Title}</h2>
     <p class="movie-card__year">${movie.Year}</p>
     </div> 
    
  `;
    })
    .join("");

  moviesGrid.innerHTML = movieResults;

  // Swap broken poster URLs for the placeholder
  moviesGrid.querySelectorAll(".movie-card__img").forEach((img) => {
    img.addEventListener("error", () => {
      const placeholder = document.createElement("div");
      placeholder.className = "movie-card__poster-placeholder";
      placeholder.textContent = "Not Available";
      img.replaceWith(placeholder);
    });
  });
}

//Sort Movies//

sortSelect.addEventListener("change", (event) => {
  sortMovies(event.target.value);
});

function sortMovies(sortType) {
  let sortedMovies = [...currentMovies];
  if (sortType === "a-z") {
    sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortType === "z-a") {
    sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
  } else if (sortType === "newest") {
    sortedMovies.sort((a, b) => Number(b.Year) - Number(a.Year));
  } else if (sortType === "oldest") {
    sortedMovies.sort((a, b) => Number(a.Year) - Number(b.Year));
  }
  displayMovies(sortedMovies);
}

// Load the default results so sorting has data before the first search
fetchMovies("Marvel");
