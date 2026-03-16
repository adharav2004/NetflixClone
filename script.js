const API_KEY = "f5505b4df64251606e36eaab626a5f05";

const imgBase = "https://image.tmdb.org/t/p/w500";

const trendingURL =
`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;

const popularURL =
`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

const searchURL =
`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;


let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

let selectedMovie = null;



// LOAD MOVIES
async function loadMovies(url, containerId){

try{

const res = await fetch(url);
const data = await res.json();

const container = document.getElementById(containerId);

container.innerHTML="";

data.results.forEach(movie=>{

if(!movie.poster_path) return;

const div = document.createElement("div");

div.className="movie-card col-6 col-md-3 col-lg-2";

div.innerHTML=`
<img src="${imgBase + movie.poster_path}" class="img-fluid">

<div class="mt-2 d-flex gap-1">

<button class="btn btn-danger btn-sm playBtn">
Play
</button>

<button class="btn btn-secondary btn-sm infoBtn">
Info
</button>

</div>
`;

div.querySelector(".playBtn").onclick =
()=>playTrailer(movie.id);

div.querySelector(".infoBtn").onclick =
()=>showDetails(movie);

container.appendChild(div);

});

}catch(err){

console.error("Movie load error",err);

}

}



// PLAY TRAILER
async function playTrailer(movieId){

const res = await fetch(
`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
);

const data = await res.json();

const trailer = data.results.find(
v=>v.type==="Trailer"
);

if(trailer){

document.getElementById("trailerFrame").src=
`https://www.youtube.com/embed/${trailer.key}?autoplay=1`;

new bootstrap.Modal(
document.getElementById("trailerModal")
).show();

}

}



// HERO AUTO TRAILER
async function loadHeroTrailer(){

const res = await fetch(trendingURL);

const data = await res.json();

const movie =
data.results[
Math.floor(Math.random()*data.results.length)
];

const trailerRes = await fetch(
`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`
);

const trailerData = await trailerRes.json();

const trailer =
trailerData.results.find(v=>v.type==="Trailer");

if(trailer){

document.getElementById("heroTrailer").src=
`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`;

}

}



// MOVIE DETAILS
function showDetails(movie){

selectedMovie = movie;

document.getElementById("detailTitle").innerText =
movie.title;

document.getElementById("detailOverview").innerText =
movie.overview || "No description available.";

document.getElementById("detailRating").innerText =
"⭐ Rating: " + movie.vote_average;

document.getElementById("detailDate").innerText =
"Release Date: " + movie.release_date;

new bootstrap.Modal(
document.getElementById("movieDetailsModal")
).show();

}



// ADD TO WATCHLIST
document
.getElementById("addWatchlist")
.onclick=function(){

if(!selectedMovie) return;

if(!watchlist.find(m=>m.id===selectedMovie.id)){

watchlist.push(selectedMovie);

localStorage.setItem(
"watchlist",
JSON.stringify(watchlist)
);

alert("Added to My List");

}else{

alert("Already in your list");

}

};



// SEARCH MOVIES
async function searchMovies(){

const query =
document.getElementById("searchInput")
.value.trim();

if(query===""){

loadMovies(trendingURL,"trending");
loadMovies(popularURL,"popular");

return;

}

const res = await fetch(
searchURL + encodeURIComponent(query)
);

const data = await res.json();

const container =
document.getElementById("popular");

container.innerHTML="";

data.results.forEach(movie=>{

if(!movie.poster_path) return;

const div=document.createElement("div");

div.className="movie-card col-6 col-md-3 col-lg-2";

div.innerHTML=`
<img src="${imgBase + movie.poster_path}" class="img-fluid">
`;

div.onclick=()=>playTrailer(movie.id);

container.appendChild(div);

});

}



// SEARCH BUTTON
document
.getElementById("searchBtn")
.onclick = searchMovies;



// ENTER KEY SEARCH
document
.getElementById("searchInput")
.addEventListener("keypress",function(e){

if(e.key==="Enter"){

searchMovies();

}

});



// RANDOM MOVIE
document
.getElementById("playRandom")
.onclick = async ()=>{

const res = await fetch(popularURL);

const data = await res.json();

const movie =
data.results[
Math.floor(Math.random()*data.results.length)
];

playTrailer(movie.id);

};



// INITIAL LOAD
loadMovies(trendingURL,"trending");

loadMovies(popularURL,"popular");

loadHeroTrailer();