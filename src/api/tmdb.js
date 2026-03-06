import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '8e4ff896f6345ec4188bb3d7efcfd239'; // Using a common demo key if not provided

export const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getTrendingMovies = () => tmdbClient.get('/trending/movie/day');
export const getPopularMovies = () => tmdbClient.get('/movie/popular');
export const getTopRatedMovies = () => tmdbClient.get('/movie/top_rated');
export const searchMovies = (query) => tmdbClient.get('/search/movie', { params: { query } });
export const getMovieDetails = (id) => tmdbClient.get(`/movie/${id}`);
export const getMovieVideos = (id) => tmdbClient.get(`/movie/${id}/videos`);
export const getMovieRecommendations = (id) => tmdbClient.get(`/movie/${id}/recommendations`);
export const getActorDetails = (id) => tmdbClient.get(`/person/${id}`);
export const getActorCredits = (id) => tmdbClient.get(`/person/${id}/movie_credits`);
