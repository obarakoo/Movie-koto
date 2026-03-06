import axios from 'axios';

const TVMAZE_BASE_URL = 'https://api.tvmaze.com';

export const tvmazeClient = axios.create({
  baseURL: TVMAZE_BASE_URL,
});

// Since TVMaze doesn't have explicitly trending/popular movies endpoints without a key, 
// we fetch different pages of all shows (which are sorted roughly by popularity in their internal ID structure or we just randomize pages)
// To keep it simple and fast, we will grab page 1 for Trending, page 2 for Popular, page 3 for Top Rated.
export const getTrendingShows = () => tvmazeClient.get('/shows?page=0');
export const getPopularShows = () => tvmazeClient.get('/shows?page=1');
export const getTopRatedShows = () => tvmazeClient.get('/shows?page=2');
export const searchShows = (query) => tvmazeClient.get('/search/shows', { params: { q: query } });
export const getShowDetails = (id) => tvmazeClient.get(`/shows/${id}`);
export const getShowCast = (id) => tvmazeClient.get(`/shows/${id}/cast`);
export const getShowImages = (id) => tvmazeClient.get(`/shows/${id}/images`);
