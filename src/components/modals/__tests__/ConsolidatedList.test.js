import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConsolidatedList from '../ConsolidatedList';
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

describe('ConsolidatedList Component', () => {
  const mockOnClose = jest.fn();
  const mockIngredients = [
    { id: '1', name: 'Tomatoes', quantity: 2, unit: 'medium' },
    { id: '2', name: 'Onions', quantity: 1, unit: 'large' },
    { id: '3', name: 'Salt', quantity: 0, unit: 'to taste' },
    { id: '4', name: 'Cilantro', quantity: 1, unit: 'bunch' }
  ];
  const mockRecipeIds = ['recipe1', 'recipe2'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles AI consolidation button click', async () => {
    const mockAIIngredients = [
      { id: '5', name: 'Consolidated Tomatoes', quantity: 3, unit: 'medium' },
      { id: '6', name: 'Consolidated Onions', quantity: 2, unit: 'medium' }
    ];
    
    recipeService.getAIConsolidatedList.mockResolvedValue({
      ingredients: mockAIIngredients
    });
    
    render(
      <ConsolidatedList 
        ingredients={mockIngredients} 
        onClose={mockOnClose} 
        recipeIds={mockRecipeIds}
      />
    );
    
    const aiButton = screen.getByText('AI Consolidation');
    fireEvent.click(aiButton);
    
    await waitFor(() => {
      expect(recipeService.getAIConsolidatedList).toHaveBeenCalledWith(mockRecipeIds);
    });
  });

  it('handles errors during AI consolidation', async () => {
    recipeService.getAIConsolidatedList.mockRejectedValue(new Error('API Error'));
    
    render(
      <ConsolidatedList 
        ingredients={mockIngredients} 
        onClose={mockOnClose} 
        recipeIds={mockRecipeIds}
      />
    );
    
    const aiButton = screen.getByText('AI Consolidation');
    fireEvent.click(aiButton);
    
    await waitFor(() => {
      expect(recipeService.getAIConsolidatedList).toHaveBeenCalledWith(mockRecipeIds);
    });
  });

  it('renders the ingredient list correctly', () => {
    render(
      <ConsolidatedList 
        ingredients={mockIngredients} 
        onClose={mockOnClose} 
        recipeIds={mockRecipeIds}
      />
    );
    
    expect(screen.getByText('Consolidated Grocery List')).toBeInTheDocument();
    
    expect(screen.getByText(/2 medium Tomatoes/)).toBeInTheDocument();
    expect(screen.getByText(/1 large Onions/)).toBeInTheDocument();
    expect(screen.getByText('Salt')).toBeInTheDocument();
    expect(screen.getByText(/1 bunch Cilantro/)).toBeInTheDocument();
    
    expect(screen.getByText('AI Consolidation')).toBeInTheDocument();
  });

  it('formats ingredients with 0 quantity correctly', () => {
    render(
      <ConsolidatedList 
        ingredients={mockIngredients} 
        onClose={mockOnClose} 
        recipeIds={mockRecipeIds}
      />
    );
    
    const saltElement = screen.getByText('Salt');
    expect(saltElement).toBeInTheDocument();
    
    const saltLabel = saltElement.closest('label');
    expect(saltLabel).not.toHaveTextContent(/0/);
  });

  it('handles the close button click', () => {
    render(
      <ConsolidatedList 
        ingredients={mockIngredients} 
        onClose={mockOnClose} 
        recipeIds={mockRecipeIds}
      />
    );
    
    const closeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('displays "No ingredients" message when list is empty', () => {
    render(
      <ConsolidatedList 
        ingredients={[]} 
        onClose={mockOnClose} 
        recipeIds={mockRecipeIds}
      />
    );
    
    expect(screen.getByText('No ingredients to display')).toBeInTheDocument();
  });

  it('handles checkbox interactions', () => {
    render(
      <ConsolidatedList 
        ingredients={mockIngredients} 
        onClose={mockOnClose} 
        recipeIds={mockRecipeIds}
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(mockIngredients.length);
    
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
    
    fireEvent.click(checkboxes[0]);
    
    expect(checkboxes[0]).toBeChecked();
  });
}); 