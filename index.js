"use strict";

const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const moviesGrid = document.querySelector("#moviesGrid");
const resultsInfo = document.querySelector("#resultsInfo");

if (searchForm && searchInput && sortSelect && moviesGrid) {
  const movieCards = Array.from(moviesGrid.querySelectorAll(".movie-card"));
  let searchTerm = "";

  function updateMovies() {
    const visibleMovies = movieCards.filter((card) => {
      const title = card.querySelector(".movie-card__title")?.textContent ?? "";
      return title.toLowerCase().includes(searchTerm);
    });

    const sortOrder = sortSelect.value;
    visibleMovies.sort((first, second) => {
      const firstTitle =
        first.querySelector(".movie-card__title")?.textContent.trim() ?? "";
      const secondTitle =
        second.querySelector(".movie-card__title")?.textContent.trim() ?? "";
      const firstYear = Number(
        first.querySelector(".movie-card__year")?.textContent,
      );
      const secondYear = Number(
        second.querySelector(".movie-card__year")?.textContent,
      );

      if (sortOrder === "a-z") return firstTitle.localeCompare(secondTitle);
      if (sortOrder === "z-a") return secondTitle.localeCompare(firstTitle);
      if (sortOrder === "newest") return secondYear - firstYear;
      if (sortOrder === "oldest") return firstYear - secondYear;
      return movieCards.indexOf(first) - movieCards.indexOf(second);
    });

    movieCards.forEach((card) => {
      card.hidden = !visibleMovies.includes(card);
    });
    visibleMovies.forEach((card) => moviesGrid.append(card));

    if (resultsInfo) {
      const label = searchTerm
        ? `Showing: ${searchInput.value.trim()}`
        : "Showing: All movies";
      resultsInfo.textContent = `${label} (${visibleMovies.length})`;
    }
  }

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchTerm = searchInput.value.trim().toLowerCase();
    updateMovies();
  });

  sortSelect.addEventListener("change", updateMovies);
}
