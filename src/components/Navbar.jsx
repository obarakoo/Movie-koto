import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaBell, FaUser, FaHeart } from 'react-icons/fa';
import { useMyList } from '../context/MyListContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { myList } = useMyList();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Full Movies', path: '/movies', highlight: true },
    { label: 'TV Shows', path: '/tv-shows' },
    { label: 'Trending', path: '/trending' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue('');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)',
      padding: '0 4%',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '68px', width: '100%',
    }}>
      {/* LEFT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
          <img
            src="/logo.png"
            alt="Moviekoto"
            style={{
              height: '42px', width: '42px', objectFit: 'cover', borderRadius: '50%',
              filter: 'drop-shadow(0 0 8px #e50914) drop-shadow(0 0 24px rgba(229,9,20,0.4))',
              border: '2px solid #e50914'
            }}
          />
          <span style={{
            fontSize: '22px', fontWeight: 900, letterSpacing: '-0.5px',
            color: '#e50914', fontFamily: 'Impact, sans-serif', textTransform: 'uppercase',
            textShadow: '0 0 14px rgba(229,9,20,0.7)',
          }}>
            Movie<span style={{ color: '#fff' }}>koto</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              style={{
                color: link.highlight ? '#22c55e' : (isActive(link.path) ? '#fff' : '#e5e5e5'),
                fontWeight: (isActive(link.path) || link.highlight) ? 700 : 400,
                fontSize: '14px', textDecoration: 'none',
                transition: 'color 0.15s', whiteSpace: 'nowrap',
                textShadow: link.highlight ? '0 0 10px rgba(34,197,94,0.4)' : 'none',
              }}
              onMouseEnter={(e) => (e.target.style.color = link.highlight ? '#4ade80' : '#b3b3b3')}
              onMouseLeave={(e) => (e.target.style.color = link.highlight ? '#22c55e' : (isActive(link.path) ? '#fff' : '#e5e5e5'))}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* RIGHT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
          {searchOpen && (
            <input
              autoFocus
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onBlur={() => { if (!searchValue) setSearchOpen(false); }}
              placeholder="Titles, people, genres..."
              style={{
                background: 'rgba(0,0,0,0.8)', border: '1px solid #fff',
                color: '#fff', padding: '6px 14px', fontSize: '14px',
                width: '220px', outline: 'none', marginRight: '6px',
              }}
            />
          )}
          <button
            type={searchOpen ? 'submit' : 'button'}
            onClick={() => !searchOpen && setSearchOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex' }}
          >
            <FaSearch style={{ fontSize: '18px' }} />
          </button>
        </form>

        <FaBell style={{ fontSize: '18px', cursor: 'pointer', color: '#fff' }} />

        {/* My List with badge */}
        <Link to="/mylist" style={{ position: 'relative', textDecoration: 'none', color: '#fff' }}>
          <FaHeart style={{ fontSize: '18px', color: myList.length > 0 ? '#e50914' : '#fff' }} />
          {myList.length > 0 && (
            <span style={{
              position: 'absolute', top: '-8px', right: '-8px',
              background: '#e50914', color: '#fff', borderRadius: '50%',
              width: '16px', height: '16px', fontSize: '10px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {myList.length > 9 ? '9+' : myList.length}
            </span>
          )}
        </Link>

        {/* Avatar */}
        <div style={{
          width: '32px', height: '32px', borderRadius: '4px',
          background: 'linear-gradient(135deg, #e50914, #b81d24)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <FaUser style={{ fontSize: '14px', color: '#fff' }} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
