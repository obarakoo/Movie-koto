import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaPlus, FaCheck, FaStar, FaInfoCircle } from 'react-icons/fa';
import { useMyList } from '../context/MyListContext';
import TrailerModal from './TrailerModal';

/**
 * MovieCard — Netflix‑style poster with hover overlay
 * Accepts raw TVMaze show or search result { show: {...} }
 */
const MovieCard = ({ movie }) => {
  const show = movie?.show || movie;
  const [hovered, setHovered] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const { addToList, removeFromList, isInList } = useMyList();

  if (!show) return null;

  const inList = isInList(show.id);
  const poster =
    show.image?.medium ||
    show.image?.original ||
    'https://via.placeholder.com/210x295?text=No+Poster';
  const year = show.premiered?.substring(0, 4) || '';
  const rating = show.rating?.average ? show.rating.average.toFixed(1) : 'NR';
  const genres = show.genres?.slice(0, 2).join(' • ') || '';
  const summary =
    show.summary
      ? show.summary.replace(/<[^>]+>/g, '').substring(0, 90) + '…'
      : '';

  const handleListToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    inList ? removeFromList(show.id) : addToList(show);
  };

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTrailer(true);
  };

  return (
    <>
      {showTrailer && (
        <TrailerModal show={show} onClose={() => setShowTrailer(false)} />
      )}

      <div
        style={{
          position: 'relative',
          borderRadius: '4px',
          overflow: hovered ? 'visible' : 'hidden', // Changed to hidden when not hovered for clean rounded corners
          cursor: 'pointer',
          transition: 'transform 0.25s ease, z-index 0s',
          transform: hovered ? 'scale(1.12)' : 'scale(1)',
          zIndex: hovered ? 50 : 1,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handlePlay} // MAKE WHOLE CARD PLAYABLE
      >
        {/* Card image */}
        <div
          style={{
            width: '100%',
            aspectRatio: '2 / 3',
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#181818',
            boxShadow: hovered
              ? '0 10px 40px rgba(0,0,0,0.8), 0 0 0 2px #e50914'
              : '0 2px 10px rgba(0,0,0,0.4)',
            transition: 'box-shadow 0.25s ease',
            position: 'relative'
          }}
        >
          <img
            src={poster}
            alt={show.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          
          {/* Play Overlay on Hover */}
          {hovered && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'opacity 0.2s'
            }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.9)', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <FaPlay style={{ color: '#000', fontSize: '18px', marginLeft: '3px' }} />
              </div>
            </div>
          )}
        </div>

        {/* Hover info panel — appears below card */}
        {hovered && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '200px',
              background: '#181818',
              borderRadius: '0 0 6px 6px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.9)',
              border: '1px solid #333',
              borderTop: 'none',
              zIndex: 100,
              padding: '10px',
              animation: 'fadeIn 0.15s ease',
            }}
          >
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Play */}
              <button
                onClick={handlePlay}
                title="Play Trailer"
                style={{
                  background: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ddd')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
              >
                <FaPlay style={{ color: '#141414', fontSize: '12px', marginLeft: '2px' }} />
              </button>

              {/* My List toggle */}
              <button
                onClick={handleListToggle}
                title={inList ? 'Remove from My List' : 'Add to My List'}
                style={{
                  background: inList ? '#e50914' : 'rgba(255,255,255,0.15)',
                  border: '2px solid',
                  borderColor: inList ? '#e50914' : '#aaa',
                  borderRadius: '50%',
                  width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
              >
                {inList
                  ? <FaCheck style={{ color: '#fff', fontSize: '12px' }} />
                  : <FaPlus style={{ color: '#fff', fontSize: '12px' }} />
                }
              </button>

              {/* More info */}
              <Link
                to={`/movie/${show.id}`}
                onClick={(e) => e.stopPropagation()} // DON'T PLAY WHEN CLICKING INFO
                style={{ textDecoration: 'none', flexShrink: 0 }}
              >
                <button
                  title="More Info"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: '2px solid #aaa',
                    borderRadius: '50%',
                    width: '36px', height: '36px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#aaa')}
                >
                  <FaInfoCircle style={{ color: '#fff', fontSize: '12px' }} />
                </button>
              </Link>
            </div>

            {/* Title */}
            <p style={{
              color: '#fff', fontWeight: 700, fontSize: '13px',
              marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {show.name}
            </p>

            {/* Rating + year */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
              {show.rating?.average && (
                <span style={{ color: '#46d369', fontSize: '12px', fontWeight: 700 }}>
                  ⭐ {rating}
                </span>
              )}
              {year && <span style={{ color: '#b3b3b3', fontSize: '11px' }}>{year}</span>}
            </div>

            {/* Genres */}
            {genres && (
              <p style={{ color: '#b3b3b3', fontSize: '11px', marginBottom: '6px' }}>{genres}</p>
            )}

            {/* Mini summary */}
            {summary && (
              <p style={{ color: '#939393', fontSize: '11px', lineHeight: 1.4 }}>{summary}</p>
            )}
          </div>
        )}

        {/* Title always visible below poster */}
        <p style={{
          color: '#e5e5e5', fontSize: '11px', fontWeight: 600,
          marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          paddingX: '2px',
        }}>
          {show.name}
        </p>
      </div>
    </>
  );
};

export default MovieCard;
