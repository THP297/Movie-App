
import { create_movie_frame, DefinePoster, IMG_URL } from "./common_func.js"

export function PUSH(id) {
    const API_KEY = '?api_key=846f16d2846b863d9986bcc6dbb1b6c2'
    const BASE_URL = 'https://api.themoviedb.org/3/discover/movie'
    const GENRES = document.querySelector('.genre-frame')
    const hashmap = {}

    function Push_genre_movie_poster(data) {
        data.results.forEach(movie => {
            movie.genre_ids.forEach(genre_id => {
                if (!hashmap[genre_id]) {
                    hashmap[genre_id] = [movie];
                } else {
                    hashmap[genre_id].push(movie);
                }
            });
        });
    }

    async function get_genre_movie(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            Push_genre_movie_poster(data);
        } catch (error) {
            console.log(error);
        }
    }

    function get_genre_movie_url() {
        const promises = []
        for (let i = 1; i <= 500; i++) {
            var page = "&page=" + String(i)
            let url = BASE_URL + API_KEY + page;
            promises.push(get_genre_movie(url));
        }
        return Promise.all(promises)
    }

    const spinner = document.querySelector("#spinner");
    spinner.style.display = "block";

    get_genre_movie_url().then((res) => {
        spinner.style.display = "none";
        const movie_genre_id = Number(id)
        const movie_genre = hashmap[movie_genre_id]
        const page_length=  Math.ceil(movie_genre.length/18)
        const input_page = document.querySelector("#input-page")
        input_page.setAttribute("placeholder", ".../" + String(page_length))
        console.log(input_page.value)
        let currentPage = 1;
        const totalPages = 3;
        const slicePage = document.querySelector('.slice-page');
        const rangeButtonPage = document.querySelector('#range-button-page')
        const firstButton = document.querySelector('#first-button')
        firstButton.innerHTML = '1';

        const lastButton = document.querySelector('#last-button')
        lastButton.innerHTML = page_length;

        const prevButton = document.querySelector('#prev-button');
        prevButton.innerHTML = 'Prev';
        prevButton.disabled = true; // disable the previous button on page 1

        const nextButton = document.querySelector('#next-button');
        nextButton.innerHTML = 'Next';

        function updatePage(currentPage) {
            const start = (currentPage - 1) * 18;
            const end = currentPage * 18;
            const movies_per_page = movie_genre.slice(start, end);
            GENRES.innerHTML = ""
            movies_per_page.forEach(movie => {
                const movieCol = create_movie_frame(movie);
                GENRES.appendChild(movieCol);
            });
        }


        function updateButtons(page) {
            if (page >= 3) {
                firstButton.setAttribute("style", "opacity: 1;")
            } else {
                firstButton.setAttribute("style", "opacity: 0;")
            }
            if (page > 1) {
                prevButton.disabled = false
            } else {
                prevButton.disabled = true
            }

            while (rangeButtonPage.firstChild) {
                rangeButtonPage.removeChild(rangeButtonPage.firstChild);
            }
            for (let i = page; i <= page + 2; i++) {
                const pageButton = document.createElement('button');
                pageButton.innerHTML = i;
                pageButton.id = i;
                if (activeButtonId === i) {
                    pageButton.classList.add("active")
                }
                pageButton.addEventListener('click', () => {
                    activeButtonId = i;
                    updatePageButtons(activeButtonId);
                    updatePage(activeButtonId);
                });
                rangeButtonPage.appendChild(pageButton);
            }
        }

        let activeButtonId = 1;
        function updatePageButtons(currentPage) {
            if (currentPage <= (movie_genre.length / 18) - 2) {
                updateButtons(currentPage)
            } else {
                updateButtons(page_length - 2)
            }
        }


        input_page.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                activeButtonId = Number(input_page.value)
                if (activeButtonId > page_length){
                    activeButtonId = page_length
                }
                updatePageButtons(activeButtonId);
                updatePage(activeButtonId);
                input_page.value = ''
            }
        });


        nextButton.addEventListener('click', () => {
            activeButtonId++;
            updatePageButtons(activeButtonId);
            updatePage(activeButtonId);
        })

        firstButton.addEventListener('click', () => {
            activeButtonId = 1
            updatePageButtons(1);
            updatePage(1);
        })

        lastButton.addEventListener('click', () => {
            activeButtonId = page_length
            updatePageButtons(activeButtonId);
            updatePage(activeButtonId);
        })

        prevButton.addEventListener('click', () => {
            activeButtonId--;
            updatePageButtons(activeButtonId);
            updatePage(activeButtonId);
        })

        updatePage(currentPage);
        updatePageButtons(currentPage);

        slicePage.classList.add("inline");
        prevButton.classList.add("inline");
        nextButton.classList.add("inline");
        rangeButtonPage.classList.add("inline");

    }).catch(err => {
        spinner.style.display = "none";
        console.log(err)
    });
}


let genres = {
    "genres": [
        { "id": 28, "name": "Action" },
        { "id": 12, "name": "Adventure" },
        { "id": 16, "name": "Animation" },
        { "id": 35, "name": "Comedy" },
        { "id": 80, "name": "Crime" },
        { "id": 99, "name": "Documentary" },
        { "id": 18, "name": "Drama" },
        { "id": 10751, "name": "Family" },
        { "id": 14, "name": "Fantasy" },
        { "id": 36, "name": "History" },
        { "id": 27, "name": "Horror" },
        { "id": 10402, "name": "Music" },
        { "id": 9648, "name": "Mystery" },
        { "id": 10749, "name": "Romance" },
        { "id": 878, "name": "Science Fiction" },
        { "id": 10770, "name": "TV Movie" },
        { "id": 53, "name": "Thriller" },
        { "id": 10752, "name": "War" },
        { "id": 37, "name": "Western" }]
}

function setup_GENRES() {
    var genres_item = document.querySelector('.list-group')
    genres['genres'].forEach(element => {
        var item = document.createElement('a')
        item.setAttribute('class', 'category');
        item.setAttribute('href', "#");
        item.setAttribute('id', element.id)
        item.innerHTML = element.name;
        genres_item.appendChild(item);
    })
}

function send_genre(id) {
    fetch('genres.html').then(res => res.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html')
            const root_content = document.querySelector('.display-content');
            const genres_content = doc.querySelector('.display-content');
            root_content.innerHTML = genres_content.innerHTML;
            PUSH(id);
        })
}

function GENRE_BUTTON_effect() {
    const items = document.querySelectorAll('.category');
    items.forEach(item => {
        item.addEventListener('click', e => {
            send_genre(e.target.id);
        });
    });
}


export { genres, setup_GENRES, GENRE_BUTTON_effect, send_genre };

