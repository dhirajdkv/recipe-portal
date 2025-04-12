import React, { useState, useEffect } from 'react';
import { recipeService } from '../../services/recipeService';
import { handleError } from '../../utils/errorHandler';

const GenerateRecipeModal = ({ onClose, onSave, initialRecipeName = '' }) => {
  const [recipeName, setRecipeName] = useState(initialRecipeName);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialRecipeName) {
      setRecipeName(initialRecipeName);
    }
  }, [initialRecipeName]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!recipeName.trim()) {
      setError('Please enter a recipe name');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await recipeService.generateRecipe(recipeName);
      setGeneratedRecipe(response);
      onSave(response);
    } catch (error) {
      const handledError = handleError(error);
      setError(handledError.message);
    } finally {
      setIsGenerating(false);
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

        <h2 className="text-2xl font-bold mb-6">Generate New Recipe</h2>

        {!generatedRecipe ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label htmlFor="recipeName" className="block text-sm font-medium text-gray-700 mb-1">
                Recipe Name
              </label>
              <input
                type="text"
                id="recipeName"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="Enter recipe name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {isGenerating ? 'Generating Recipe...' : 'Generate Recipe'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Generated Recipe: {generatedRecipe.name}</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Ingredients:</h4>
                <ul className="space-y-2">
                  {generatedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="text-blue-500">•</span>
                      <span>
                        {ingredient.quantity} {ingredient.unit} {ingredient.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {generatedRecipe.instructions && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-2">
                    {generatedRecipe.instructions.map((instruction, index) => (
                      <li key={index} className="text-gray-700">{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateRecipeModal; 