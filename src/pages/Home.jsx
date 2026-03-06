import { useEffect, useState } from 'react';
import { getTrendingShows, getPopularShows, getTopRatedShows } from '../api/tvmaze';
import { getGhibliFilms } from '../api/ghibli';
import { getArchiveFilmsByCollection } from '../api/archive';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import ArchiveCard from '../components/ArchiveCard';
import GhibliCard from '../components/GhibliCard';
import { useMyList } from '../context/MyListContext';
import MovieCard from '../components/MovieCard';

/** Reusable horizontal scrollable section */
const ContentRow = ({ title, accent = '#e50914', items, renderItem }) => {
  if (!items || items.length === 0) return null;
  return (
    <section style={{ padding: '0 4% 40px' }}>
      <h2 style={{
        color: '#e5e5e5', fontSize: '20px', fontWeight: 700,
        marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <span style={{ display: 'inline-block', width: '4px', height: '20px', background: accent, borderRadius: '2px' }} />
        {title}
      </h2>
      <div
        className="hide-scroll"
        style={{
          display: 'flex', gap: '8px',
          overflowX: 'auto', overflowY: 'visible',
          paddingBottom: '90px', paddingTop: '8px',
          scrollBehavior: 'smooth',
        }}
      >
        {items.map((item, i) => (
          <div key={i} style={{ minWidth: '160px', maxWidth: '160px', flexShrink: 0, position: 'relative' }}>
            {renderItem(item, i)}
          </div>
        ))}
      </div>
    </section>
  );
};

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [ghibliFilms, setGhibliFilms] = useState([]);
  const [scifiMovies, setScifiMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [silentMovies, setSilentMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { myList } = useMyList();

  useEffect(() => {
    const withImg = (arr) => arr.filter((s) => s.image?.medium || s.image?.original);

    const extractArchiveDocs = (res) => {
      try { return res.data.response.docs || []; } catch { return []; }
    };

    const fetchAll = async () => {
      try {
        const [t, p, r, ghibli, scifi, comedy, silent] = await Promise.all([
          getTrendingShows(),
          getPopularShows(),
          getTopRatedShows(),
          getGhibliFilms(),
          getArchiveFilmsByCollection('SciFi_Horror', 20),
          getArchiveFilmsByCollection('Comedy_Films', 20),
          getArchiveFilmsByCollection('silent_films', 20),
        ]);

        setTrending(withImg(t.data).slice(0, 30));
        setPopular(withImg(p.data).slice(0, 30));
        setTopRated(withImg(r.data).slice(0, 30));
        setGhibliFilms(ghibli.data || []);
        setScifiMovies(extractArchiveDocs(scifi).filter((m) => m.identifier));
        setComedyMovies(extractArchiveDocs(comedy).filter((m) => m.identifier));
        setSilentMovies(extractArchiveDocs(silent).filter((m) => m.identifier));
      } catch (err) {
        console.error('Failed to fetch', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const heroShow = [...trending]
    .filter((s) => s.image?.original && s.rating?.average)
    .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))[0] || trending[0];

  return (
    <div style={{ backgroundColor: '#141414', width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
      <Hero show={heroShow} />

      <div style={{ marginTop: '-60px', position: 'relative', zIndex: 2 }}>

        {/* TVMaze rows */}
        <MovieRow title="🔥 Trending TV Shows" movies={trending} accent="#e50914" />
        <MovieRow title="⭐ Popular on MovieKoto" movies={popular} accent="#fbbf24" />
        <MovieRow title="🏆 Top Rated Shows"movies={topRated} accent="#22d3ee" />

        {/* Studio Ghibli */}
        <ContentRow
          title="🌿 Studio Ghibli Collection"
          accent="#f59e0b"
          items={ghibliFilms}
          renderItem={(film) => <GhibliCard film={film} />}
        />

        {/* FREE archive movies */}
        <ContentRow
          title="🎬 Free Sci-Fi & Horror (Public Domain)"
          accent="#a855f7"
          items={scifiMovies}
          renderItem={(movie) => <ArchiveCard movie={movie} />}
        />

        <ContentRow
          title="🤣 Free Comedy Films (Public Domain)"
          accent="#22c55e"
          items={comedyMovies}
          renderItem={(movie) => <ArchiveCard movie={movie} />}
        />

        <ContentRow
          title="🎞️ Silent Film Classics (Public Domain)"
          accent="#94a3b8"
          items={silentMovies}
          renderItem={(movie) => <ArchiveCard movie={movie} />}
        />

        {/* My List inline */}
        {myList.length > 0 && (
          <ContentRow
            title="❤️ My List"
            accent="#46d369"
            items={myList}
            renderItem={(show) => <MovieCard movie={show} />}
          />
        )}
      </div>

      <footer style={{
        textAlign: 'center', padding: '40px 4%',
        borderTop: '1px solid #242424', color: '#555', fontSize: '13px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {['TVMaze API', 'Studio Ghibli API', 'Internet Archive', 'TVMaze'].map((item) => (
            <span key={item} style={{ color: '#555', fontSize: '12px' }}>{item} ✓</span>
          ))}
        </div>
        <p>© 2026 Movie<span style={{ color: '#e50914' }}>koto</span>. Powered by TVMaze · Ghibli API · Internet Archive. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
