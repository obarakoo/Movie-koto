import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlay, FaPlus, FaCheck, FaStar } from 'react-icons/fa';
import { getShowDetails, getShowCast } from '../api/tvmaze';
import { useMyList } from '../context/MyListContext';
import TrailerModal from '../components/TrailerModal';

const MovieDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const { addToList, removeFromList, isInList } = useMyList();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchShow = async () => {
      try {
        const [showRes, castRes] = await Promise.all([
          getShowDetails(id),
          getShowCast(id),
        ]);
        setShow(showRes.data);
        setCast(castRes.data.slice(0, 10));
      } catch (err) {
        console.error(err);
      }
    };
    if (id) fetchShow();
  }, [id]);

  if (!show) {
    return (
      <div style={{
        paddingTop: '120px', textAlign: 'center', minHeight: '100vh',
        backgroundColor: '#141414', color: '#555', fontSize: '20px',
      }}>
        Loading...
      </div>
    );
  }

  const inList = isInList(show.id);
  const bgImage = show.image?.original || show.image?.medium;
  const poster = show.image?.medium || show.image?.original;
  const summary = show.summary?.replace(/<[^>]+>/g, '') || 'No description available.';
  const year = show.premiered?.substring(0, 4) || '';
  const rating = show.rating?.average?.toFixed(1) || 'NR';

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', paddingBottom: '80px' }}>
      {showTrailer && <TrailerModal show={show} onClose={() => setShowTrailer(false)} />}

      {/* Backdrop */}
      <div style={{ position: 'relative', width: '100%', height: '55vh', overflow: 'hidden' }}>
        {bgImage && (
          <>
            <img
              src={bgImage}
              alt={show.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(38%)' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, #141414 0%, rgba(20,20,20,0.5) 50%, transparent 100%)',
            }} />
          </>
        )}
        {/* Back button */}
        <Link
          to="/"
          style={{
            position: 'absolute', top: '90px', left: '4%', zIndex: 5,
            color: '#b3b3b3', fontSize: '14px', textDecoration: 'none',
            background: 'rgba(0,0,0,0.5)', border: '1px solid #555',
            padding: '6px 14px', borderRadius: '4px',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            backdropFilter: 'blur(4px)',
          }}
        >
          ← Back
        </Link>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1100px', margin: '-200px auto 0',
        padding: '0 4%', position: 'relative', zIndex: 2,
      }}>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Poster */}
          {poster && (
            <img
              src={poster}
              alt={show.name}
              style={{
                width: 'clamp(160px, 20vw, 240px)', flexShrink: 0, borderRadius: '6px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.9)', border: '2px solid rgba(255,255,255,0.08)',
              }}
            />
          )}

          {/* Info */}
          <div style={{ flex: 1, minWidth: '260px', paddingTop: '20px' }}>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, color: '#fff',
              marginBottom: '12px', fontFamily: 'Impact, sans-serif', letterSpacing: '-0.5px',
            }}>
              {show.name}
            </h1>

            {/* Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: '#46d369', fontWeight: 700, fontSize: '15px' }}>
                <FaStar style={{ marginRight: '4px', color: '#e50914' }} />
                {rating}/10
              </span>
              {year && <span style={{ color: '#ccc', fontSize: '14px' }}>{year}</span>}
              {show.status && (
                <span style={{ border: '1px solid #555', padding: '2px 8px', color: '#bbb', fontSize: '12px', borderRadius: '3px' }}>
                  {show.status}
                </span>
              )}
              {show.runtime && (
                <span style={{ color: '#b3b3b3', fontSize: '13px' }}>{show.runtime} min/ep</span>
              )}
              {show.language && (
                <span style={{ color: '#b3b3b3', fontSize: '13px' }}>🌐 {show.language}</span>
              )}
            </div>

            {/* Genres */}
            {show.genres?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {show.genres.map((g) => (
                  <span key={g} style={{
                    background: '#242424', border: '1px solid #383838',
                    color: '#e5e5e5', padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
                  }}>
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Summary */}
            <p style={{ color: '#d2d2d2', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>
              {summary}
            </p>

            {/* Network / Premier */}
            <div style={{ display: 'flex', gap: '32px', marginBottom: '28px', flexWrap: 'wrap' }}>
              {show.network?.name && (
                <div>
                  <p style={{ color: '#555', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Network</p>
                  <p style={{ color: '#e5e5e5', fontSize: '14px', fontWeight: 600 }}>{show.network.name}</p>
                </div>
              )}
              {show.premiered && (
                <div>
                  <p style={{ color: '#555', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Premiered</p>
                  <p style={{ color: '#e5e5e5', fontSize: '14px', fontWeight: 600 }}>{show.premiered}</p>
                </div>
              )}
              {show.averageRuntime && (
                <div>
                  <p style={{ color: '#555', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Runtime</p>
                  <p style={{ color: '#e5e5e5', fontSize: '14px', fontWeight: 600 }}>{show.averageRuntime} min</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowTrailer(true)}
                style={{
                  background: '#fff', color: '#141414', border: 'none',
                  padding: '12px 28px', fontSize: '16px', fontWeight: 700, borderRadius: '4px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ccc')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
              >
                <FaPlay style={{ fontSize: '14px' }} /> Play Trailer
              </button>

              <button
                onClick={() => inList ? removeFromList(show.id) : addToList(show)}
                style={{
                  background: inList ? '#e50914' : 'rgba(109,109,110,0.7)',
                  color: '#fff', border: 'none',
                  padding: '12px 24px', fontSize: '16px', fontWeight: 700, borderRadius: '4px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  backdropFilter: 'blur(4px)', transition: 'background 0.2s',
                }}
              >
                {inList ? <FaCheck style={{ fontSize: '14px' }} /> : <FaPlus style={{ fontSize: '14px' }} />}
                {inList ? 'In My List' : '+ My List'}
              </button>
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div style={{ marginTop: '56px' }}>
            <h2 style={{ color: '#e5e5e5', fontSize: '22px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'inline-block', width: '4px', height: '20px', background: '#e50914', borderRadius: '2px' }} />
              Cast
            </h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {cast.map(({ person, character }) => (
                <div key={person.id} style={{ textAlign: 'center', width: '90px' }}>
                  <img
                    src={person.image?.medium || 'https://via.placeholder.com/90x90?text=?'}
                    alt={person.name}
                    style={{
                      width: '80px', height: '80px', objectFit: 'cover',
                      borderRadius: '50%', border: '2px solid #333', marginBottom: '8px',
                    }}
                  />
                  <p style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>{person.name}</p>
                  {character?.name && (
                    <p style={{ color: '#777', fontSize: '11px', marginTop: '2px' }}>as {character.name}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
