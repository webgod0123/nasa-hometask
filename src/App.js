import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import ShowPage from './components/ShowPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/show/:nasaId" element={<ShowPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;