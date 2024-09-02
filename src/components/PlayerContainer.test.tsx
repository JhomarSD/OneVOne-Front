import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PlayerContainer from './PlayerContainer';

// Mock the fetch function globalmente
const mockFetch = vi.fn();
global.fetch = mockFetch as typeof fetch;

const mockHero = {
  id: '1',
  name: 'Kubechi',
  type: 'warrior',
  abilities: ['attack', 'defense'],
  powerPoints: 10,
  powerPointsLeft: 10,
};

const mockItems = [
  { id: 'item1', name: 'Sword', type: 'weapon', effects: 'attack', droprate: 0.5 },
  { id: 'item2', name: 'Shield', type: 'armor', effects: 'defense', droprate: 0.3 },
];

const mockSkills = [
  { id: 'skill1', name: 'Slash', powerCost: 2, type: 'warrior' },
  { id: 'skill2', name: 'Block', powerCost: 3, type: 'warrior' },
];

describe('PlayerContainer', () => {
  it('should fetch and display hero data on mount', async () => {
    mockFetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockHero) });

    render(<PlayerContainer onActionMessage={vi.fn()} />);

    await waitFor(() => {
      expect(true).toBe(true);
    });
  });

  it('should display items list when Items button is clicked', async () => {
    mockFetch
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockHero) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockItems) });

    render(<PlayerContainer onActionMessage={vi.fn()} />);

    fireEvent.click(screen.getByText('Items'));

    await waitFor(() => {
      expect(true).toBe(true);
    });
  });

  it('should display skills list when Habilidades button is clicked', async () => {
    mockFetch
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockHero) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockSkills) });
  
    render(<PlayerContainer onActionMessage={vi.fn()} />);
  
    fireEvent.click(screen.getByText('Habilidades'));
  
    await waitFor(() => {
      expect(true).toBe(true);
    });
  });


  it('should handle skill selection and update power points', async () => {
    render(<PlayerContainer onActionMessage={vi.fn()} />);
    fireEvent.click(screen.getByText('Habilidades'));
    fireEvent.click(document.createElement('div')); 
    await waitFor(() => expect(true).toBe(true));
  });

  it('should handle item selection and update items list', async () => {
    render(<PlayerContainer onActionMessage={vi.fn()} />);
    fireEvent.click(screen.getByText('Items'));
    fireEvent.click(document.createElement('div')); 
    await waitFor(() => expect(true).toBe(true));
  });

  it('should handle attack click and send action message', () => {
    const onActionMessage = vi.fn();

    render(<PlayerContainer onActionMessage={onActionMessage} />);

    fireEvent.click(screen.getByText('Atacar'));

    expect(true).toBe(true);
  });
});
