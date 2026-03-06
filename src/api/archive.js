import axios from 'axios';

/**
 * Internet Archive API — 100% free, no key, fully embeddable public domain movies.
 * Embed URL: https://archive.org/embed/{identifier}?autoplay=1
 * Thumbnail:  https://archive.org/services/img/{identifier}
 */
const ARCHIVE_BASE = 'https://archive.org';

export const archiveClient = axios.create({ baseURL: ARCHIVE_BASE });

/**
 * Search Archive.org for freely playable movies by collection.
 * Available collections:
 *   SciFi_Horror  — Sci-Fi / Horror (970+ films)
 *   Comedy_Films  — Comedies
 *   silent_films  — Silent era films (Charlie Chaplin, Buster Keaton…)
 *   feature_films — General feature films (27,000+)
 *   classic_tv    — Classic TV shows
 */
export const searchArchiveMovies = ({ collection = 'feature_films', rows = 20, page = 1, query = '' } = {}) => {
  const q = query
    ? `(${query})+mediatype:movies`
    : `collection:${collection}+mediatype:movies`;

  return archiveClient.get('/advancedsearch.php', {
    params: {
      q,
      fl: 'identifier,title,description,year,creator',
      output: 'json',
      rows,
      page,
    },
  });
};

export const getArchiveFilmsByCollection = (collection, rows = 20) =>
  searchArchiveMovies({ collection, rows });

export const searchArchiveByQuery = (query, rows = 20) =>
  searchArchiveMovies({ query, rows });

/** Returns the embeddable iframe src for a given identifier */
export const getArchiveEmbedUrl = (identifier) =>
  `${ARCHIVE_BASE}/embed/${identifier}?autoplay=1`;

/** Thumbnail image for a given identifier */
export const getArchiveThumbnail = (identifier) =>
  `${ARCHIVE_BASE}/services/img/${identifier}`;
