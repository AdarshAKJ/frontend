import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Ensure 'Routes' is imported
import './App.css';
import GifDetail from './GifDetail'; // Ensure the path is correct

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState([]);
  const [offset, setOffset] = useState(0);

  // Function to fetch GIFs from the API
  const fetchGifs = async (tags = '', offset = 0) => {
    try {
      const response = await axios.get
        ('https://backend-murex-eight.vercel.app/api/list-gif', {
          params: {
            tags: tags,
            offset: offset,
          }
        });
      return response.data.gifs;
    } catch (error) {
      console.error('Error fetching GIFs:', error);
      return [];
    }
  };

  // Function to handle search queries
  const handleSearch = async () => {
    setOffset(0); // Reset offset to 0 for new search
    const gifs = await fetchGifs(searchQuery);
    setGifs(gifs);
  };

  // Function to load more GIFs when scrolling
  const loadMoreGifs = async () => {
    const newOffset = offset + 10;
    setOffset(newOffset);
    const moreGifs = await fetchGifs(searchQuery, newOffset);
    setGifs(prevGifs => [...prevGifs, ...moreGifs]);
  };

  // Effect to handle scroll for loading more GIFs
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        loadMoreGifs();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset, searchQuery]);

  // Effect to fetch initial GIFs when the component mounts
  useEffect(() => {
    const initialFetch = async () => {
      const initialGifs = await fetchGifs();
      setGifs(initialGifs);
    };
    initialFetch();
  }, []);

  // Function to handle Enter key press in search input
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Router>
      <div className="App">
        <div id="logo">Adarsh GIF Search</div>
        <div id="search-bar-container">
          <input
            type="text"
            id="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search GIFs by tags..."
          />
          <button id="search-button" onClick={handleSearch}>Search</button>
        </div>
        <Routes>
          <Route path="/" element={
            <div id="content">
              <div id="gif-list-container">
                <div id="gif-container">
                  {gifs.map((gif) => (
                    <Link to={`/gif/${gif._id}`} key={gif._id} className="gif-item">
                      <img src={gif.url} alt={gif.title} className="gif" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          } />
          <Route path="/gif/:id" element={<GifDetail />} />
        </Routes>
        <footer>Scroll down to load more GIFs...</footer>
      </div>
    </Router>
  );
}

export default App;
