import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VirtualRobotFace } from '../components/VirtualRobotFace';

describe('VirtualRobotFace Component', () => {
  it('renders a full-screen canvas element for the robot face', () => {
    render(
      <VirtualRobotFace 
        expression="neutral" 
        theme="cyan" 
        onPet={vi.fn()} 
      />
    );

    const canvas = screen.getByTestId('virtual-robot-canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas.className).toContain('w-full');
    expect(canvas.className).toContain('h-full');
  });

  it('triggers onPet callback when canvas is clicked', () => {
    const handlePet = vi.fn();
    render(
      <VirtualRobotFace 
        expression="neutral" 
        theme="cyan" 
        onPet={handlePet} 
      />
    );

    const canvas = screen.getByTestId('virtual-robot-canvas');
    fireEvent.click(canvas);

    expect(handlePet).toHaveBeenCalledTimes(1);
  });
});
