import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GenerateRecipeModal from '../GenerateRecipeModal';
import { recipeService } from '../../../services/recipeService';

jest.mock('../../../services/recipeService', () => ({
  recipeService: {
    searchRecipes: jest.fn(),
    getRecipeById: jest.fn(),
    getConsolidatedList: jest.fn(),
    getAIConsolidatedList: jest.fn(),
    generateRecipe: jest.fn()
  }
}));

describe('GenerateRecipeModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const initialRecipeName = 'Butter Chicken';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the input form correctly', () => {
    render(
      <GenerateRecipeModal 
        onClose={mockOnClose} 
        onSave={mockOnSave} 
        initialRecipeName={initialRecipeName}
      />
    );
    
    expect(screen.getByText('Generate New Recipe')).toBeInTheDocument();
    
    const input = screen.getByLabelText(/recipe name/i);
    expect(input).toHaveValue(initialRecipeName);
    
    expect(screen.getByText('Generate Recipe')).toBeInTheDocument();
  });

  it('prevents generation with empty recipe name', () => {
    render(
      <GenerateRecipeModal 
        onClose={mockOnClose} 
        onSave={mockOnSave}
      />
    );
    
    const input = screen.getByLabelText(/recipe name/i);
    fireEvent.change(input, { target: { value: '' } });
    
    const generateButton = screen.getByText('Generate Recipe');
    fireEvent.click(generateButton);
    
    expect(screen.getByText('Please enter a recipe name')).toBeInTheDocument();
    
    expect(recipeService.generateRecipe).not.toHaveBeenCalled();
  });

  it('handles recipe generation successfully', async () => {
    const mockGeneratedRecipe = {
      name: 'Butter Chicken',
      ingredients: [
        { name: 'Chicken', quantity: 500, unit: 'g' },
        { name: 'Butter', quantity: 100, unit: 'g' }
      ],
      instructions: [
        'Marinate the chicken',
        'Cook in butter'
      ]
    };
    
    recipeService.generateRecipe.mockResolvedValue(mockGeneratedRecipe);
    
    render(
      <GenerateRecipeModal 
        onClose={mockOnClose} 
        onSave={mockOnSave} 
        initialRecipeName={initialRecipeName}
      />
    );
    
    const generateButton = screen.getByText('Generate Recipe');
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(recipeService.generateRecipe).toHaveBeenCalledWith(initialRecipeName);
    });
    
    expect(mockOnSave).toHaveBeenCalledWith(mockGeneratedRecipe);
  });

  it('handles recipe generation errors', async () => {
    recipeService.generateRecipe.mockRejectedValue(new Error('Generation failed'));
    
    render(
      <GenerateRecipeModal 
        onClose={mockOnClose} 
        onSave={mockOnSave} 
        initialRecipeName={initialRecipeName}
      />
    );
    
    const generateButton = screen.getByText('Generate Recipe');
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(recipeService.generateRecipe).toHaveBeenCalledWith(initialRecipeName);
    });
    
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('handles close button click', () => {
    render(
      <GenerateRecipeModal 
        onClose={mockOnClose} 
        onSave={mockOnSave} 
        initialRecipeName={initialRecipeName}
      />
    );
    
    const closeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('updates the recipe name on input change', () => {
    render(
      <GenerateRecipeModal 
        onClose={mockOnClose} 
        onSave={mockOnSave} 
        initialRecipeName=""
      />
    );
    
    const input = screen.getByLabelText(/recipe name/i);
    
    const newRecipeName = 'Chicken Tikka Masala';
    fireEvent.change(input, { target: { value: newRecipeName } });
    
    expect(input).toHaveValue(newRecipeName);
  });
}); 