import React, { useState } from 'react';
import { recipeService } from '../../services/recipeService';
import { handleError } from '../../utils/errorHandler';

const ConsolidatedList = ({ ingredients: initialIngredients, onClose, recipeIds }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIngredients, setCurrentIngredients] = useState(initialIngredients);

  // Format ingredient text for display
  const formatIngredient = (ingredient) => {
    if (!ingredient.quantity || ingredient.quantity === 0) {
      return ingredient.name;
    }
    const quantity = parseFloat(ingredient.quantity.toFixed(2));
    return ingredient.unit 
      ? `${quantity} ${ingredient.unit} ${ingredient.name}`
      : `${quantity} ${ingredient.name}`;
  };

  const handleAIConsolidation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await recipeService.getAIConsolidatedList(recipeIds);
      if (response && response.ingredients) {
        setCurrentIngredients(response.ingredients);
      } else {
        setError('Failed to get AI consolidated list');
      }
    } catch (error) {
      const handledError = handleError(error);
      setError(handledError.message);
    } finally {
      setIsLoading(false);
    }
  };

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

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Consolidated Grocery List</h2>
          <button
            onClick={handleAIConsolidation}
            disabled={isLoading}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:bg-purple-300 flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Consolidating...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>AI Consolidation</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          {currentIngredients.map((ingredient, index) => (
            <div key={ingredient.id || index} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={`ingredient-${index}`}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`ingredient-${index}`} className="text-gray-700">
                {formatIngredient(ingredient)}
              </label>
            </div>
          ))}
        </div>

        {currentIngredients.length === 0 && (
          <div className="text-center text-gray-500">
            No ingredients to display
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsolidatedList; 