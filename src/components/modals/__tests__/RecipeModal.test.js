import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecipeModal from '../RecipeModal';

describe('RecipeModal Component', () => {
  const mockOnClose = jest.fn();
  const mockRecipe = {
    name: 'Vegetable Biryani',
    ingredients: [
      { name: 'Basmati Rice', quantity: 2, unit: 'cups' },
      { name: 'Mixed Vegetables', quantity: 3, unit: 'cups' },
      { name: 'Ghee', quantity: 2, unit: 'tbsp' },
      { name: 'Biryani Masala', quantity: 1, unit: 'tbsp' }
    ],
    instructions: [
      'Soak rice for 30 minutes',
      'Parboil the rice and drain',
      'Sauté vegetables with spices',
      'Layer rice and vegetables',
      'Cover and cook on low heat for 20 minutes'
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders recipe details correctly', () => {
    render(<RecipeModal recipe={mockRecipe} onClose={mockOnClose} />);
    
    expect(screen.getByText('Vegetable Biryani')).toBeInTheDocument();
    
    expect(screen.getByText(/2 cups basmati rice/i)).toBeInTheDocument();
    expect(screen.getByText(/3 cups mixed vegetables/i)).toBeInTheDocument();
    expect(screen.getByText(/2 tbsp ghee/i)).toBeInTheDocument();
    expect(screen.getByText(/1 tbsp biryani masala/i)).toBeInTheDocument();
    
    expect(screen.getByText('Soak rice for 30 minutes')).toBeInTheDocument();
    expect(screen.getByText('Parboil the rice and drain')).toBeInTheDocument();
    expect(screen.getByText('Layer rice and vegetables')).toBeInTheDocument();
  });

  it('handles close button click', () => {
    render(<RecipeModal recipe={mockRecipe} onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('returns null if no recipe is provided', () => {
    const { container } = render(<RecipeModal onClose={mockOnClose} />);
    
    expect(container).toBeEmptyDOMElement();
  });

  it('handles missing ingredients or instructions', () => {
    const incompleteRecipe = {
      name: 'Incomplete Recipe',
    };
    
    render(<RecipeModal recipe={incompleteRecipe} onClose={mockOnClose} />);
    
    expect(screen.getByText('Incomplete Recipe')).toBeInTheDocument();
    
    expect(screen.queryByText('Ingredients')).not.toBeInTheDocument();
    expect(screen.queryByText('Instructions')).not.toBeInTheDocument();
  });

  it('displays correct layout for ingredients and instructions', () => {
    render(<RecipeModal recipe={mockRecipe} onClose={mockOnClose} />);
    
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
    expect(screen.getByText('Instructions')).toBeInTheDocument();
    
    const instructionItems = screen.getAllByText(/^\d+$/);
    expect(instructionItems.length).toBe(mockRecipe.instructions.length);
    
    const ingredientBullets = screen.getAllByText('•');
    expect(ingredientBullets.length).toBe(mockRecipe.ingredients.length);
  });
}); 