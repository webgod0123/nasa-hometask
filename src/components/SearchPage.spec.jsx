import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // MemoryRouter is used for testing routing
import axios from 'axios';
import SearchPage from './SearchPage';
import '@testing-library/jest-dom';

// Mock the axios module
jest.mock('axios');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('SearchPage', () => {
  // Set up some variables to hold mock functions and values
  let mockNavigate;
  let mockSearchParams;

  const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return {
      ...render(<MemoryRouter>{ui}</MemoryRouter>),
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock functions and values
    mockNavigate = jest.fn();
    mockSearchParams = [
      new URLSearchParams(), // Represents the search query params
      jest.fn(), // Represents the setSearchParams function
    ];

    // Set the return values for the mocked hooks
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('react-router-dom').useSearchParams.mockReturnValue(mockSearchParams);
  });

  // Test if the search input is rendered
  it('renders the search input', () => {
    render(<SearchPage />);
    const searchInput = screen.getByPlaceholderText('Search NASA Media');
    expect(searchInput).toBeInTheDocument();
  });

  it('handles input change', () => {
    renderWithRouter(<SearchPage />);
    const searchInput = screen.getByPlaceholderText('Search NASA Media');
    fireEvent.change(searchInput, { target: { value: 'moon' } });
    expect(searchInput.value).toBe('moon');
  });

  it('renders the search input', () => {
    renderWithRouter(<SearchPage />);
    const searchInput = screen.getByPlaceholderText('Search NASA Media');
    expect(searchInput).toBeInTheDocument();
  });

  it('submits the search form and calls the API', async () => {
    axios.get.mockResolvedValue({
      data: {
        collection: {
          items: [],
        },
      },
    });
  });
});

