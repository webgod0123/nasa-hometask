import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const SearchPage = () => {
  const [searchQueries, setSearchQueries] = useState({
    query: '',
    yearStart: '',
    yearEnd: '',
  });
  const [results, setResults] = useState([]);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const handleChange = (event) => {
    setSearchQueries({ ...searchQueries, [event.target.name]: event.target.value })
  };

  // const handleSearch = async (params) => {
  //   try {
  //     const response = await axios.get('https://images-api.nasa.gov/search', { params });
      
  //     setResults(response.data.collection.items);
  //   } catch (error) {
  //     console.error('Error fetching data: ', error);
  //   }
  // };

  const handleSearch = async (params) => {
    try {
      const response = await axios.get('https://images-api.nasa.gov/search', { params });
      
      if (response.data.collection && response.data.collection.items) {
        setResults(response.data.collection.items);
      } else {
        // console.warn('No results found for the given query.');
        setResults([]);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      setResults([]); // Clear previous results or handle accordingly
    }
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    const params = {
      media_type: 'image',
      q: searchQueries.query,
    };
    if (searchQueries.yearStart) params.year_start = searchQueries.yearStart;
    if (searchQueries.yearEnd) params.year_end = searchQueries.yearEnd;

    let queries = '';

    Object.keys(params).forEach((key) => {
      queries += `${queries === '' ? '?' : '&'}${key}=${params[key]}`;
    });

    navigate(`/${queries}`);

    handleSearch(params);
  };

  useEffect(() => {
    let queries = {};

    searchParams.forEach((value, key) => {
      queries = {
        ...queries,
        [key]: value,
      }
    });

    handleSearch(queries);

    setSearchQueries({
      ...searchQueries,
      query: queries['q'] || '',
      yearStart: queries['year_start'] || '',
      yearEnd: queries['year_end'] || '',
    });
  }, []);

  return (
    <div className="container">
      <header>
        <h1>NASA Media Library</h1>
      </header>
      <main>
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            className="search-input"
            type="text"
            placeholder="Search NASA Media"
            value={searchQueries.query}
            name="query"
            onChange={handleChange}
          />
          <input
            className="year-input"
            type="text"
            placeholder="Year Start (YYYY)"
            value={searchQueries.yearStart}
            name="yearStart"
            onChange={handleChange}
          />
          <input
            className="year-input"
            type="text"
            placeholder="Year End (YYYY)"
            value={searchQueries.yearEnd}
            name="yearEnd"
            onChange={handleChange}
          />
          <button className="search-button" type="submit">Search</button>
        </form>
        <ul className="results-list">
          {results.map((item, index) => (
            <li key={index} className="result-item" onClick={() => navigate(`/show/${item.data[0].nasa_id}`)}>
              <img src={item.links[0].href} alt={item.data[0].title} />
              <div>
                <h3>{item.data[0].title}</h3>
                <p>Location: {item.data[0].location || 'Unknown'}</p>
                <p>Photographer: {item.data[0].photographer || 'Unknown'}</p>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default SearchPage;