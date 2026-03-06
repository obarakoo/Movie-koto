import { useState, useEffect } from 'react';
import { getArchiveFilmsByCollection, searchArchiveByQuery } from '../api/archive';
import ArchiveCard from '../components/ArchiveCard';

const COLLECTIONS = [
  { id: 'feature_films',    label: '🎬 All Feature Films', accent: '#e50914' },
  { id: 'SciFi_Horror',     label: '👽 Sci-Fi & Horror',   accent: '#a855f7' },
  { id: 'Comedy_Films',     label: '🤣 Comedy',            accent: '#22c55e' },
  { id: 'silent_films',     label: '🎞️ Silent Classics',   accent: '#94a3b8' },
  { id: 'classic_tv',       label: '📺 Classic TV',        accent: '#f59e0b' },
];

const MoviesPage = () => {
  const [activeCollection, setActiveCollection] = useState(COLLECTIONS[0]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 24;

  const fetchMovies = async (collection, pageNum) => {
    setLoading(true);
    try {
      const res = await getArchiveFilmsByCollection(collection.id, PAGE_SIZE * pageNum);
      const docs = res.data?.response?.docs || [];
      setMovies(docs.filter((m) => m.identifier));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setSearchInput('');
    fetchMovies(activeCollection, 1);
  }, [activeCollection]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setLoading(true);
    try {
      const res = await searchArchiveByQuery(searchInput.trim(), 30);
      const docs = res.data?.response?.docs || [];
      setMovies(docs.filter((m) => m.identifier));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoading(true);
    try {
      const res = await getArchiveFilmsByCollection(activeCollection.id, PAGE_SIZE * nextPage);
      const docs = res.data?.response?.docs || [];
      setMovies(docs.filter((m) => m.identifier));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', paddingTop: '90px', paddingBottom: '80px' }}>
      {/* Page Header */}
      <div style={{ padding: '20px 4% 24px' }}>
        <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 900, fontFamily: 'Impact, sans-serif', letterSpacing: '-1px', marginBottom: '4px' }}>
          🎬 Free Movies
        </h1>
        <p style={{ color: '#777', fontSize: '14px' }}>
          Public domain films fully playable for free via Internet Archive · {movies.length} titles loaded
        </p>
      </div>

      {/* Search bar */}
      <div style={{ padding: '0 4% 24px', maxWidth: '600px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex' }}>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search free movies..."
            style={{
              flex: 1, background: '#2a2a2a', border: '1px solid #444',
              borderRight: 'none', color: '#fff', fontSize: '15px', padding: '12px 18px', outline: 'none',
            }}
          />
          <button type="submit" style={{
            background: '#e50914', color: '#fff', border: 'none',
            padding: '12px 24px', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
          }}>
            Search
          </button>
        </form>
      </div>

      {/* Collection filter tabs */}
      <div style={{ padding: '0 4% 28px', display: 'flex', gap: '8px', flexWrap: 'wrap', overflowX: 'auto' }} className="hide-scroll">
        {COLLECTIONS.map((col) => (
          <button
            key={col.id}
            onClick={() => setActiveCollection(col)}
            style={{
              background: activeCollection.id === col.id ? col.accent : '#232323',
              color: activeCollection.id === col.id ? '#fff' : '#b3b3b3',
              border: '1px solid',
              borderColor: activeCollection.id === col.id ? col.accent : '#383838',
              padding: '7px 16px', borderRadius: '20px',
              fontSize: '13px', fontWeight: activeCollection.id === col.id ? 700 : 400,
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {col.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#555', fontSize: '20px' }}>Loading free movies...</div>
      ) : movies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#555' }}>No results found.</div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '10px', padding: '0 4%',
          }}>
            {movies.map((movie) => (
              <ArchiveCard key={movie.identifier} movie={movie} />
            ))}
          </div>

          {/* Load more */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              onClick={loadMore}
              style={{
                background: 'transparent', border: '2px solid #555',
                color: '#b3b3b3', padding: '12px 36px',
                fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                borderRadius: '4px', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#b3b3b3'; }}
            >
              Load More Movies
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MoviesPage;
