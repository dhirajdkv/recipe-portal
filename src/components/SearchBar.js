import React, { useState, useEffect, useRef } from 'react';
import { recipeService } from '../services/recipeService';
import { handleError } from '../utils/errorHandler';
import ConsolidatedList from './modals/ConsolidatedList';
import RecipeModal from './modals/RecipeModal';
import GenerateRecipeModal from './modals/GenerateRecipeModal';

const SearchBar = ({ onSearchResults }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [showConsolidatedList, setShowConsolidatedList] = useState(false);
  const [consolidatedIngredients, setConsolidatedIngredients] = useState([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [noResults, setNoResults] = useState(false);
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
        setNoResults(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setNoResults(false);
      
      try {
        const response = await recipeService.searchRecipes(trimmedQuery);
        if (response.data && Array.isArray(response.data)) {
          setSuggestions(response.data);
          setShowSuggestions(true);
          setNoResults(response.data.length === 0);
        } else {
          setSuggestions([]);
          setShowSuggestions(true);
          setNoResults(true);
        }
      } catch (error) {
        const handledError = handleError(error);
        setError(handledError.message);
        setSuggestions([]);
        setNoResults(true);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handleSuggestionClick = async (suggestion) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch complete recipe details
      const recipeId = suggestion.id || suggestion._id;
      const recipeDetails = await recipeService.getRecipeById(recipeId);
      
      if (recipeDetails) {
        setSelectedRecipe(recipeDetails);
        setShowModal(true);
      } else {
        setError('Failed to load recipe details');
      }
    } catch (error) {
      const handledError = handleError(error);
      setError(handledError.message);
    } finally {
      setIsLoading(false);
      setShowSuggestions(false);
    }
  };

  const handleAddToList = (e, suggestion) => {
    e.stopPropagation(); // Prevent triggering the handleSuggestionClick
    
    if (selectedRecipes.length >= 4) {
      setError('You can select up to 4 recipes');
      return;
    }

    if (selectedRecipes.some(recipe => recipe._id === suggestion._id)) {
      setError('This recipe is already selected');
      return;
    }

    setSelectedRecipes([...selectedRecipes, suggestion]);
    setError(null);
  };

  const removeSelectedRecipe = (recipeId) => {
    setSelectedRecipes(selectedRecipes.filter(recipe => recipe._id !== recipeId));
  };

  const handleGetConsolidatedList = async () => {
    if (selectedRecipes.length === 0) {
      setError('Please select at least one recipe');
      return;
    }

    setIsLoading(true);
    try {
      const response = await recipeService.getConsolidatedList(
        selectedRecipes.map(recipe => recipe.id ? recipe.id.toString() : recipe._id)
      );
      if (response && response.ingredients) {
        setConsolidatedIngredients(response.ingredients);
        setShowConsolidatedList(true);
      } else {
        setError('Failed to get consolidated list');
      }
    } catch (error) {
      const handledError = handleError(error);
      setError(handledError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGeneratedRecipe = async (recipe) => {
    try {
      // Process ingredients to ensure they have proper format
      const processedIngredients = recipe.ingredients.map((ingredient, index) => ({
        ...ingredient,
        id: `ingredient-${index}`, // Add ID for tracking
        name: ingredient.name || '',
        quantity: ingredient.quantity || 0,
        unit: ingredient.unit || ''
      }));
      
      // Create a recipe object with the processed ingredients
      const processedRecipe = {
        ...recipe,
        ingredients: processedIngredients
      };
      
      // Set the generated recipe as the selected recipe
      setSelectedRecipes([processedRecipe]);
      
      // Set processed ingredients for the consolidated list
      setConsolidatedIngredients(processedIngredients);
      setShowConsolidatedList(true);
      
      setShowGenerateModal(false);
      setQuery('');
      setShowSuggestions(false);
      setNoResults(false);
    } catch (error) {
      const handledError = handleError(error);
      setError(handledError.message);
    }
  };

  const handleGenerateRecipe = () => {
    setShowGenerateModal(true);
    setShowSuggestions(false);
  };

  return (
    <div className="relative max-w-2xl mx-auto" ref={searchContainerRef}>
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {selectedRecipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center space-x-2"
            >
              <span>{recipe.name}</span>
              <button
                onClick={() => removeSelectedRecipe(recipe._id)}
                className="text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        {selectedRecipes.length > 0 && (
          <button
            onClick={handleGetConsolidatedList}
            className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Get Grocery List ({selectedRecipes.length}/4 recipes)
          </button>
        )}
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowSuggestions(true)}
            placeholder={selectedRecipes.length >= 4 ? "Maximum recipes selected" : "Search for recipes..."}
            disabled={selectedRecipes.length >= 4}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm text-gray-800 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            <p className="text-lg font-medium">Processing your request... 🛒</p>
            <p className="text-sm mt-1">Creating your grocery list!</p>
          </div>
        )}

        {error && (
          <div className="mt-2 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {showSuggestions && query.trim() && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-40">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <div 
                  key={suggestion._id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div 
                    className="flex items-center space-x-3 flex-grow"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <svg className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-gray-700 truncate">{suggestion.name}</span>
                  </div>
                  <button
                    onClick={(e) => handleAddToList(e, suggestion)}
                    className="ml-2 text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors"
                    disabled={selectedRecipes.some(recipe => recipe._id === suggestion._id)}
                    title={selectedRecipes.some(recipe => recipe._id === suggestion._id) ? 
                      "Already added to list" : "Add to grocery list"}
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              ))
            ) : noResults ? (
              <div className="p-4">
                <p className="text-gray-600 mb-3">No recipes found for "{query}"</p>
                <button
                  onClick={handleGenerateRecipe}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Generate Recipe for "{query}"</span>
                </button>
              </div>
            ) : null}
          </div>
        )}
      </form>

      {showModal && selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {showConsolidatedList && (
        <ConsolidatedList
          ingredients={consolidatedIngredients}
          onClose={() => setShowConsolidatedList(false)}
          recipeIds={selectedRecipes.map(recipe => recipe.id ? recipe.id.toString() : recipe._id)}
        />
      )}

      {showGenerateModal && (
        <GenerateRecipeModal
          onClose={() => setShowGenerateModal(false)}
          onSave={handleSaveGeneratedRecipe}
          initialRecipeName={query}
        />
      )}
    </div>
  );
};

export default SearchBar; 