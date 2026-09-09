import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MochiHelmet } from '../components/MochiHelmet'

describe('MochiHelmet Component', () => {
  it('renders base chassis and oled screen', () => {
    render(
      <MochiHelmet 
        helmet="none" 
        emotion="idle" 
        speed={0} 
        onPet={vi.fn()} 
      />
    )
    expect(screen.getByTestId('mochi-chassis')).toBeInTheDocument()
    expect(screen.getByTestId('oled-display')).toBeInTheDocument()
  })

  it('renders cyber visor when helmet is cyber_visor', () => {
    render(
      <MochiHelmet 
        helmet="cyber_visor" 
        emotion="idle" 
        speed={0} 
        onPet={vi.fn()} 
      />
    )
    expect(screen.getByTestId('helmet-cyber_visor')).toBeInTheDocument()
  })

  it('renders neko ears when helmet is neko_ears', () => {
    render(
      <MochiHelmet 
        helmet="neko_ears" 
        emotion="idle" 
        speed={0} 
        onPet={vi.fn()} 
      />
    )
    expect(screen.getByTestId('helmet-neko_ears')).toBeInTheDocument()
  })

  it('calls onPet when clicked or tapped', () => {
    const onPet = vi.fn()
    render(
      <MochiHelmet 
        helmet="carbon_jdm" 
        emotion="idle" 
        speed={0} 
        onPet={onPet} 
      />
    )
    fireEvent.click(screen.getByTestId('mochi-chassis'))
    expect(onPet).toHaveBeenCalledTimes(1)
  })
})
