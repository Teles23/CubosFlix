const head = document.querySelector("head");
const input = document.querySelector("input");
const btnTheme = document.querySelector(".btn-theme");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");
const containerRight = document.querySelector(".header__container-right");

let page = 0;
let response = "";

btnTheme.addEventListener("click", () => {
  changeTheme();
});
btnNext.addEventListener("click", () => {
  if (page >= 12) {
    page = 0;
    cards();
    return;
  }
  page += 6;
  cards();
});
btnPrev.addEventListener("click", () => {
  if (page <= 0) {
    page = 12;
    cards();
    return;
  }
  page -= 6;
  cards();
});
input.addEventListener("keypress", async (event) => {
  if (event.key == "Enter") {
    if (input.value.trim().length !== 0) {
      response = await api.get(
        `/search/movie?language=pt-BR&include_adult=false&query=${input.value}`
      );
      cards();
      input.value = "";
      return;
    }
    loadMovies();
  }
});

function changeTheme() {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = "css/theme-dark.css";
  head.appendChild(link);
  btnNext.src = "assets/arrow-right-light.svg";
  btnPrev.src = "assets/arrow-left-light.svg";
  btnTheme.style.display = "none";

  const img = document.createElement("img");
  img.src = "./assets/dark-mode.svg";
  img.classList.add("btn-theme");
  containerRight.appendChild(img);

  img.addEventListener("click", () => {
    btnTheme.style.display = "block";
    btnNext.src = "assets/arrow-right-dark.svg";
    btnPrev.src = "assets/arrow-left-dark.svg";
    containerRight.removeChild(img);

    head.removeChild(link);
  });
}

async function loadMovies() {
  response = await api.get(
    "/discover/movie?language=pt-BR&include_adult=false"
  );
  cards();
}
loadMovies();

async function loadDay() {
  const highLightVideo = document.querySelector(".highlight__video");
  const highLightTitle = document.querySelector(".highlight__title");
  const highLightRating = document.querySelector(".highlight__rating");
  const highLightGenres = document.querySelector(".highlight__genres");
  const highLightLaunch = document.querySelector(".highlight__launch");
  const highLightDescription = document.querySelector(
    ".highlight__description"
  );
  const response = await api.get("/movie/436969?language=pt-BR");

  try {
    let nameGener = "";
    let text = [];
    const dados = response.data;
    const data = new Date(dados.release_date).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });

    const namesGeners = dados.genres;
    namesGeners.forEach((element) => {
      nameGener = element.name;
      text.push(nameGener);
    });
    const genre = text.join(", ");

    highLightVideo.style.backgroundImage = `url(${dados.backdrop_path})`;
    highLightVideo.style.backgroundSize = "cover";
    highLightTitle.textContent = dados.title;
    highLightRating.textContent = dados.vote_average;
    highLightGenres.textContent = genre;
    highLightLaunch.textContent = data;
    highLightDescription.textContent = dados.overview;
  } catch (error) {
    alert(error.response.data);
  }
  const video = await api.get("/movie/436969/videos?language=pt-BR");
  try {
    const a = document.querySelector(".highlight__video-link");
    const url = video.data.results[0].key;

    a.href = `https://www.youtube.com/watch?v=${url}`;
  } catch (error) {
    alert(error.video.data);
  }
}
loadDay();

async function modal1(id) {
  const movie = document.querySelector(".modal");
  const modalImg = document.querySelector(".modal__img");
  const modalTitle = document.querySelector(".modal__title");
  const description = document.querySelector(".modal__description");
  const textModal = document.querySelector(".modal__average");
  const close = document.querySelector(".modal__close");
  const genres = document.querySelector(".modal__genres");

  const response = await api.get(`/movie/${id}?language=pt-BR`);
  const dados = response.data;

  modalImg.src = dados.backdrop_path;
  modalTitle.textContent = dados.title;
  description.textContent = dados.overview;
  textModal.textContent = dados.vote_average;

  const names = response.data.genres;

  names.forEach((element) => {
    let genre = document.createElement("span");
    genre.classList.add(".modal__genre");
    genre.textContent = `${element.name}`;
    genres.appendChild(genre);
  });

  close.addEventListener("click", () => {
    movie.classList.add("hidden");
    wipeData();
  });
  movie.addEventListener("click", () => {
    movie.classList.add("hidden");
    wipeData();
  });
  function wipeData() {
    genres.innerHTML = "";
    modalImg.src = "";
    modalTitle.textContent = "";
    description.textContent = "";
    textModal.textContent = "";
  }
}

function cards() {
  const movies = document.querySelector(".movies");
  try {
    const todosFilmes = response.data.results;
    const filmes = todosFilmes.slice(0, 18);

    movies.innerHTML = "";
    filmes.slice(page, page + 6).forEach((element) => {
      const movie = document.createElement("div");
      const movieInfo = document.createElement("div");
      const movieTitle = document.createElement("span");
      const movieRating = document.createElement("span");
      const modal = document.querySelector(".modal");

      movie.classList.add("movie");
      movieInfo.classList.add("movie__info");
      movieTitle.classList.add("movie__title");
      movieTitle.textContent = element.title;
      movieRating.classList.add("movie__rating");
      movieRating.textContent = element.vote_average;
      movie.style.backgroundImage = `url(${element.poster_path})`;
      movieInfo.appendChild(movieTitle);
      movieInfo.appendChild(movieRating);
      movie.appendChild(movieInfo);
      movies.appendChild(movie);
      movie.addEventListener("click", (event) => {
        event.stopPropagation();
        modal1(element.id);
        modal.classList.remove("hidden");
      });
    });
  } catch (error) {
    alert(error.response.data);
  }
}
