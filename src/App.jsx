import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Weathercomp from './pages/Weathercomp';
import Favourites from './pages/Favourites';
import './index.css'

const App = () => {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/favourites">Favourites</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Weathercomp />} />
        <Route path="/favourites" element={<Favourites />} />
      </Routes>
    </Router>
  );
};

export default App;
