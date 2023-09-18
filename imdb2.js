const apiKey = "1078c43f";

const searchInput = document.getElementById("search");
const result = document.getElementById("result");
const myFavorite = document.getElementById("myFavorite");
const favoriteButton = document.getElementById("favorite");
const favoriteMovie = [];
const movieDetails = [];

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim();
  //onst searchTerm = "jawan";
  if (searchTerm !== "") {
    searchMovies(searchTerm);
  } else {
    result.innerHTML = "";
  }
});

function searchMovies(e) {
  fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${e}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.Search) {
        //console.log(data.Search);
        dispalyMovies(data.Search);
      } else {
        result.innerHTML = "<li>No results found</li>";
      }
    })
    .catch((error) => console.error(error));
}

function dispalyMovies(movies) {
  result.innerHTML = "";
  myFavorite.innerHTML = "";
  movies.forEach((movie) => {
    const movieList = createMovieList(movie);
    result.appendChild(movieList);
  });
}

function createMovieList(movie) {
  const movieList = document.createElement("div");
  movieList.classList.add("movieList");

  const imdbID = movie.imdbID;

  const isAlreadyFavorite = favoriteMovie.some(
    (favorite) => favorite.imdbID === imdbID
  );
  if (isAlreadyFavorite) {
    movieList.innerHTML = `
                <h3><a href="#">${movie.Title} (${movie.Year})</a></h3>
                <button /*onclick="findTheMovie('${movie.imdbID}')"*/ id="add-favorite-${movie.imdbID}">Favorite</button>
        `;
  } else {
    movieList.innerHTML = `
                <h3><a href="#" onclick="aboutTheMovie('${movie.imdbID}')">${movie.Title} (${movie.Year})</a></h3>
                <button onclick="findTheMovie('${movie.imdbID}')" id="add-favorite-${movie.imdbID}">Add to Favorites</button>
        `;
  }

  return movieList;
}

function findTheMovie(imdbID) {
  //console.log(imdbID);

  fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.Title) {
        const movieTitle = data.Title;
        //console.log(movieTitle);
        addToFavorites(movieTitle, imdbID);
      } else {
        console.error("Movie details not found.");
      }
    })
    .catch((error) => console.error("Error fetching movie details:", error));
}

function addToFavorites(movieName, imdbID) {
  const isAlreadyFavorite = favoriteMovie.some(
    (favorite) => favorite.imdbID === imdbID
  );
  if (!isAlreadyFavorite) {
    favoriteMovie.push({ movieName, imdbID });
    findMovieDetails(imdbID);
  }
  // console.log(favoriteMovie);
}

favoriteButton.addEventListener("click", () => {
  //e.preventDefault();

  if (favoriteMovie == "") {
    result.innerHTML = "";
    myFavorite.innerHTML = "";
    myFavorite.innerHTML = "<h2> No Movies Added <h2>";
  } else {
    result.innerHTML = "";
    myFavorite.innerHTML = "";
    //console.log(movieDetails);
    movieDetails.forEach(function (e) {
      const faveriotMovieList = document.createElement("div");
      faveriotMovieList.classList.add("faveriotMovieList");
      faveriotMovieList.innerHTML = `
                                            <h3>${e.movieName}</h3>
                                            <a href="#" onclick="aboutTheMovie('${e.imdbID}')"><img src="${e.posterURL}"></a>
                                            <button id="remove-favorite-${e.imdbID}" type="submit">Remove Favorite</button>
                                                            `;
      myFavorite.appendChild(faveriotMovieList);
      const removeButton = document.getElementById(
        `remove-favorite-${e.imdbID}`
      );
      removeButton.addEventListener("click", function () {
        removeFavorite(e.imdbID);
      });
    });
  }
});

function findMovieDetails(imdbID) {
  if (imdbID != "") {
    // console.log(imdbID)
    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.Title) {
          movieDetails.push({
            imdbID: data.imdbID,
            movieName: data.Title,
            posterURL: data.Poster,
          });
        } else {
          console.error("Movie details not found.");
        }
      })
      .catch((error) => console.error("Error fetching movie details:", error));
  }
}

function removeFavorite(imdbID) {
  //   console.log("removed");
  //   console.log(favoriteMovie);

  const index = favoriteMovie.findIndex(
    (favorite) => favorite.imdbID === imdbID
  );
  //   console.log(index);
  if (index !== -1) {
    const removedMovie = favoriteMovie.splice(index, 1, []);
    const temp = [];
    movieDetails.forEach((movie) => {
      temp.push(movie.movieName);
    });
    const removedItem = removedMovie[0].movieName;
    const indexItem = temp.indexOf(removedItem);
    movieDetails.splice(indexItem, 1);

    const removedMovieDetails = document.querySelector(
      `#remove-favorite-${imdbID}`
    ).parentElement;
    removedMovieDetails.remove();
    // console.log(movieDetails);
    
  }
}

function aboutTheMovie(imdbID) {
  result.innerHTML = "";
  myFavorite.innerHTML = "";
  const aboutMovieDiv = document.createElement("div");
  aboutMovieDiv.classList.add("aboutMovie");

  const isAlreadyFavorite = favoriteMovie.some(
    (favorite) => favorite.imdbID === imdbID
  );

  if (imdbID != "") {
    // console.log(imdbID)
    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.Title) {
          //console.log(data.Genre);
          const aboutMovie = `
                <h2>${data.Title}</h2>
                <div> 
                    <p>${data.Year}</p>
                    <p>Rated: ${data.Rated}</p>
                    <p>Runtime: ${data.Runtime}</p>
                </div>
                <img src="${data.Poster}" alt="${data.Title} Poster id="poster">
                <p id= "plot"> ${data.Plot}</p>
            `
          aboutMovieDiv.innerHTML = aboutMovie;
          myFavorite.appendChild(aboutMovieDiv);
        } else {
          console.error("Movie details not found.");
        }
      })
      .catch((error) => console.error("Error fetching movie details:", error));
  }
}
