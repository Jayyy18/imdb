let API_KEY = '43358014';
const suggestionsGrid = document.getElementById('suggestionsGrid');
const suggestBtn = document.getElementById('suggestBtn');

async function getSuggestions() {
    const genre = document.getElementById('genre').value;
    const [startYear, endYear] = document.getElementById('year').value.split(',');
    
    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${genre}&type=movie&y=${startYear}&apikey=${API_KEY}`);
        const data = await response.json();
        
        if (data.Search) {
            suggestionsGrid.innerHTML = data.Search
                .slice(0, 8)
                .map(movie => `
                    <div class="movie-card" onclick="window.location.href='movie-details.html?id=${movie.imdbID}'">
                        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
                        <div class="movie-info">
                            <h3>${movie.Title}</h3>
                            <p>${movie.Year}</p>
                        </div>
                    </div>
                `).join('');
        } else {
            suggestionsGrid.innerHTML = '<p>No movies found matching your preferences</p>';
        }
    } catch (error) {
        console.error('Error getting suggestions:', error);
        suggestionsGrid.innerHTML = '<p>'
        console.error('Error getting suggestions:', error);
        suggestionsGrid.innerHTML = '<p>Error loading suggestions</p>';
    }
}

suggestBtn.addEventListener('click', getSuggestions);

// Load initial suggestions
getSuggestions();

