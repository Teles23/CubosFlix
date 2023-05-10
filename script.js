const input = document.querySelector("input");
const btnTheme = document.querySelector(".btn-theme");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");
const root = document.querySelector(":root");
const btnClose = document.querySelector(".modal__close");
const modal = document.querySelector(".modal");

let page = 0;
let response = "";

btnTheme.addEventListener("click", () => {
	const currentTheme = localStorage.getItem("theme");
	if (!currentTheme || currentTheme === "light") {
		localStorage.setItem("theme", "dark");
		changeTheme();
		return;
	}
	localStorage.setItem("theme", "light");
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
modal.addEventListener("click", () => {
	modal.classList.add("hidden");
	wipeData();
});
btnClose.addEventListener("click", (event) => {
	event.stopPropagation();
	modal.classList.add("hidden");
	wipeData();
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
			movieRating.classList.add("movie__rating");
			movieTitle.textContent = element.title;
			movieRating.textContent = element.vote_average;
			movie.style.backgroundImage = `url(${element.poster_path})`;
			movieInfo.append(movieTitle, movieRating);
			movie.appendChild(movieInfo);
			movies.appendChild(movie);
			movie.addEventListener("click", async () => {
				modal.classList.remove("hidden");
				await modal1(element.id);
			});
		});
	} catch (error) {
		alert(error.response.data);
	}
}
const modalImg = document.querySelector(".modal__img");
const modalTitle = document.querySelector(".modal__title");
const description = document.querySelector(".modal__description");
const textModal = document.querySelector(".modal__average");
const genres = document.querySelector(".modal__genres");

async function modal1(id) {
	const response = await api.get(`/movie/${id}?language=pt-BR`);
	const dados = response.data;

	modalImg.src = dados.backdrop_path;
	modalTitle.textContent = dados.title;
	description.textContent = dados.overview;
	textModal.textContent = dados.vote_average;

	const names = dados.genres;

	names.forEach((element) => {
		let genre = document.createElement("span");
		genre.classList.add("modal__genre");
		genre.textContent = `${element.name}`;
		genres.appendChild(genre);
	});
}
function wipeData() {
	genres.innerHTML = "";
	modalImg.src = "";
	modalTitle.textContent = "";
	description.textContent = "";
	textModal.textContent = "";
}
function changeTheme() {
	const currentTheme = localStorage.getItem("theme");
	if (!currentTheme || currentTheme === "light") {
		btnNext.src = "assets/arrow-right-dark.svg";
		btnPrev.src = "assets/arrow-left-dark.svg";
		btnTheme.src = "./assets/light-mode.svg";
		btnClose.src = "./assets/dark-close.svg";
		root.style.setProperty("--background", "#fff");
		root.style.setProperty("--text-color", "#1b2028");
		root.style.setProperty("--bg-secondary", "#ededed");
		root.style.setProperty("--bg-modal", "#ededed");
		input.style.backgroundColor = "";
		input.classList.remove("input-black");

		return;
	}
	btnNext.src = "assets/arrow-right-light.svg";
	btnPrev.src = "assets/arrow-left-light.svg";
	btnTheme.src = "./assets/dark-mode.svg";
	btnClose.src = "./assets/close.svg";
	root.style.setProperty("--background", "#1b2028");
	root.style.setProperty("--text-color", "#fff");
	root.style.setProperty("--bg-secondary", "#2d3440");
	root.style.setProperty("--bg-modal", "#fff");
	root.style.setProperty("--input-color", "#665F5F");
	input.style.backgroundColor = "#3e434d";
	input.classList.add("input-black");
}
