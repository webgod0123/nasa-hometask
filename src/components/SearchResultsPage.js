import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchResultsPage = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Destructure state from location and set default empty object
        const { query, yearStart, yearEnd } = location.state || {};

        // Create params object conditionally
        const params = { media_type: 'image', q: query };
        if (yearStart) params.year_start = yearStart;
        if (yearEnd) params.year_end = yearEnd;

        const response = await axios.get('https://images-api.nasa.gov/search', { params });
        setResults(response.data.collection.items);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    // Call fetchResults if location.state exists
    if (location.state) {
      fetchResults();
    }
  }, [location.state]);
  console.log(results);

  return (
    <div className="container">
      <header>
        <button className="back-button" onClick={() => navigate('/')}>Back to Search</button>
      </header>
      <main>
        <ul className="results-list">
          {results.map((item, index) => (
            <li key={index} className="result-item" onClick={() => navigate(`/show/${item.data[0].nasa_id}`)}>
              <img src={item.links[0].href} alt={item.data[0].title} />
              <div>
                <h3>{item.data[0].title}</h3>
                <p>{item.data[0].location || 'Unknown location'}</p>
                <p>{item.data[0].photographer || 'Unknown photographer'}</p>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default SearchResultsPage;