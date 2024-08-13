searchFormBtn.addEventListener('click', 
    //location.hash = '#search=' + searchFormInput.value;
    e => searchFormInput.value !== "" ? location.hash = 'search=' + searchFormInput.value  : e.preventDefault()
);

trendingBtn.addEventListener('click', () => location.hash = '#trends');

arrowBtn.addEventListener('click', () => {
    history.back();
    //location.hash = '#home';
});

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);


function navigator() {
    location.hash.startsWith('#trends') ? trendsPage() :
        location.hash.startsWith('#search=') ? searchPage() :
            location.hash.startsWith('#movie=') ? movieDetailsPage() :
                location.hash.startsWith('#category=') ? categoryPage() :
                    homePage()

                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
}

function trendsPage() {
    console.log("Trends!!");

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
}

function searchPage() {
    console.log("Search!!");

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

    const [_, searchValue] = location.hash.split('=');
    getMoviesBySearch(searchValue);
}

function movieDetailsPage() {
    console.log("Movie!!");
    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_, idMovie] = location.hash.split('=');
    getMovieById(idMovie);
}

function categoryPage() {
    console.log("Categories!!");
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

    const [_, categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');
    console.log(categoryId);
    getMoviesByCategory(categoryId);

    headerCategoryTitle.innerHTML = categoryName;
}

function homePage() {
    console.log("Home!!");

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

    const childrenCategoriesPreview = Array.from(categoriesPreviewList.children);
    if(!childrenCategoriesPreview.length){
        getTrendingMoviesPreview();
      getCategoryPreview();
    }
}
