import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VirtualRobotFace } from '../components/VirtualRobotFace';

describe('VirtualRobotFace Component with Action Animations', () => {
  it('renders canvas element with activeAction prop', () => {
    render(
      <VirtualRobotFace 
        expression="neutral" 
        activeAction="feeding"
        theme="cyan" 
        onPet={vi.fn()} 
      />
    );

    const canvas = screen.getByTestId('virtual-robot-canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('triggers onPet callback when canvas is clicked', () => {
    const handlePet = vi.fn();
    render(
      <VirtualRobotFace 
        expression="neutral" 
        activeAction="idle"
        theme="cyan" 
        onPet={handlePet} 
      />
    );

    const canvas = screen.getByTestId('virtual-robot-canvas');
    fireEvent.click(canvas);

    expect(handlePet).toHaveBeenCalledTimes(1);
  });
});
