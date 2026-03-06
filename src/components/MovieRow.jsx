import MovieCard from './MovieCard';

/**
 * MovieRow — horizontal scrolling row of poster cards
 * Props: title, movies (array), accent (optional color string)
 */
const MovieRow = ({ title, movies = [], accent = '#e50914' }) => {
  if (movies.length === 0) {
    return (
      <div style={{ padding: '8px 4% 32px' }}>
        <div style={{
          height: '160px', background: '#181818', borderRadius: '4px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555',
        }}>
          Loading {title}...
        </div>
      </div>
    );
  }

  return (
    <section style={{ padding: '0 4% 40px' }}>
      <h2 style={{
        color: '#e5e5e5', fontSize: '20px', fontWeight: 700,
        marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <span style={{ display: 'inline-block', width: '4px', height: '20px', background: accent, borderRadius: '2px' }} />
        {title}
      </h2>

      <div
        className="hide-scroll"
        style={{
          display: 'flex', gap: '8px',
          overflowX: 'auto', overflowY: 'visible',
          paddingBottom: '80px',   /* room for hover panel */
          paddingTop: '8px',
          scrollBehavior: 'smooth',
        }}
      >
        {movies.map((movie) => {
          const show = movie?.show || movie;
          return (
            <div
              key={show.id}
              style={{ minWidth: '160px', maxWidth: '160px', flexShrink: 0, position: 'relative' }}
            >
              <MovieCard movie={movie} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MovieRow;
