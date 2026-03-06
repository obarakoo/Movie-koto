import axios from 'axios';

/** Studio Ghibli API — no key needed */
const GHIBLI_BASE = 'https://ghibliapi.vercel.app';

export const ghibliClient = axios.create({ baseURL: GHIBLI_BASE });

export const getGhibliFilms = () => ghibliClient.get('/films');
export const getGhibliFilmById = (id) => ghibliClient.get(`/films/${id}`);
