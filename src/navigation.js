let numberPage = 1;
let maxPage;
let infiniteScroll;

searchFormBtn.addEventListener('click', 
    //location.hash = '#search=' + searchFormInput.value;
    e => searchFormInput.value !== "" ? location.hash = 'search=' + searchFormInput.value  : e.preventDefault()
);

trendingBtn.addEventListener('click', () => location.hash = '#trends');

arrowBtn.addEventListener('click', () => {
    // function click para boton de atras.
    history.back();
    //location.hash = '#home';
});

// Aca se esta pendiente de cuando la pagina cargue para la navegacion.
window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, {passive: false});


function navigator() {
    // Desactivamos el evento del scroll.
    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll,{passive: false});
        infiniteScroll = undefined;
    }
    // Validaciones de navegacion.
    location.hash.startsWith('#trends') ? trendsPage() :
        location.hash.startsWith('#search=') ? searchPage() :
            location.hash.startsWith('#movie=') ? movieDetailsPage() :
                location.hash.startsWith('#category=') ? categoryPage() :
                    homePage()

                    // Se reinician valores para que el scroll siempre inicie desde la posicion 0.
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    
                    // activamos el evento scroll siempre y cuando alla una navegacion y 
                    // se use una function declarada en el main.js
                    if (infiniteScroll) {
                        window.addEventListener('scroll', infiniteScroll,{passive: false});
                    }
                    numberPage = 1;
}

function trendsPage() {
    // Aca ocultamos o mostramos el HTML segun la vista.
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = "Tendencias"
    getTrendingMovies();

    infiniteScroll = getPaginatedTrendingMovies;

}

function searchPage() {
        // Aca ocultamos o mostramos el HTML segun la vista.
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // Realizamos la separacion de lo que escribe el usuario en el input para enviarlo como parametro de busqueda.
    const [_, searchValue] = location.hash.split('=');
    getMoviesBySearch(searchValue);

    infiniteScroll = getPaginatedBySearch(searchValue);

}

function movieDetailsPage() {
    headerSection.classList.add('header-container--long');
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    // Realizamos la separacion de el id para enviarlo como parametro para Detalle de peliculas

    const [_, idMovie] = location.hash.split('=');
    getMovieById(idMovie);
}

function categoryPage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // se realiza separacion de la ruta de navegacion y 2 campos que son el id y el nombre.
    // para ser separados de nuevo en la siguiente linea y poderlos usar.
    const [_, categoryData] = location.hash.split('=');
    // Se realiza separacion de id y nombre, en la primera linea por medio del -
    const [categoryId, categoryName] = categoryData.split('-');
    // Aca se le agrega el nombre a el HTML.
    headerCategoryTitle.innerHTML = categoryName;

    getMoviesByCategory(categoryId);

    infiniteScroll = getPaginatedByCategory(categoryId)
}

function homePage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    // Aca preguntamos si hay algun registro como Hijo del Array para no repetir solicitudes a la API.
    const childrenCategoriesPreview = Array.from(categoriesPreviewList.children);
    if(childrenCategoriesPreview.length){
        // llamamos a las funciones en caso de que sea diferente a 0.
        getTrendingMoviesPreview();
        getCategoryPreview();
    }
}
