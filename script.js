const API_URL = "https://api.themoviedb.org/3/search/movie";
const API_TOKEN = "";

const trendingMovies = document.querySelector("#trending-movies");
const upcomingMovies = document.querySelector("#upcoming-movies");
const searchResultsSection = document.querySelector("#search-results-section");

const trendingBtn = document.querySelector("#trending-btn");
const upcomingBtn = document.querySelector("#upcoming-btn");
const homeBtn = document.querySelector("#home-btn");

const movieDetails = document.querySelector("#movie-details");
const movieDetailsContent = document.querySelector("#movie-details-content");
const closeDetails = document.querySelector("#close-details");

searchResultsSection.style.display = "none";
async function searchMovies(query) {

    searchResultsSection.style.display = "block";

    movieContainer.innerHTML = "<p>Loading movies...</p>";

    searchInput.value= "";


    try {
        const response = await fetch(
            `${API_URL}?query=${encodeURIComponent(query)}`,
            {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        const data = await response.json();

if (data.results.length === 0) {
    movieContainer.innerHTML = "<p>No movies found.</p>";
    return;
}

renderMovies(data.results,movieContainer);

    } catch (error) {
        movieContainer.innerHTML = "<p>Something went wrong. Please try again.</p>";
    }
}

const movieContainer = document.querySelector("#movie-container");
const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");

searchButton.addEventListener("click", function() {

    const searchText = searchInput.value.trim();

    if (searchText === "") {
        return;
    }

    searchMovies(searchText);

});



function renderMovies(movies,container) {

    container.innerHTML = "";

    movies.forEach(function(movie) {

        const card = document.createElement("div");

        card.classList.add("movie-card");

        card.dataset.movieId = movie.id;

        card.addEventListener("click", function() {

    const movieId = card.dataset.movieId;

    getMovieDetails(movieId);


});

        card.innerHTML = `
            <img 
                src="${movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'https://via.placeholder.com/300x400?text=No+Poster'}"
                alt="${movie.title}"
            >
            <h2>${movie.title}</h2>
            <p>Release Year: ${movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}</p>
<p>Rating: ⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>
        `;

        container.append(card);
    });
}




async function getTrendingMovies(){

    trendingMovies.innerHTML = "<p>Loading trending movies...</p>";
    
    try{

    const response = await fetch("https://api.themoviedb.org/3/trending/movie/week", {
        headers:{
            Authorization: `Bearer ${API_TOKEN}`
        }
    });

    if (!response.ok) {
    throw new Error("Something went wrong!");
}

    const data = await response.json();

    renderMovies(data.results,trendingMovies);
}catch(error){ 
    console.error(error);
    trendingMovies.innerHTML = "<p>Something went wrong. Please try again.</p>";



}
}
getTrendingMovies();

async function getUpcomingMovies() {

    upcomingMovies.innerHTML = "<p>Loading upcoming movies...</p>";

    try{

    const response = await fetch("https://api.themoviedb.org/3/movie/upcoming",
        {
            headers:{
                Authorization: `Bearer ${API_TOKEN}`
            }
        }
    )

    if(!response.ok){
        throw new Error("something went wrong!");
    }
    
    const data = await response.json();
    renderMovies(data.results,upcomingMovies);
    
}
    catch(error){
    console.error(error);
    upcomingMovies.innerHTML = "<p>Something went wrong. Please try again.</p>";

}
}

getUpcomingMovies();

trendingBtn.addEventListener("click", function() {

    trendingMovies.scrollIntoView({
    behavior: "smooth"
});

});

upcomingBtn.addEventListener("click", function(){

    upcomingMovies.scrollIntoView({
        behavior: "smooth"
    })
})

homeBtn.addEventListener("click", function() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});
searchInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        const searchText = searchInput.value.trim();

        if (searchText === "") {
            return;
        }

        searchMovies(searchText);
    }

});

async function getMovieDetails(movieId) {

    movieDetails.style.display = "flex";

    movieDetailsContent.innerHTML="<p>Loading Movie Details....</p>";

    try{

    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    });

    if(!response.ok){
        throw new Error("Something went wrong");
    }

    const data = await response.json();

    movieDetailsContent.innerHTML = `
    <img 
        src="https://image.tmdb.org/t/p/w500${data.poster_path}" 
        alt="${data.title}"
    >

    <div>
        <h2>${data.title}</h2>

        <p>Genres: ${data.genres.map(function(genre) {
        return genre.name;
        }).join(", ")}</p>

        <p>${data.tagline || ""}</p>

        <p>⭐ ${data.vote_average.toFixed(1)}</p>

        <p>Release Year: ${data.release_date 
            ? data.release_date.slice(0, 4) 
            : "N/A"}</p>

        <p>Runtime: ${data.runtime} minutes</p>

        <p>${data.overview}</p>
    </div>
`;

        }catch(error){
            console.error(error);
            movieDetailsContent.innerHTML="<p>Something went wrong</p>";
        }
}

closeDetails.addEventListener("click",function(){
    movieDetails.style.display = "none";
})