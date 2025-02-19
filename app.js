let API_KEY = "43358014" // Replace with your OMDB API key
const movieGrid = document.getElementById("movieGrid")

// Sample popular movies (in a real app, you'd get this from an API)
const popularMovies = [
  "tt0111161", // The Shawshank Redemption
  "tt0068646", // The Godfather
  "tt0071562", // The Godfather: Part II
  "tt0468569", // The Dark Knight
  "tt0050083", // 12 Angry Men
  "tt0108052", // Schindler's List
]

// Fetch movie details from OMDB API
async function fetchMovie(imdbID) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching movie:", error)
    return null
  }
}

// Create movie card
function createMovieCard(movie) {
  const card = document.createElement("div")
  card.className = "movie-card"
  card.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
        <div class="movie-info">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        </div>
    `
  card.addEventListener("click", () => {
    window.location.href = `movie-details.html?id=${movie.imdbID}`
  })
  return card
}

// Load popular movies
async function loadPopularMovies() {
  movieGrid.innerHTML = ""
  for (const imdbID of popularMovies) {
    const movie = await fetchMovie(imdbID)
    if (movie) {
      const card = createMovieCard(movie)
      movieGrid.appendChild(card)
    }
  }
}

// Fetch movies by genre
async function fetchMoviesByGenre(genre) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?s=${genre}&type=movie&apikey=${API_KEY}`)
    const data = await response.json()
    return data.Search || []
  } catch (error) {
    console.error(`Error fetching ${genre} movies:`, error)
    return []
  }
}

// Load genre-specific movies
async function loadGenreMovies(genre, gridId) {
  const grid = document.getElementById(gridId)
  const movies = await fetchMoviesByGenre(genre)

  grid.innerHTML = movies
    .slice(0, 6)
    .map((movie) => {
      return `
            <div class="movie-card" onclick="window.location.href='movie-details.html?id=${movie.imdbID}'">
                <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
                <div class="movie-info">
                    <h3>${movie.Title}</h3>
                    <p>${movie.Year}</p>
                </div>
            </div>
        `
    })
    .join("")
}

// Load all genre sections
async function loadGenreSections() {
  await loadGenreMovies("action", "actionGrid")
  await loadGenreMovies("comedy", "comedyGrid")
  await loadGenreMovies("drama", "dramaGrid")
}

// Initial load
loadPopularMovies()
loadGenreSections()

