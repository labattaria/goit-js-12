import axios from 'axios';

const API_KEY = '40880396-2ac3a1856acce5324e359bc4e';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImagesApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.loadedHits = 0;
    }

    async fetchImages() {
        const searchParams = new URLSearchParams({
            key: API_KEY,
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: this.page,
            per_page: 40,
        });

        const url = `${BASE_URL}?${searchParams}`;

        try {
            const response = await axios.get(url);
            this.incrementPage();

            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    incrementLoadedHits(hits) {
        this.loadedHits += hits;
    }

    resetLoadedHits() {
        this.loadedHits = 0;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newSearchQuery) {
        this.searchQuery = newSearchQuery;
    }
} 

