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

  const embedSrc = isRealVideo
    ? getArchiveEmbedUrl(archiveId)
    : `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent((searchTitle || title) + ' official trailer')}&autoplay=1`;

  const cleanDescription = description
    ? description.replace(/<[^>]+>/g, '').substring(0, 200) + (description.length > 200 ? '…' : '')
    : '';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.92)',
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
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,0.95)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '12px', right: '12px', zIndex: 10,
            background: 'rgba(0,0,0,0.75)', border: '2px solid #555',
            color: '#fff', borderRadius: '50%', width: '38px', height: '38px',
            fontSize: '16px', cursor: 'pointer', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ✕
        </button>

        {/* Source badge */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px', zIndex: 10,
          background: isRealVideo ? '#e50914' : '#ff0000',
          color: '#fff', fontSize: '11px', fontWeight: 800,
          padding: '3px 10px', borderRadius: '3px',
          letterSpacing: '0.5px',
        }}>
          {isRealVideo ? '▶ FREE MOVIE' : '▶ YOUTUBE TRAILER'}
        </div>

        {/* Video iframe */}
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
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
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
                {title}
              </h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                {metadata.rating && (
                  <span style={{ color: '#46d369', fontWeight: 700, fontSize: '13px' }}>
                    ⭐ {metadata.rating}
                  </span>
                )}
                {metadata.year && (
                  <span style={{ color: '#b3b3b3', fontSize: '13px' }}>{metadata.year}</span>
                )}
                {metadata.genres?.map((g) => (
                  <span key={g} style={{ border: '1px solid #555', padding: '1px 8px', color: '#ccc', fontSize: '11px', borderRadius: '3px' }}>
                    {g}
                  </span>
                ))}
              </div>
            </div>
            {isRealVideo && (
              <a
                href={`https://archive.org/details/${archiveId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#b3b3b3', fontSize: '12px', textDecoration: 'none',
                  border: '1px solid #555', padding: '4px 10px', borderRadius: '3px',
                  whiteSpace: 'nowrap',
                }}
              >
                Open on Archive.org ↗
              </a>
            )}
          </div>
          {cleanDescription && (
            <p style={{ color: '#939393', fontSize: '13px', lineHeight: 1.6, marginTop: '10px' }}>
              {cleanDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
