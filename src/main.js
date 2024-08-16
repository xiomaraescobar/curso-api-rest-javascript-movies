// Uso de Axios para las peticiones
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    Headers: {
        'content-type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
    },
});

// Utils o Reutilizables

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
        }
    });
});

function createMovies(container, movies,  {lazyLoad = false, clean = true} = {}) {
    if (clean) {
        container.innerHTML = "";
    }
    movies.forEach(movie => {
        // creando variable para el selector de Movie
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        })

        // Creando variable y atributos de la imagen
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title)
        movieImg.setAttribute(lazyLoad ? 'data-img' : 'src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute(
                'src',
                'https://as1.ftcdn.net/v2/jpg/02/99/61/74/1000_F_299617487_fPJ8v9Onthhzwnp4ftILrtSGKs1JCrbh.jpg',
            )
        });
        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    })
};

function createCategories(container, categories) {
    container.innerHTML = "";
    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}

// Llamados a la Api (Peticiones)
async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    createMovies(trendingMoviesPreviewList, movies, {lazyLoad: true, clean: true})
}

async function getCategoryPreview() {
    const { data } = await api('genre/movie/list');
    const categories = data.genres;
    createCategories(categoriesPreviewList, categories)
}

async function getMoviesByCategory(id) {
    const { data } = await api('discover/movie', {
        params: {
            'with_genres': id,
        },
    });
    const movies = data.results;
    maxPage = data.total_pages;
    createMovies(genericSection, movies, {lazyLoad: true});
}

function getPaginatedByCategory (id) {
    return async function () {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = numberPage <= maxPage;
    if (scrollIsBottom && pageIsNotMax) {
        numberPage++;
        const { data } = await api('discover/movie', {
            params: {
                'with_genres': id,
                'page': numberPage,
            },
        });
        const movies = data.results;
        createMovies(genericSection, movies, {lazyLoad: true, clean: false})
    }
    }
}

async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
        params: {
            'query': query,
        },
    });
    const movies = data.results;
    maxPage = data.total_pages;
    createMovies(genericSection, movies);
}

function getPaginatedBySearch (query) {
    return async function () {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = numberPage <= maxPage;
    if (scrollIsBottom && pageIsNotMax) {
        numberPage++;
        const { data } = await api('search/movie', {
            params: {
                'query': query,
                'page': numberPage,
            },
        });
        const movies = data.results;
        createMovies(genericSection, movies, {lazyLoad: true, clean: false})
    }
    }
}

async function getTrendingMovies() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;
    createMovies(genericSection, movies, {lazyLoad: true, clean: true})

    //const btnLoadMore = document.createElement('button');
    //btnLoadMore.innerText = "Cargar Más";
    //btnLoadMore.addEventListener('click',  getPaginatedTrendingMovies);
    //genericSection.appendChild(btnLoadMore)

}

async function getPaginatedTrendingMovies() {
    numberPage++;
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

    const pageIsNotMax = numberPage < maxPage;
    if (scrollIsBottom && pageIsNotMax) {
        const { data } = await api('trending/movie/day', {
            params: {
                'page': numberPage,
            },
        });
        const movies = data.results;
        createMovies(genericSection, movies, {lazyLoad: true, clean: false})
    }

    //const btnLoadMore = document.createElement('button');
    //btnLoadMore.innerText = "Cargar Más";
    ////btnLoadMore.addEventListener('click', getPaginatedTrendingMovies)
    //genericSection.appendChild(btnLoadMore)
}

async function getMovieById(id) {
    const { data: movie } = await api('movie/' + id);
    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    // Gradient y fondo de imagen para detalle.
    headerSection.style.background = `
    linear-gradient(
    180deg,
    rgba(0,0,0,0.35)19.27%,
    rgba(0,0,0,0)29.17%),
    url(${movieImgUrl})`
    // aca se llena la informacion de detalle de peliculas.
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;
    createCategories(movieDetailCategoriesList, movie.genres);
    getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id) {
    const { data } = await api(`movie/${id}/similar`);
    const relatedMovies = data.results;
    createMovies(relatedMoviesContainer, relatedMovies)
}