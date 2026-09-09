import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TamagotchiHUD } from '../components/TamagotchiHUD';
import { TamagotchiStats, ColorTheme } from '../types/tamagotchi';

describe('TamagotchiHUD Component', () => {
  const mockStats: TamagotchiStats = {
    hunger: 80,
    energy: 90,
    happiness: 75,
    battery: 100,
  };

  const defaultProps = {
    stats: mockStats,
    theme: 'cyan' as ColorTheme,
    isSleeping: false,
    onFeed: vi.fn(),
    onPlay: vi.fn(),
    onSleep: vi.fn(),
    onClean: vi.fn(),
    onPet: vi.fn(),
    onThemeChange: vi.fn(),
  };

  it('renders all action buttons and status indicators', () => {
    render(<TamagotchiHUD {...defaultProps} />);

    expect(screen.getByText(/feed/i)).toBeInTheDocument();
    expect(screen.getByText(/play/i)).toBeInTheDocument();
    expect(screen.getByText(/sleep/i)).toBeInTheDocument();
    expect(screen.getByText(/clean/i)).toBeInTheDocument();
  });

  it('calls respective callbacks when action buttons are clicked', () => {
    render(<TamagotchiHUD {...defaultProps} />);

    fireEvent.click(screen.getByText(/feed/i));
    expect(defaultProps.onFeed).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText(/play/i));
    expect(defaultProps.onPlay).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText(/sleep/i));
    expect(defaultProps.onSleep).toHaveBeenCalledTimes(1);
  });
});
