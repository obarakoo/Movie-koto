import { useState, useEffect } from 'react';
import { getTrendingShows } from '../api/tvmaze';
import MovieCard from '../components/MovieCard';

const TrendingPage = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await getTrendingShows();
        setShows(res.data.filter(show => show.image));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', paddingTop: '90px', paddingBottom: '80px' }}>
      <div style={{ padding: '20px 4% 24px' }}>
        <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 900, fontFamily: 'Impact, sans-serif', letterSpacing: '-1px', marginBottom: '4px' }}>
          🔥 Trending
        </h1>
        <p style={{ color: '#777', fontSize: '14px' }}>
          See what's trending right now on TVMaze
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#555', fontSize: '20px' }}>Loading trending content...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '10px', padding: '0 4%',
        }}>
          {shows.map((show) => (
            <MovieCard key={show.id} movie={show} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingPage;
