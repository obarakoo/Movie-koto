import { useEffect } from 'react';
import { getArchiveEmbedUrl } from '../api/archive';

/**
 * PlayerModal — smart video player
 * If `archiveId` is provided → plays real Archive.org video
 * Otherwise → searches YouTube for a trailer
 *
 * Props:
 *   title       string   — title shown below player
 *   description string   — description shown below player
 *   archiveId   string?  — Archive.org identifier (for real playback)
 *   searchTitle string?  — Used for YouTube trailer query if no archiveId
 *   metadata    object?  — { year, genres, rating }
 *   onClose     fn       — close callback
 */
const PlayerModal = ({ title, description, archiveId, searchTitle, metadata = {}, onClose }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const isRealVideo = Boolean(archiveId);
  const searchQuery = encodeURIComponent((searchTitle || title) + ' trailer');

  const embedSrc = isRealVideo
    ? getArchiveEmbedUrl(archiveId)
    : `https://www.youtube.com/embed?listType=search&list=${searchQuery}`;

  const cleanDescription = description
    ? description.replace(/<[^>]+>/g, '').substring(0, 200) + (description.length > 200 ? '…' : '')
    : '';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.95)',
        zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%', maxWidth: '960px',
          background: '#181818',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 30px 100px rgba(0,0,0,1)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px', zIndex: 10,
            background: 'rgba(0,0,0,0.7)', border: 'none',
            color: '#fff', borderRadius: '50%', width: '40px', height: '40px',
            fontSize: '20px', cursor: 'pointer', fontWeight: 300,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
        >
          ✕
        </button>

        {/* Source badge */}
        <div style={{
          position: 'absolute', top: '16px', left: '16px', zIndex: 10,
          background: isRealVideo ? '#22c55e' : '#e50914',
          color: '#fff', fontSize: '12px', fontWeight: 900,
          padding: '4px 12px', borderRadius: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }}>
          {isRealVideo ? '▶ WATCH FULL MOVIE' : '▶ TRAILER'}
        </div>

        {/* Video iframe */}
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
          <iframe
            src={embedSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', border: 'none',
            }}
          />
        </div>

        {/* Info panel */}
        <div style={{ padding: '24px 32px 32px', background: 'linear-gradient(to bottom, #181818 0%, #111 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
                {title}
              </h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                {metadata.rating && (
                  <span style={{ color: '#46d369', fontWeight: 700 }}>
                    ⭐ {metadata.rating}
                  </span>
                )}
                {metadata.year && (
                  <span style={{ color: '#b3b3b3' }}>{metadata.year}</span>
                )}
                {metadata.genres?.map((g) => (
                  <span key={g} style={{ border: '1px solid #444', padding: '2px 10px', color: '#aaa', fontSize: '11px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {g}
                  </span>
                ))}
              </div>
              {cleanDescription && (
                <p style={{ color: '#b3b3b3', fontSize: '14px', lineHeight: 1.6, marginTop: '16px' }}>
                  {cleanDescription}
                </p>
              )}
            </div>

            {/* ACTION BUTTONS (FALLBACKS) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {isRealVideo ? (
                <a
                  href={`https://archive.org/details/${archiveId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#22c55e', color: '#000', fontSize: '14px', fontWeight: 700,
                    textDecoration: 'none', padding: '12px 24px', borderRadius: '4px',
                    textAlign: 'center', transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Watch on Archive.org
                </a>
              ) : (
                <a
                  href={`https://www.youtube.com/results?search_query=${searchQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#e50914', color: '#fff', fontSize: '14px', fontWeight: 700,
                    textDecoration: 'none', padding: '12px 24px', borderRadius: '4px',
                    textAlign: 'center', transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#ff0a16'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#e50914'}
                >
                  Watch on YouTube ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
