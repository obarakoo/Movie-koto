import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchShows, getTrendingShows } from '../api/tvmaze';
import MovieCard from '../components/MovieCard';

const GENRES = ['Drama', 'Comedy', 'Action', 'Crime', 'Thriller', 'Romance', 'Horror', 'Science-Fiction', 'Fantasy', 'Mystery', 'Adventure', 'Animation'];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [allShows, setAllShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const [activeGenre, setActiveGenre] = useState('All');

  // load default shows for browse mode
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getTrendingShows();
        setAllShows(data.filter((s) => s.image?.medium || s.image?.original));
      } catch (err) {
        console.error(err);
      }
    };
    if (!query) load();
  }, [query]);

  const fetchResults = useCallback(async (q) => {
    if (!q) return;
    setLoading(true);
    try {
      const { data } = await searchShows(q);
      const filtered = data.filter((r) => r.show?.image?.medium || r.show?.image?.original);
      setResults(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) {
      fetchResults(query);
      setSearchInput(query);
    } else {
      setResults([]);
    }
  }, [query, fetchResults]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  // Genre-filtered browse shows
  const filteredBrowse = activeGenre === 'All'
    ? allShows
    : allShows.filter((s) => s.genres?.includes(activeGenre));

  const displayResults = query ? results : filteredBrowse;

  return (
    <div style={{
      backgroundColor: '#141414', minHeight: '100vh',
      paddingTop: '100px', paddingBottom: '80px', width: '100%',
    }}>
      {/* Search bar */}
      <div style={{ maxWidth: '720px', margin: '0 auto 36px', padding: '0 24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <input
            autoFocus
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search titles, actors, genres..."
            style={{
              flex: 1, background: '#2a2a2a', border: '1px solid #444',
              borderRight: 'none', color: '#fff', fontSize: '16px',
              padding: '14px 20px', outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              background: '#e50914', color: '#fff', border: 'none',
              padding: '14px 28px', fontSize: '16px', fontWeight: 700, cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#b81d24')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#e50914')}
          >
            Search
          </button>
        </form>
      </div>

      {/* Genre filter pills — only when browsing, not searching */}
      {!query && (
        <div style={{
          padding: '0 4% 24px',
          display: 'flex', gap: '8px', flexWrap: 'wrap',
        }}>
          {['All', ...GENRES].map((g) => (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              style={{
                background: activeGenre === g ? '#e50914' : '#242424',
                color: activeGenre === g ? '#fff' : '#b3b3b3',
                border: activeGenre === g ? '1px solid #e50914' : '1px solid #383838',
                padding: '5px 14px', borderRadius: '20px', fontSize: '13px',
                cursor: 'pointer', fontWeight: activeGenre === g ? 700 : 400,
                transition: 'all 0.15s',
              }}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {/* Heading */}
      <div style={{ padding: '0 4%', marginBottom: '20px' }}>
        <h1 style={{ color: '#e5e5e5', fontSize: '22px', fontWeight: 700 }}>
          {query
            ? `Results for: "${query}"`
            : activeGenre === 'All' ? 'Browse All Titles' : `Genre: ${activeGenre}`}
        </h1>
        {displayResults.length > 0 && (
          <p style={{ color: '#777', fontSize: '13px', marginTop: '4px' }}>
            {displayResults.length} title{displayResults.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#555', fontSize: '20px' }}>
          Searching...
        </div>
      ) : displayResults.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '10px',
          padding: '0 4%',
        }}>
          {displayResults.map((movie) => {
            const show = movie?.show || movie;
            return <MovieCard key={show.id} movie={movie} />;
          })}
        </div>
      ) : query ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', color: '#b3b3b3' }}>
          <p style={{ fontSize: '22px', marginBottom: '12px' }}>No results for "{query}"</p>
          <ul style={{ listStyle: 'none', color: '#666', fontSize: '14px', lineHeight: 2 }}>
            <li>Try different keywords</li>
            <li>Check your spelling</li>
            <li>Use a broader search term</li>
          </ul>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 24px', color: '#555' }}>
          Loading content...
        </div>
      )}
    </div>
  );
};

export default SearchResults;
