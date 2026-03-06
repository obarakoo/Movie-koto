import { useState } from 'react';
import { FaPlay, FaPlus, FaCheck, FaStar } from 'react-icons/fa';
import { useMyList } from '../context/MyListContext';
import PlayerModal from './PlayerModal';

/**
 * GhibliCard — card for a Studio Ghibli film.
 * film: { id, title, description, image, movie_banner, rt_score, release_date, director }
 */
const GhibliCard = ({ film }) => {
  const [hovered, setHovered] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const { addToList, removeFromList, isInList } = useMyList();

  if (!film?.id) return null;

  const fakeShow = {
    id: `ghibli_${film.id}`,
    name: film.title,
    image: { medium: film.image, original: film.movie_banner },
    summary: film.description,
    premiered: film.release_date ? String(film.release_date) : '',
    genres: ['Animation', 'Studio Ghibli'],
    rating: { average: film.rt_score ? (film.rt_score / 10).toFixed(1) : null },
  };

  const inList = isInList(fakeShow.id);
  const rating = film.rt_score ? `${film.rt_score}% RT` : 'N/A';

  return (
    <>
      {showPlayer && (
        <PlayerModal
          title={film.title}
          description={film.description}
          searchTitle={`${film.title} Studio Ghibli official trailer`}
          metadata={{
            year: String(film.release_date),
            genres: ['Animation', 'Studio Ghibli'],
            rating,
          }}
          onClose={() => setShowPlayer(false)}
        />
      )}

      <div
        style={{
          position: 'relative', cursor: 'pointer',
          transition: 'transform 0.25s ease',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          zIndex: hovered ? 50 : 1,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            width: '100%', aspectRatio: '2 / 3',
            borderRadius: '4px', overflow: 'hidden',
            backgroundColor: '#181818', position: 'relative',
            boxShadow: hovered ? '0 10px 40px rgba(0,0,0,0.8), 0 0 0 2px #f59e0b' : '0 2px 10px rgba(0,0,0,0.4)',
            transition: 'box-shadow 0.25s',
          }}
          onClick={() => setShowPlayer(true)}
        >
          <img
            src={film.image}
            alt={film.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/210x310?text=Ghibli'; }}
          />
          {/* Ghibli badge */}
          <div style={{
            position: 'absolute', top: '8px', left: '8px',
            background: '#f59e0b', color: '#000',
            fontSize: '8px', fontWeight: 900, padding: '2px 6px', borderRadius: '3px',
          }}>
            GHIBLI
          </div>
          {/* RT score */}
          {film.rt_score && (
            <div style={{
              position: 'absolute', top: '8px', right: '8px',
              background: 'rgba(0,0,0,0.75)', color: '#22c55e',
              fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '3px',
            }}>
              {film.rt_score}% RT
            </div>
          )}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)',
            padding: '24px 8px 8px',
          }}>
            <p style={{ color: '#fff', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {film.title}
            </p>
            {film.release_date && <p style={{ color: '#b3b3b3', fontSize: '10px', marginTop: '2px' }}>{film.release_date}</p>}
          </div>
        </div>

        {/* Hover panel */}
        {hovered && (
          <div style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            width: '210px',
            background: '#181818', borderRadius: '0 0 6px 6px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.9)', border: '1px solid #333', borderTop: 'none',
            zIndex: 100, padding: '10px',
          }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', justifyContent: 'flex-start' }}>
              <button
                onClick={() => setShowPlayer(true)}
                style={{
                  background: '#f59e0b', border: 'none', borderRadius: '50%',
                  width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}
                title="Watch Trailer"
              >
                <FaPlay style={{ color: '#000', fontSize: '12px', marginLeft: '2px' }} />
              </button>
              <button
                onClick={() => inList ? removeFromList(fakeShow.id) : addToList(fakeShow)}
                style={{
                  background: inList ? '#e50914' : 'rgba(255,255,255,0.15)',
                  border: '2px solid', borderColor: inList ? '#e50914' : '#aaa',
                  borderRadius: '50%', width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}
                title={inList ? 'Remove' : 'Add to My List'}
              >
                {inList ? <FaCheck style={{ color: '#fff', fontSize: '12px' }} /> : <FaPlus style={{ color: '#fff', fontSize: '12px' }} />}
              </button>
            </div>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>{film.title}</p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              {film.rt_score && <span style={{ color: '#22c55e', fontSize: '11px', fontWeight: 700 }}>{film.rt_score}% RT</span>}
              {film.director && <span style={{ color: '#b3b3b3', fontSize: '11px' }}>Dir. {film.director}</span>}
            </div>
            {film.description && (
              <p style={{ color: '#939393', fontSize: '11px', lineHeight: 1.4,
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
              }}>
                {film.description}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default GhibliCard;
