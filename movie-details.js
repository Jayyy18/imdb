let API_KEY = "43358014"
let currentMovieId = ""

// Get movie ID from URL parameters
const urlParams = new URLSearchParams(window.location.search)
const movieId = urlParams.get("id")

// Initialize watchlist from localStorage
const watchlist = JSON.parse(localStorage.getItem("watchlist")) || []

async function loadMovieDetails() {
  try {
    const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${API_KEY}&plot=full`)
    const movie = await response.json()

    // Update page content
    document.title = `${movie.Title} - MovieDB`

    // Set backdrop
    document.querySelector(".movie-backdrop").style.backgroundImage =
      `url(${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"})`

    // Set poster
    document.querySelector(".movie-poster").innerHTML =
      `<img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">`

    // Set movie info
    document.querySelector(".movie-title").textContent = movie.Title
    document.querySelector(".release-date").textContent = movie.Year
    document.querySelector(".runtime").textContent = movie.Runtime
    document.querySelector(".genre").textContent = movie.Genre
    document.querySelector(".plot").textContent = movie.Plot
    document.querySelector(".rating-value").textContent = `${movie.imdbRating}/10`

    // Update watchlist button
    updateWatchlistButton(movie.imdbID)

    // Load cast information
    loadCastInfo(movie.Actors)

    // Load similar movies based on genre
    loadSimilarMovies(movie.Genre.split(",")[0].trim())

    currentMovieId = movie.imdbID
  } catch (error) {
    console.error("Error loading movie details:", error)
  }
}

function loadCastInfo(actorsString) {
  const actors = actorsString.split(",").map((actor) => actor.trim())
  const castList = document.querySelector(".cast-list")
  castList.innerHTML = actors
    .map(
      (actor) => `
        <div class="cast-member">
            <img src="placeholder-actor.jpg" alt="${actor}">
            <h4>${actor}</h4>
        </div>
    `,
    )
    .join("")
}

async function loadSimilarMovies(genre) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?s=${genre}&type=movie&apikey=${API_KEY}`)
    const data = await response.json()

    if (data.Search) {
      const similarMoviesGrid = document.getElementById("similarMoviesGrid")
      similarMoviesGrid.innerHTML = data.Search.filter((movie) => movie.imdbID !== currentMovieId)
        .slice(0, 6)
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
        .join("")
    }
  } catch (error) {
    console.error("Error loading similar movies:", error)
  }
}

// Rating System
const stars = document.querySelectorAll(".stars i")
stars.forEach((star) => {
  star.addEventListener("mouseover", function () {
    const rating = this.dataset.rating
    highlightStars(rating)
  })

  star.addEventListener("click", function () {
    const rating = this.dataset.rating
    saveRating(currentMovieId, rating)
    highlightStars(rating)
  })
})

document.querySelector(".stars").addEventListener("mouseleave", () => {
  const savedRating = localStorage.getItem(`rating_${currentMovieId}`)
  highlightStars(savedRating || 0)
})

function highlightStars(rating) {
  stars.forEach((star) => {
    star.classList.toggle("active", star.dataset.rating <= rating)
  })
}

function saveRating(movieId, rating) {
  localStorage.setItem(`rating_${movieId}`, rating)
}

// Watchlist functionality
function updateWatchlistButton(movieId) {
  const watchlistBtn = document.querySelector(".watchlist-btn")
  const isInWatchlist = watchlist.includes(movieId)

  watchlistBtn.innerHTML = isInWatchlist
    ? '<i class="fas fa-check"></i> In Watchlist'
    : '<i class="fas fa-plus"></i> Add to Watchlist'

  watchlistBtn.onclick = () => toggleWatchlist(movieId)
}

function toggleWatchlist(movieId) {
  const index = watchlist.indexOf(movieId)
  if (index === -1) {
    watchlist.push(movieId)
  } else {
    watchlist.splice(index, 1)
  }
  localStorage.setItem("watchlist", JSON.stringify(watchlist))
  updateWatchlistButton(movieId)
}

// Load movie details when page loads
if (movieId) {
  loadMovieDetails()
}

