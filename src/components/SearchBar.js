import React, { useState, useEffect, useRef } from 'react';
import { recipeService } from '../services/recipeService';
import { handleError } from '../utils/errorHandler';

const RecipeModal = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4">{recipe.name}</h2>

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="text-blue-500">•</span>
                  <span>{ingredient.quantity} {ingredient.unit} {ingredient.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {recipe.instructions && recipe.instructions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Instructions</h3>
            <ol className="space-y-3">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <p className="text-gray-700">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

const SearchBar = ({ onSearchResults }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const searchContainerRef = useRef(null);

  // Closing suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. When the user types, we wait 300ms before making an API call to prevent excessive requests
  // 2. If the query is empty, we clear suggestions and hide the dropdown
  // 3. If there's a query, we:
  //    - show a loading state
  //    - call the recipe search API
  //    - display up to 5 suggestions in the dropdown
  //    - handle any errors that occur during the search
  // this debouncing helps with performance and provides a smooth user experience :)
  useEffect(() => {
    const debounceTimeout = setTimeout(async () => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setSuggestions([]);
        setShowSuggestions(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const response = await recipeService.searchRecipes(trimmedQuery);
        if (response.data && Array.isArray(response.data)) {
          setSuggestions(response.data);
          setShowSuggestions(response.data.length > 0);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        const handledError = handleError(error);
        setError(handledError.message);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handleSuggestionClick = async (suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      const response = await recipeService.getRecipeById(suggestion._id);
      console.log(response);
      if (response) {
        setSelectedRecipe(response);
        setShowModal(true);
      } else {
        setError('Recipe details not found');
      }
    } catch (error) {
      const handledError = handleError(error);
      setError(handledError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      onSearchResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await recipeService.searchRecipes(trimmedQuery);
      if (Array.isArray(response.data)) {
        onSearchResults(response.data);
      } else {
        onSearchResults([]);
        setError('No recipes found');
      }
    } catch (err) {
      setError(err.message || 'Failed to search recipes');
      onSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto" ref={searchContainerRef}>
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowSuggestions(true)}
            placeholder="Search for recipes..."
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm text-gray-800 placeholder-gray-400"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="mt-4 text-center text-gray-600 animate-pulse">
            <p className="text-lg font-medium">Hunting for delicious recipes... 🍳</p>
            <p className="text-sm mt-1">Get ready for some culinary inspiration!</p>
          </div>
        )}

        {error && (
          <div className="mt-2 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-40">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion._id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 flex items-center space-x-3"
              >
                <svg className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-gray-700 truncate">{suggestion.name}</span>
              </button>
            ))}
          </div>
        )}
      </form>

      {showModal && selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default SearchBar; 