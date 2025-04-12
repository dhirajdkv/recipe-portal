import React, { useState } from 'react';

const RecipeCard = ({ recipe }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const CompactView = () => (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-semibold text-gray-800">{recipe.name}</h3>
      <div className="mt-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Main ingredients:</span>
          <span className="text-sm text-gray-700">
            {recipe.ingredients?.slice(0, 3).map(ing => ing.name).join(', ')}
            {recipe.ingredients?.length > 3 ? '...' : ''}
          </span>
        </div>
      </div>
      <button
        onClick={() => setIsExpanded(true)}
        className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium focus:outline-none"
      >
        View Details →
      </button>
    </div>
  );

  const DetailedView = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 sticky top-0">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-white">{recipe.name}</h2>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white hover:text-blue-100 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Ingredients</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-2">
                {recipe.ingredients?.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md"
                  >
                    <span className="text-gray-700">{ingredient.name}</span>
                    <span className="text-gray-500">
                      {ingredient.quantity !== null ? ingredient.quantity : ''} {ingredient.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {recipe.instructions && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Instructions</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="pl-2">{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return isExpanded ? <DetailedView /> : <CompactView />;
};

export default RecipeCard; 