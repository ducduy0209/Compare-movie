const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
        <img src="${imgSrc}" alt="" />
        ${movie.Title} (${movie.Year})
        `
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '78467055',
                s: searchTerm
            }
        });
        if (response.data.Error) return [];

        return response.data.Search;
    }
}

createAutoComplete({
    ...autoCompleteConfig,
    onSelectOption(movie) {
        const leftSummary = document.querySelector('#left-summary');
        onMovieSelect(movie, leftSummary, 'left');
    },
    root: document.querySelector('#left-autocomplete'),
})

createAutoComplete({
    ...autoCompleteConfig,
    onSelectOption(movie) {
        const rightSummary = document.querySelector('#right-summary');
        onMovieSelect(movie, rightSummary, 'right');

    },
    root: document.querySelector('#right-autocomplete'),
})

let leftMovie;
let rightMovie;
const onMovieSelect = async(movie, summaryElement, side) => {
    const res = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '78467055',
            i: movie.imdbID
        }
    })
    summaryElement.innerHTML = movieTemplate(res.data);

    if (side === 'left') {
        leftMovie = res.data;
    } else {
        rightMovie = res.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
}

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = leftStat.getAttribute('data-value');
        const rightSideValue = rightStat.getAttribute('data-value');

        if (leftSideValue > rightSideValue) {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        } else {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        }
    })
}

const movieTemplate = movieDetail => {
    const revenue = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metaScore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace('/,/g', ''));

    const awards = movieDetail.Awards.split(' ').reduce((pre, award) => {
        const value = parseInt(award);

        if (isNaN(value)) {
            return pre;
        } else {
            return pre + value;
        }
    }, 0)

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" alt="Poster" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${revenue} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metaScore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `
}