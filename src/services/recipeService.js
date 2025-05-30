import api from './api';

// Check if AI features are enabled
const AI_FEATURES_ENABLED = process.env.REACT_APP_ENABLE_AI_FEATURES === 'enabled';
// Mock data for development
const MOCK_RECIPES = [
  {
    id: 1,
    name: 'Sambar',
    cuisine: 'South Indian',
    description: 'A spicy and tangy lentil-based vegetable stew from South India',
    ingredients: [
      { name: 'Toor Dal', quantity: 1, unit: 'cup' },
      { name: 'Mixed Vegetables', quantity: 2, unit: 'cups' },
      { name: 'Sambar Powder', quantity: 2, unit: 'tbsp' },
      { name: 'Tamarind Paste', quantity: 1, unit: 'tbsp' },
      { name: 'Mustard Seeds', quantity: 1, unit: 'tsp' },
      { name: 'Curry Leaves', quantity: 1, unit: 'sprig' }
    ],
    instructions: [
      'Soak tamarind in warm water for 15 minutes',
      'Cook toor dal until soft and mushy',
      'Prepare tempering with mustard seeds and curry leaves',
      'Add vegetables and sambar powder',
      'Simmer until vegetables are cooked',
      'Add tamarind extract and salt to taste'
    ]
  },
  {
    id: 2,
    name: 'Aloo Gobi',
    cuisine: 'North Indian',
    description: 'A classic Indian dish made with potatoes and cauliflower',
    ingredients: [
      { name: 'Potatoes', quantity: 2, unit: 'medium' },
      { name: 'Cauliflower', quantity: 1, unit: 'medium' },
      { name: 'Cumin Seeds', quantity: 1, unit: 'tsp' },
      { name: 'Turmeric Powder', quantity: 1, unit: 'tsp' },
      { name: 'Garam Masala', quantity: 1, unit: 'tsp' }
    ],
    instructions: [
      'Cut vegetables into medium-sized pieces',
      'Heat oil and add cumin seeds',
      'Add potatoes and cauliflower',
      'Add spices and mix well',
      'Cook until vegetables are tender'
    ]
  },
  {
    id: 3,
    name: 'Pav Bhaji',
    cuisine: 'Maharashtra',
    description: 'A spicy mashed vegetable dish served with butter-toasted bread rolls',
    ingredients: [
      { name: 'Mixed Vegetables', quantity: 4, unit: 'cups' },
      { name: 'Pav Bhaji Masala', quantity: 2, unit: 'tbsp' },
      { name: 'Butter', quantity: 4, unit: 'tbsp' },
      { name: 'Dinner Rolls (Pav)', quantity: 8, unit: 'pieces' }
    ]
  },
  {
    id: 4,
    name: 'Kaali Dal',
    cuisine: 'North Indian',
    description: 'Creamy black lentils cooked overnight with spices',
    ingredients: [
      { name: 'Black Lentils', quantity: 1, unit: 'cup' },
      { name: 'Kidney Beans', quantity: 0.5, unit: 'cup' },
      { name: 'Cream', quantity: 0.25, unit: 'cup' }
    ]
  },
  {
    id: 5,
    name: 'Chana Masala',
    cuisine: 'North Indian',
    description: 'Spiced chickpeas curry, a popular vegetarian dish',
    ingredients: [
      { name: 'Chickpeas', quantity: 2, unit: 'cups' },
      { name: 'Onion', quantity: 1, unit: 'large' },
      { name: 'Tomatoes', quantity: 2, unit: 'medium' }
    ]
  }
];

export const recipeService = {
  searchRecipes: async (query) => {
    try {
      const response = await api.get('/recipes/search', {
        params: { query }
      });
      
      // If we got actual data from the API, use it
      if (response && response.recipes) {
        return {
          data: response.recipes.slice(0, 5)
        };
      }
      
      // If we're in development and got no data, use mock data
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for recipe search');
        return {
          data: MOCK_RECIPES.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase())
          )
        };
      }

      return { data: [] };
    } catch (error) {
      console.error('Error searching recipes:', error);
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to mock data due to error');
        return {
          data: MOCK_RECIPES.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase())
          )
        };
      }
      throw new Error('Failed to search recipes. Please try again later.');
    }
  },

  getRecipeById: async (id) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for recipe details');
        const mockRecipe = MOCK_RECIPES.find(r => r.id === parseInt(id));
        return { data: mockRecipe || null };
      }
      throw new Error('Failed to fetch recipe details. Please try again later.');
    }
  },

  getConsolidatedList: async (recipeIds) => {
    try {
      const response = await api.post('/recipes/consolidated-list', {
        recipeIds: recipeIds
      });
      
      if (response && response.ingredients) {
        return response;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for consolidated list');
        const selectedRecipes = MOCK_RECIPES.filter(recipe => 
          recipeIds.includes(recipe.id.toString())
        );
        
        const allIngredients = selectedRecipes.reduce((acc, recipe) => {
          if (recipe.ingredients) {
            acc.push(...recipe.ingredients);
          }
          return acc;
        }, []);

        return {
          ingredients: allIngredients
        };
      }

      return { ingredients: [] };
    } catch (error) {
      console.error('Error getting consolidated list:', error);
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to mock data due to error');
        const selectedRecipes = MOCK_RECIPES.filter(recipe => 
          recipeIds.includes(recipe.id.toString())
        );
        
        const allIngredients = selectedRecipes.reduce((acc, recipe) => {
          if (recipe.ingredients) {
            acc.push(...recipe.ingredients);
          }
          return acc;
        }, []);

        return {
          ingredients: allIngredients
        };
      }
      throw new Error('Failed to get consolidated list. Please try again later.');
    }
  },

  generateRecipe: async (recipeName) => {
    // Only allow recipe generation if AI features are enabled
    if (!AI_FEATURES_ENABLED) {
      throw new Error('AI recipe generation is not enabled');
    }

    try {
      const response = await api.post('/recipes/generate', { name: recipeName });
      return response;
    } catch (error) {
      console.error('Error generating recipe:', error);
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for recipe generation');
        return {
          name: recipeName,
          ingredients: [
            { name: 'Onion', quantity: 2, unit: 'medium' },
            { name: 'Tomato', quantity: 3, unit: 'large' },
            { name: 'Ginger', quantity: 1, unit: 'inch' },
            { name: 'Garlic', quantity: 4, unit: 'cloves' },
            { name: 'Turmeric', quantity: 1, unit: 'tsp' },
            { name: 'Red Chili Powder', quantity: 1, unit: 'tsp' },
            { name: 'Garam Masala', quantity: 1, unit: 'tsp' },
            { name: 'Salt', quantity: 0, unit: 'to taste' }
          ],
          instructions: [
            'Chop the onions and tomatoes',
            'Heat oil in a pan',
            'Add chopped onions and sauté till golden brown',
            'Add ginger garlic paste and sauté for 2 minutes',
            'Add tomatoes and cook till soft',
            'Add all the spices and cook for 5 minutes'
          ]
        };
      }
      throw new Error('Failed to generate recipe. Please try again later.');
    }
  },
}; 