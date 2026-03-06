/**
 * TrailerModal — thin wrapper around PlayerModal for TVMaze shows (YouTube search trailer)
 * Kept for backwards compat with Hero.jsx and MovieCard.jsx
 */
import PlayerModal from './PlayerModal';

const TrailerModal = ({ show, onClose }) => {
  if (!show) return null;
  return (
    <PlayerModal
      title={show.name}
      description={show.summary}
      searchTitle={`${show.name} official trailer`}
      metadata={{
        year: show.premiered?.substring(0, 4),
        genres: show.genres || [],
        rating: show.rating?.average ? `${show.rating.average}/10` : null,
      }}
      onClose={onClose}
    />
  );
};

export default TrailerModal;
