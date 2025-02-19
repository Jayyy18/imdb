let API_KEY = "43358014"
const watchlistGrid = document.getElementById("watchlistGrid")

async function loadWatchlist() {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || []
  watchlistGrid.innerHTML = ""

  for (const movieId of watchlist) {
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${API_KEY}`)
      const movie = await response.json()

      const card = document.createElement("div")
      card.className = "movie-card"
      card.innerHTML = `
                <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
                <div class="movie-info">
                    <h3>${movie.Title}</h3>
                    <p>${movie.Year}</p>
                    <button class="remove-btn" onclick="removeFromWatchlist('${movieId}')">
                        <i class="fas fa-times"></i> Remove
                    </button>
                </div>
            `
      watchlistGrid.appendChild(card)
    } catch (error) {
      console.error("Error loading watchlist movie:", error)
    }
  }

  if (watchlist.length === 0) {
    watchlistGrid.innerHTML = '<p class="empty-watchlist">Your watchlist is empty</p>'
  }
}

function removeFromWatchlist(movieId) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []
  watchlist = watchlist.filter((id) => id !== movieId)
  localStorage.setItem("watchlist", JSON.stringify(watchlist))
  loadWatchlist()
}

// Load watchlist when page loads
loadWatchlist()

