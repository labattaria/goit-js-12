import Notiflix from 'notiflix';

const searchFailure = () => {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}

const searchSuccessful = (totalHits) => {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

const endOfContent = () => {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}

export { searchFailure, searchSuccessful, endOfContent };