import './css/styles.css';
import ImagesApiService from './images-service';
import LoadMoreBtn from './load-more-btn';
import { searchFailure, searchSuccessful, endOfContent } from './notifications';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
    searchForm: document.querySelector('.search-form'),
    galleryContainer: document.querySelector('.gallery'),
}

const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '.load-more',
    hidden: true,
})

const gallery = new SimpleLightbox('.gallery a', { captionDelay: 250, captionsData: 'alt', captionPosition: 'bottom', animationSpeed: 250 });

const clearGalleryContainer = () => {
    refs.galleryContainer.innerHTML = '';
}

const smoothGalleryScroll = () => {
    const { height } = refs.galleryContainer.firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: height * 2,
        behavior: 'smooth',
    });
}

const createGalleryItemsMarkup = (images) => {
    const markup = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
        <div class="photo-card">
            <a href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="200" />
            </a>
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                    <span>${likes}</span>
                </p>
                <p class="info-item">
                    <b>Views</b>
                    <span>${views}</span>
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    <span>${comments}</span>
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    <span>${downloads}</span>
                </p>
            </div>
        </div>
        `
    }).join('');

    refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

const onImagesSearch = async (e) => {
    e.preventDefault();

    imagesApiService.query = e.currentTarget.elements.searchQuery.value;

    imagesApiService.resetPage();
    imagesApiService.resetLoadedHits();
    clearGalleryContainer();
    loadMoreBtn.hide();

    if (imagesApiService.query === '') {
        return searchFailure();
    }

    const data = await imagesApiService.fetchImages();

    if (data.hits.length === 0) {
        return searchFailure();
    }

    loadMoreBtn.show();

    imagesApiService.incrementLoadedHits(data.hits);
    createGalleryItemsMarkup(data.hits);
    searchSuccessful(data.totalHits);

    gallery.refresh();
}

const onLoadMoreImages = async (e) => {
    const data = await imagesApiService.fetchImages();

    imagesApiService.incrementLoadedHits(data.hits);

    if (data.totalHits === imagesApiService.loadedHits) {
        loadMoreBtn.hide();
        return endOfContent();
    }

    createGalleryItemsMarkup(data.hits);
    smoothGalleryScroll();
    gallery.refresh();
}

refs.searchForm.addEventListener('submit', onImagesSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreImages);