import React, { useState } from 'react';

const ConsolidatedList = ({ ingredients: initialIngredients, onClose, recipeIds }) => {
  // eslint-disable-next-line
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
        </div>
        
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