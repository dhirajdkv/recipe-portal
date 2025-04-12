import api from './api';

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
        return {
          data: MOCK_RECIPES.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase())
          )
        };
      }

      // If neither condition is met, return empty data
      return { data: [] };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        return {
          data: MOCK_RECIPES.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase())
          )
        };
      }
      throw error;
    }
  },

  getRecipeById: async (id) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        const mockRecipe = MOCK_RECIPES.find(r => r.id === parseInt(id));
        return { data: mockRecipe || null };
      }
      throw error;
    }
  },

  // Add more recipe-related API calls here
  createRecipe: async (recipeData) => {
    const response = await api.post('/recipes', recipeData);
    return response;
  },

  updateRecipe: async (id, recipeData) => {
    const response = await api.put(`/recipes/${id}`, recipeData);
    return response;
  },

  deleteRecipe: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response;
  }
}; 