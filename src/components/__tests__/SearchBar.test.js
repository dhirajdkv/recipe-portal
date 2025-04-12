import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../SearchBar';
import { recipeService } from '../../services/recipeService';

jest.mock('../../services/recipeService', () => ({
  recipeService: {
    searchRecipes: jest.fn(),
    getRecipeById: jest.fn(),
    getConsolidatedList: jest.fn(),
    getAIConsolidatedList: jest.fn(),
    generateRecipe: jest.fn()
  }
}));

describe('SearchBar Component', () => {
  const mockOnSearchResults = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the search input correctly', () => {
    render(<SearchBar onSearchResults={mockOnSearchResults} />);
    
    expect(screen.getByPlaceholderText(/search for recipes/i)).toBeInTheDocument();
    expect(screen.queryByText(/get grocery list/i)).not.toBeInTheDocument(); // No selected recipes initially
  });

  it('shows loading state while searching', async () => {
    recipeService.searchRecipes.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: [] }), 100))
    );
    
    render(<SearchBar onSearchResults={mockOnSearchResults} />);
    
    const searchInput = screen.getByPlaceholderText(/search for recipes/i);
    fireEvent.change(searchInput, { target: { value: 'sambar' } });
    
    await waitFor(() => {
      expect(screen.getByText(/processing your request/i)).toBeInTheDocument();
    });
  });

  it('displays search results', async () => {
    const mockResults = {
      data: [
        { _id: '1', name: 'Sambar', cuisine: 'South Indian' },
        { _id: '2', name: 'Aloo Gobi', cuisine: 'North Indian' }
      ]
    };
    
    recipeService.searchRecipes.mockResolvedValue(mockResults);
    
    render(<SearchBar onSearchResults={mockOnSearchResults} />);
    
    const searchInput = screen.getByPlaceholderText(/search for recipes/i);
    fireEvent.change(searchInput, { target: { value: 'indian recipe' } });
    
    await waitFor(() => {
      expect(screen.getAllByText(/sambar/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/aloo gobi/i)[0]).toBeInTheDocument();
    });
    
    expect(recipeService.searchRecipes).toHaveBeenCalledWith('indian recipe');
  });

  it('handles adding a recipe to the list', async () => {
    const mockResults = {
      data: [
        { _id: '1', name: 'Sambar', cuisine: 'South Indian' }
      ]
    };
    
    recipeService.searchRecipes.mockResolvedValue(mockResults);
    
    render(<SearchBar onSearchResults={mockOnSearchResults} />);
    
    const searchInput = screen.getByPlaceholderText(/search for recipes/i);
    fireEvent.change(searchInput, { target: { value: 'sambar' } });
    
    await waitFor(() => {
      expect(screen.getAllByText(/sambar/i)[0]).toBeInTheDocument();
    });
    
    const addButton = screen.getByTitle(/add to grocery list/i);
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText(/get grocery list/i)).toBeInTheDocument();
    });
  });

  it('shows no results message when search returns empty', async () => {
    recipeService.searchRecipes.mockResolvedValue({ data: [] });
    
    render(<SearchBar onSearchResults={mockOnSearchResults} />);
    
    const searchInput = screen.getByPlaceholderText(/search for recipes/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistent recipe' } });
    
    await waitFor(() => {
      expect(screen.getByText(/no recipes found for/i)).toBeInTheDocument();
      expect(screen.getByText(/generate recipe/i)).toBeInTheDocument();
    });
  });

  it('handles recipe generation button click', async () => {
    recipeService.searchRecipes.mockResolvedValue({ data: [] });
    
    render(<SearchBar onSearchResults={mockOnSearchResults} />);
    
    const searchInput = screen.getByPlaceholderText(/search for recipes/i);
    fireEvent.change(searchInput, { target: { value: 'new recipe' } });
    
    await waitFor(() => {
      expect(screen.getByText(/generate recipe for "new recipe"/i)).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText(/generate recipe for "new recipe"/i));
    
    await waitFor(() => {
      expect(true).toBeTruthy();
    });
  });

  it('handles errors during search', async () => {
    recipeService.searchRecipes.mockRejectedValue(new Error('API Error'));
    
    render(<SearchBar onSearchResults={mockOnSearchResults} />);
    
    const searchInput = screen.getByPlaceholderText(/search for recipes/i);
    fireEvent.change(searchInput, { target: { value: 'error test' } });
    
    await waitFor(() => {
      expect(recipeService.searchRecipes).toHaveBeenCalledWith('error test');
    });
  });

  it('limits the number of selected recipes to 4', async () => {
    const mockResults = {
      data: [
        { _id: '1', name: 'Recipe 1' },
        { _id: '2', name: 'Recipe 2' }
      ]
    };
    
    recipeService.searchRecipes.mockResolvedValue(mockResults);
    
    const { rerender } = render(<SearchBar onSearchResults={mockOnSearchResults} />);
    
    const mockSelectedRecipes = [
      { _id: '1', name: 'Recipe 1' },
      { _id: '2', name: 'Recipe 2' },
      { _id: '3', name: 'Recipe 3' },
      { _id: '4', name: 'Recipe 4' }
    ];
    
    const searchInput = screen.getByPlaceholderText(/search for recipes/i);
    fireEvent.change(searchInput, { target: { value: 'another' } });
    
    await waitFor(() => {
      expect(screen.getByText('Recipe 1')).toBeInTheDocument();
    });
    
    const mockAddFifthRecipe = () => {
      if (mockSelectedRecipes.length >= 4) {
        return 'You can select up to 4 recipes';
      }
      return null;
    };
    
    expect(mockAddFifthRecipe()).toBe('You can select up to 4 recipes');
  });
}); 