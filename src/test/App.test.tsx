import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App Integration', () => {
  it('renders the Virtual Robot Tamagotchi Voice AI Agent application', () => {
    render(<App />);

    expect(screen.getByTestId('virtual-robot-canvas')).toBeInTheDocument();
    expect(screen.getByText(/MOCHI AI AGENT/i)).toBeInTheDocument();
  });
});
