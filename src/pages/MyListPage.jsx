import { useMyList } from '../context/MyListContext';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';

const MyListPage = () => {
  const { myList } = useMyList();

  return (
    <div style={{
      backgroundColor: '#141414', minHeight: '100vh',
      paddingTop: '100px', paddingBottom: '80px', width: '100%',
    }}>
      <div style={{ padding: '0 4%' }}>
        <h1 style={{ color: '#e5e5e5', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>My List</h1>
        <p style={{ color: '#777', fontSize: '14px', marginBottom: '36px' }}>
          {myList.length} title{myList.length !== 1 ? 's' : ''} saved
        </p>

        {myList.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            border: '1px dashed #333', borderRadius: '8px',
          }}>
            <p style={{ color: '#555', fontSize: '20px', marginBottom: '16px' }}>Your list is empty</p>
            <p style={{ color: '#444', fontSize: '14px', marginBottom: '28px' }}>
              Add shows and movies using the <strong style={{ color: '#777' }}>+</strong> button on any card.
            </p>
            <Link to="/" style={{
              background: '#e50914', color: '#fff', padding: '12px 28px',
              borderRadius: '4px', textDecoration: 'none', fontWeight: 700, fontSize: '15px',
            }}>
              Browse Content
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '10px',
          }}>
            {myList.map((show) => (
              <MovieCard key={show.id} movie={show} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListPage;
