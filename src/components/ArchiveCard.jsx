import { useState } from 'react';
import { FaPlay, FaPlus, FaCheck, FaFilm } from 'react-icons/fa';
import { getArchiveThumbnail } from '../api/archive';
import { useMyList } from '../context/MyListContext';
import PlayerModal from './PlayerModal';

/**
 * ArchiveCard — card for a free Internet Archive public domain movie.
 * movie: { identifier, title, description, year, creator }
 */
const ArchiveCard = ({ movie }) => {
  const [hovered, setHovered] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const { addToList, removeFromList, isInList } = useMyList();

  if (!movie?.identifier) return null;

  // Build a fake "show" object so My List context works uniformly
  const fakeShow = {
    id: `archive_${movie.identifier}`,
    name: movie.title,
    image: { medium: getArchiveThumbnail(movie.identifier) },
    summary: movie.description || '',
    premiered: movie.year ? String(movie.year) : '',
    genres: ['Free Movie'],
    rating: { average: null },
    _archiveId: movie.identifier,
  };

  const inList = isInList(fakeShow.id);
  const poster = getArchiveThumbnail(movie.identifier);
  const year = movie.year || '';

  return (
    <>
      {showPlayer && (
        <PlayerModal
          title={movie.title}
          description={movie.description}
          archiveId={movie.identifier}
          metadata={{ year: String(year), genres: ['Free Movie', 'Public Domain'] }}
          onClose={() => setShowPlayer(false)}
        />
      )}

      <div
        style={{
          position: 'relative',
          cursor: 'pointer',
          transition: 'transform 0.25s ease',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          zIndex: hovered ? 50 : 1,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Poster */}
        <div
          style={{
            width: '100%', aspectRatio: '2 / 3',
            borderRadius: '4px', overflow: 'hidden',
            backgroundColor: '#181818', position: 'relative',
            boxShadow: hovered ? '0 10px 40px rgba(0,0,0,0.8), 0 0 0 2px #e50914' : '0 2px 10px rgba(0,0,0,0.4)',
            transition: 'box-shadow 0.25s',
          }}
          onClick={() => setShowPlayer(true)}
        >
          <img
            src={poster}
            alt={movie.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          {/* FREE badge */}
          <div style={{
            position: 'absolute', top: '8px', left: '8px',
            background: '#22c55e', color: '#000',
            fontSize: '9px', fontWeight: 900, padding: '2px 6px', borderRadius: '3px',
          }}>
            FREE ▶
          </div>
          {/* Bottom overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)',
            padding: '24px 8px 8px',
          }}>
            <p style={{ color: '#fff', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {movie.title}
            </p>
            {year && <p style={{ color: '#b3b3b3', fontSize: '10px', marginTop: '2px' }}>{year}</p>}
          </div>
        </div>

        {/* Hover actions */}
        {hovered && (
          <div style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            width: '200px',
            background: '#181818', borderRadius: '0 0 6px 6px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.9)', border: '1px solid #333', borderTop: 'none',
            zIndex: 100, padding: '10px',
          }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', justifyContent: 'space-between' }}>
              {/* Play */}
              <button
                onClick={() => setShowPlayer(true)}
                style={{
                  background: '#22c55e', border: 'none', borderRadius: '50%',
                  width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                }}
                title="Watch Free Movie"
              >
                <FaPlay style={{ color: '#000', fontSize: '12px', marginLeft: '2px' }} />
              </button>
              {/* My List */}
              <button
                onClick={() => inList ? removeFromList(fakeShow.id) : addToList(fakeShow)}
                style={{
                  background: inList ? '#e50914' : 'rgba(255,255,255,0.15)',
                  border: '2px solid', borderColor: inList ? '#e50914' : '#aaa',
                  borderRadius: '50%', width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                }}
                title={inList ? 'Remove from My List' : 'Add to My List'}
              >
                {inList ? <FaCheck style={{ color: '#fff', fontSize: '12px' }} /> : <FaPlus style={{ color: '#fff', fontSize: '12px' }} />}
              </button>
              {/* Archive link */}
              <a
                href={`https://archive.org/details/${movie.identifier}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  background: 'rgba(255,255,255,0.1)', border: '2px solid #aaa',
                  borderRadius: '50%', width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, textDecoration: 'none',
                }}
                title="Open on Archive.org"
              >
                <FaFilm style={{ color: '#fff', fontSize: '12px' }} />
              </a>
            </div>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '12px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {movie.title}
            </p>
            <p style={{ color: '#22c55e', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>FREE to Watch</p>
            {movie.description && (
              <p style={{ color: '#939393', fontSize: '11px', lineHeight: 1.4,
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
              }}>
                {movie.description.replace(/<[^>]+>/g, '')}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ArchiveCard;
