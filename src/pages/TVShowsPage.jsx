import { useState, useEffect } from 'react';
import { getPopularShows, searchShows } from '../api/tvmaze';
import MovieCard from '../components/MovieCard';

const TVShowsPage = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  const fetchShows = async (query = '') => {
    setLoading(true);
    try {
      if (query) {
        const res = await searchShows(query);
        // TVMaze search returns [{show: {...}}, ...]
        setShows(res.data.filter(item => item.show.image));
      } else {
        const res = await getPopularShows();
        // Popular shows returns [show, show, ...]
        setShows(res.data.filter(show => show.image));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchShows(searchInput);
  };

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', paddingTop: '90px', paddingBottom: '80px' }}>
      <div style={{ padding: '20px 4% 24px' }}>
        <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 900, fontFamily: 'Impact, sans-serif', letterSpacing: '-1px', marginBottom: '4px' }}>
          📺 TV Shows
        </h1>
        <p style={{ color: '#777', fontSize: '14px' }}>
          Explore the most popular TV shows from TVMaze
        </p>
      </div>

      {/* Search bar */}
      <div style={{ padding: '0 4% 24px', maxWidth: '600px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex' }}>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search TV shows..."
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#555', fontSize: '20px' }}>Loading TV shows...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '10px', padding: '0 4%',
        }}>
          {shows.map((show) => (
            <MovieCard key={show.id || show.show.id} movie={show} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TVShowsPage;
