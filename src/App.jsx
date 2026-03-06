import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MyListProvider } from './context/MyListContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SearchResults from './pages/SearchResults';
import MyListPage from './pages/MyListPage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import TrendingPage from './pages/TrendingPage';
import './index.css';

function App() {
  return (
    <MyListProvider>
      <Router>
        <div style={{ backgroundColor: '#141414', minHeight: '100vh', color: '#fff', width: '100%' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/tv-shows" element={<TVShowsPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/mylist" element={<MyListPage />} />
          </Routes>
        </div>
      </Router>
    </MyListProvider>
  );
}

export default App;
