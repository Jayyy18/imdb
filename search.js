// let API_KEY = "43358014"
const searchInput = document.getElementById("searchInput")
const searchButton = document.getElementById("searchButton")

// Search movies
async function searchMovies(query) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`)
    const data = await response.json()
    return data.Search || []
  } catch (error) {
    console.error("Error searching movies:", error)
    return []
  }
}

// Handle search
async function handleSearch() {
  const query = searchInput.value.trim()
  if (query) {
    const movies = await searchMovies(query)
    displaySearchResults(movies)
  }
}

// Display search results
function displaySearchResults(movies) {
  const resultsContainer = document.createElement("div")
  resultsContainer.className = "search-results"
  resultsContainer.innerHTML = `
        <h2>Search Results</h2>
        <div class="movie-grid">
            ${movies
              .map(
                (movie) => `
                <div class="movie-card" onclick="window.location.href='movie-details.html?id=${movie.imdbID}'">
                    <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
                    <div class="movie-info">
                        <h3>${movie.Title}</h3>
                        <p>${movie.Year}</p>
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>
    `

  // Remove any existing search results
  const existingResults = document.querySelector(".search-results")
  if (existingResults) {
    existingResults.remove()
  }

  // Insert the new results after the navbar
  const navbar = document.querySelector(".navbar")
  navbar.parentNode.insertBefore(resultsContainer, navbar.nextSibling)
}

// Event listeners
searchButton.addEventListener("click", handleSearch)
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch()
  }
})

