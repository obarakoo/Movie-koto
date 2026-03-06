import { useState } from 'react';
import { FaPlay, FaPlus, FaCheck } from 'react-icons/fa';
import { useMyList } from '../context/MyListContext';
import TrailerModal from './TrailerModal';

/**
 * Hero — full‑width Netflix billboard
 * Prop: show (TVMaze show object)
 */
const Hero = ({ show }) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const { addToList, removeFromList, isInList } = useMyList();

  if (!show) {
    return (
      <div style={{ height: '80vh', background: '#141414', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#555', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  const inList = isInList(show.id);
  const bgImage = show.image?.original || show.image?.medium;
  const summary = show.summary ? show.summary.replace(/<[^>]+>/g, '') : 'No description.';
  const genres = show.genres?.join(' • ') || '';
  const year = show.premiered?.substring(0, 4) || '';

  return (
    <>
      {showTrailer && <TrailerModal show={show} onClose={() => setShowTrailer(false)} />}

      <div style={{
        position: 'relative',
        width: '100%',
        height: '80vh',
        minHeight: '520px',
        overflow: 'hidden',
        backgroundColor: '#141414',
      }}>
        {/* Background image */}
        {bgImage && (
          <img
            src={bgImage}
            alt={show.name}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
              filter: 'brightness(50%)',
            }}
          />
        )}

        {/* Gradient overlays */}
        <div style={{
          position: 'absolute', inset: 0,
          background:
            'linear-gradient(to right, rgba(20,20,20,0.97) 30%, rgba(20,20,20,0.1) 75%), ' +
            'linear-gradient(to top,   rgba(20,20,20,1)    0%,  transparent          40%)',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 2,
          height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '0 4% 80px',
          maxWidth: '700px',
        }}>
          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 68px)',
            fontWeight: 900, lineHeight: 1,
            marginBottom: '16px', color: '#fff',
            fontFamily: 'Impact, sans-serif',
            textShadow: '2px 4px 16px rgba(0,0,0,0.9)',
            letterSpacing: '-1px',
          }}>
            {show.name.toUpperCase()}
          </h1>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
            {show.rating?.average && (
              <span style={{ color: '#46d369', fontWeight: 700, fontSize: '15px' }}>
                ⭐ {show.rating.average}/10
              </span>
            )}
            {year && <span style={{ color: '#ddd', fontSize: '14px' }}>{year}</span>}
            {show.status && (
              <span style={{ border: '1px solid #aaa', padding: '1px 6px', fontSize: '11px', color: '#ccc', borderRadius: '2px' }}>
                {show.status}
              </span>
            )}
            {genres && <span style={{ color: '#ccc', fontSize: '13px' }}>{genres}</span>}
          </div>

          {/* Summary */}
          <p style={{
            color: '#e5e5e5', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px',
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {summary}
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* ▶ Play */}
            <button
              onClick={() => setShowTrailer(true)}
              style={{
                background: '#fff', color: '#141414',
                border: 'none', padding: '12px 28px',
                fontSize: '16px', fontWeight: 700, borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#ccc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
            >
              <FaPlay style={{ fontSize: '14px' }} />
              {show._archiveId ? 'Watch Full Movie' : 'Play Trailer'}
            </button>

            {/* + My List */}
            <button
              onClick={() => inList ? removeFromList(show.id) : addToList(show)}
              style={{
                background: 'rgba(109,109,110,0.7)', color: '#fff',
                border: 'none', padding: '12px 24px',
                fontSize: '16px', fontWeight: 700, borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                backdropFilter: 'blur(4px)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(109,109,110,0.4)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(109,109,110,0.7)')}
            >
              {inList ? <FaCheck style={{ fontSize: '14px', color: '#46d369' }} /> : <FaPlus style={{ fontSize: '14px' }} />}
              {inList ? 'In My List' : 'My List'}
            </button>
          </div>
        </div>

        {/* Rating badge (top-right) */}
        {show.network?.name && (
          <div style={{
            position: 'absolute', top: '80px', right: '4%', zIndex: 3,
            color: '#b3b3b3', fontSize: '13px',
            border: '1px solid #555', padding: '4px 10px', borderRadius: '3px',
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          }}>
            On <span style={{ color: '#fff', fontWeight: 700 }}>{show.network.name}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default Hero;
